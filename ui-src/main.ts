import { TAction } from "../plugin-src/types"

export const publish = (action: TAction) => {
  parent.postMessage(
    { pluginMessage: action },
    '*',
  )
}
