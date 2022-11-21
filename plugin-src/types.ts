export type TMinX = number
export type TMinY = number

export type TFrameOptions = {
  initXY?: [number, number]
}

export enum EDirection {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL'
}

export enum EActions {
  WRAP_BY_COUNT,
  WRAP_BY_WIDTH,
  SELECT_WRAPPER,
  SELECT_ITEMS
}

export type TActionParams = {
  [key: string]: any
}

export type TAction = {
  type: EActions
  params?: TActionParams,
}

export type TMessage = {
  pluginMessage: TAction
}

export type TSceneNodePositionProp = Record<keyof Pick<SceneNode, 'x' | 'y'>, string>
export type TSceneNodeDimensionProp = Record<keyof Pick<SceneNode, 'width' | 'height'>, string>

