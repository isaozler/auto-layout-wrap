import { EActions, EDirection, TAction } from '../plugin-src/types'
import { frameSelection, getFrameGroups, getGap, getMinMaxDimensions, groupElementsByWrapper, sortElementByProp } from './helpers'

figma.showUI(__html__, {
  height: 540,
  width: 320,
  themeColors: true,
});

figma.ui.onmessage = (action: TAction) => {
  if (!figma.currentPage.selection.length) {
    return figma.notify('Please make a selection first')
  }

  const { params } = action

  if (action.type === EActions.WRAP_BY_COUNT && params) {
    const selectionElements = [...figma.currentPage.selection].filter((node) => node.type !== 'FRAME')

    if (figma.currentPage.selection.filter((node) => node.type === 'FRAME').length) {
      figma.notify('Frame elements will be excluded from grid!')
    }

    if (!isNaN(params.count) && params.count > 0 && params.count < selectionElements.length) {
      const elements = sortElementByProp(selectionElements, params.direction === EDirection.VERTICAL ? 'y' : 'x')
      const [firstElement] = params.direction === EDirection.VERTICAL ? [...elements] : [...elements].reverse()
      const gap = getGap(elements, params.direction)
      const parentFrame = figma.createFrame()
      parentFrame.x = firstElement.x
      parentFrame.y = firstElement.y
      parentFrame.layoutMode = params.direction === EDirection.HORIZONTAL ? EDirection.VERTICAL : EDirection.HORIZONTAL
      parentFrame.itemSpacing = params.gap || gap
      parentFrame.fills = []

      const groups = getFrameGroups(elements, params)
      groups.forEach((group) => {
        if (group) {
          const frame = frameSelection(group, params)
          parentFrame.appendChild(frame as unknown as SceneNode)
        }
      })

      const [widthMax, heightMax] = getMinMaxDimensions(parentFrame, params.direction)
      parentFrame.resize(widthMax, heightMax)
    } else {
      frameSelection(selectionElements, params)
    }
  } else if (action.type === EActions.SELECT_WRAPPER) {
    const parentFrame = figma.currentPage.selection.find((node) => node.type === 'FRAME') as FrameNode
    const elements = figma.currentPage.selection.filter((node) => node.type !== 'FRAME')

    if (!parentFrame) {
      return figma.notify('Please include 1 frame in your selection')
    }

    if (figma.currentPage.selection.filter((node) => node.type === 'FRAME').length > 1) {
      return figma.notify('You can only select 1 frame to wrap your selection into auto-flow!')
    }

    if (!elements.length) {
      return figma.notify('Please select at least 1 element besides a frame')
    }

    if (!params?.gap.horizontal || !params?.gap.vertical) {
      return figma.notify('Please provide both horizontal and vertical gap sizes in case you go for option 1')
    }

    parentFrame.layoutMode = EDirection.VERTICAL
    parentFrame.itemSpacing = params.gap.vertical

    const groups = groupElementsByWrapper(parentFrame, elements)

    Object.values(groups).forEach((group) => {
      if (group) {
        const framedSelection = frameSelection(group.reverse(), {
          direction: EDirection.HORIZONTAL,
          gap: params.gap.horizontal,
        })
        parentFrame.appendChild(framedSelection as unknown as SceneNode)
      }
    })

    parentFrame.resize(parentFrame.width, parentFrame.height)
  }
};
