import { EDirection, TAction, TActionParams, TFrameOptions, TMinX, TMinY, TSceneNodeDimensionProp, TSceneNodePositionProp } from './types'

export const getMin = (elements: readonly SceneNode[], prop: keyof TSceneNodePositionProp) => {
  return Math.min(...elements.reduce((res, child) => ([...res, child[prop]]), [] as number[]))
}

export const getMax = (elements: readonly SceneNode[], prop: keyof TSceneNodePositionProp) => {
  return Math.max(...elements.reduce((res, child) => ([...res, child[prop]]), [] as number[]))
}

export const getAnchorXY = (elements: readonly SceneNode[]): [TMinX, TMinY] => {
  return [getMin(elements, 'x'), getMin(elements, 'y')]
}

export const getMaxPositionElement = (elements: readonly SceneNode[], prop: keyof TSceneNodePositionProp) => {
  const [maxXElement] = [...elements].sort((a, b) => b[prop] - a[prop])
  return maxXElement
}

export const getMaxDimensionElement = (elements: readonly SceneNode[], prop: keyof TSceneNodeDimensionProp) => {
  const [maxXElement] = [...elements].sort((a, b) => b[prop] - a[prop])
  return maxXElement
}

export const getDimensionSum = (elements: readonly SceneNode[], prop: keyof TSceneNodeDimensionProp, gap?: number) => {
  return elements.reduce((res, child, index) => (res + child[prop] + (gap && index ? gap : 0)), 0 as number)
}

export const getGap = (elements: readonly SceneNode[], direction: EDirection, fallbackCall?: boolean): number => {
  const positionProp: keyof TSceneNodePositionProp = direction === EDirection.VERTICAL ? 'y' : 'x'
  const prop = direction === EDirection.VERTICAL ? 'height' : 'width'
  const minDimension = getMin(elements, positionProp)
  const maxDimensionElement = getMaxPositionElement(elements, positionProp)
  const maxDimension = maxDimensionElement[positionProp] + maxDimensionElement[prop]

  const contentSize = elements.reduce((acc, node) => acc + node[prop], 0)

  const gap = ((maxDimension - minDimension) - contentSize) / (elements.length - 1)

  if (gap < 0 && !fallbackCall) {
    return getGap(elements, direction === EDirection.HORIZONTAL ? EDirection.VERTICAL : EDirection.HORIZONTAL, true)
  }

  return !gap || gap < 0 ? 0 : gap
}

export const sortElementByProp = (elements: readonly SceneNode[], prop: keyof TSceneNodePositionProp | keyof TSceneNodeDimensionProp, isDesc?: boolean) => {
  console.log('DIRECTION TO SORT', prop)

  const sortedElements = [...elements].sort((a, b) => b[prop] - a[prop])
  return !!isDesc ? sortedElements.reverse() : sortedElements
}

export const frameSelection = (elements: readonly SceneNode[], params: TActionParams, options?: TFrameOptions) => {
  const { initXY } = options || {}
  const initSortProp = params.direction === EDirection.VERTICAL ? 'y' : 'x'
  const sortedElements = sortElementByProp(elements, initSortProp, true)
  const [firstSelection] = sortedElements

  if (firstSelection.type !== 'FRAME') {
    const frame = figma.createFrame()
    const gap = params.gap || getGap(sortedElements, params.direction)
    const dimensionProp: keyof TSceneNodeDimensionProp = params.direction === EDirection.VERTICAL ? 'height' : 'width'
    const frameSize = getDimensionSum(sortedElements, dimensionProp, gap)
    const [minX, minY] = initXY || getAnchorXY(sortedElements)

    frame.x = minX
    frame.y = minY
    frame.layoutMode = params.direction || EDirection.HORIZONTAL
    frame.itemSpacing = gap
    frame.fills = []

    if (params.direction === EDirection.VERTICAL) {
      frame.resize(getMaxDimensionElement(sortedElements, 'width').width, frameSize)
    } else {
      frame.resize(frameSize, getMaxDimensionElement(sortedElements, 'height').height)
    }

    sortedElements.forEach((child, index) => {
      frame.appendChild(child)
    })

    return frame
  }
}

export const getFrameGroups = (elements: readonly SceneNode[], params: TActionParams) => {
  let sortedElements = [...elements]

  const direction = params.direction === EDirection.VERTICAL ? 'y' : 'x'

  if (params.isSkipSorting) {
    sortedElements = sortElementByProp(elements, direction, params.direction === EDirection.HORIZONTAL)
  }

  const frameGroups = [...sortedElements].reduce((res, node, index) => {
    const chunkIndex = Math.floor(index / params.count)

    if (!res[chunkIndex]) {
      res[chunkIndex] = []
    }

    res[chunkIndex].push(node)

    return res
  }, [] as SceneNode[][])

  return params.direction === EDirection.HORIZONTAL ? frameGroups : frameGroups.reduce((res, group) => ([...res, group.reverse()]), [] as SceneNode[][]).reverse()
}

export const getMinMaxDimensions = (frame: FrameNode, direction: EDirection) => {
  const rangeDimension = direction === EDirection.VERTICAL ? 'height' : 'width'
  const sumDimension = direction === EDirection.VERTICAL ? 'width' : 'height'
  const maxRangeDimension = frame.children.reduce((res, childFrame) => {
    return [
      ...res,
      childFrame[rangeDimension],
    ]
  }, [] as number[])
  const maxSumDimension = frame[sumDimension]

  if (direction === EDirection.VERTICAL) {
    return [maxSumDimension, Math.max(...maxRangeDimension)]
  }

  return [Math.max(...maxRangeDimension), maxSumDimension]
}

export const getContainerDimensions = (wrapper: FrameNode) => {
  const {
    width,
    height,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop
  } = wrapper || {}

  return [
    width - paddingLeft - paddingRight,
    height - paddingBottom - paddingTop
  ]
}

export const groupElementsByWrapper = (wrapper: FrameNode, elements: SceneNode[]) => {
  const [containerWidth] = getContainerDimensions(wrapper)
  let currentIndex = 0
  const groupElements = [...sortElementByProp(elements, 'x', true)]
  const groups = groupElements.reduce((res, node) => {
    const currentGroup = res[currentIndex] || []
    const currentGroupWidth = currentGroup.length ? currentGroup.reduce((acc, accNode) => acc + accNode.width, 0) : 0

    if (currentGroupWidth + node.width > containerWidth) {
      currentIndex += 1
    }

    res[currentIndex] = [
      ...(res[currentIndex]?.length ? res[currentIndex] : []),
      node
    ]

    return res
  }, {} as { [key: string | number]: SceneNode[] })

  return groups
}
