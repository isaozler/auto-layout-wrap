import React, { useRef, useState } from 'react'
import { EActions, EDirection } from '../plugin-src/types'
import { publish } from '../ui-src/main'
import horizontal from '../assets/horizontal.png'
import vertical from '../assets/vertical.png'
import flowTransformation from '../assets/flowTransformation.png'
import './App.css'

import {
  Table,
  TrHead,
  TrProperties,
  PropertyInput,
  DirectionButtonWrapper,
  DirectionButton,
  DirectionImage,
  PrimaryButton,
  Divider,
  FlowTransformImage,
  HeaderImageWrapper,
} from './styles'

function App() {
  const countRef = useRef<HTMLInputElement>(null)
  const gapRef = useRef<HTMLInputElement>(null)
  const gapWrapHorizontalRef = useRef<HTMLInputElement>(null)
  const gapWrapVerticalRef = useRef<HTMLInputElement>(null)
  const [activeDirection, setDirection] = useState<EDirection>(
    EDirection.HORIZONTAL,
  )
  const doWrapByCount = () => {
    publish({
      type: EActions.WRAP_BY_COUNT,
      params: {
        count: countRef.current?.value ? Number(countRef.current.value) : null,
        direction: activeDirection,
        gap: gapRef.current?.value ? Number(gapRef.current.value) : null,
        gapWrap: {
          horizontal: gapWrapHorizontalRef.current?.value
            ? Number(gapWrapHorizontalRef.current.value)
            : null,
          vertical: gapWrapVerticalRef.current?.value
            ? Number(gapWrapVerticalRef.current.value)
            : null,
        },
      },
    })
  }

  const doWrapByContainer = () => {
    publish({
      type: EActions.SELECT_WRAPPER,
      params: {
        gap: {
          horizontal: gapWrapHorizontalRef.current?.value
            ? Number(gapWrapHorizontalRef.current.value)
            : null,
          vertical: gapWrapVerticalRef.current?.value
            ? Number(gapWrapVerticalRef.current.value)
            : null,
        },
      },
    })
  }

  return (
    <main>
      <Table>
        <TrHead isSpaceAfter>
          <td colSpan={2}>Option 1: Wrap Selection</td>
        </TrHead>
        <tr>
          <td colSpan={2}>
            <HeaderImageWrapper>
              <FlowTransformImage src={flowTransformation} />
            </HeaderImageWrapper>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            In case you want to make the elements to fit into a frame, you
            should select the elements and 1 frame you want to make it flow
            into.
          </td>
        </tr>
        <TrProperties isSpaceBefore>
          <td>Horizontal gap size</td>
          <td>
            <PropertyInput
              type="number"
              min={0}
              ref={gapWrapHorizontalRef}
              placeholder="Horizontal gap size"
            />
          </td>
        </TrProperties>
        <TrProperties>
          <td>Vertical gap size</td>
          <td>
            <PropertyInput
              type="number"
              min={0}
              ref={gapWrapVerticalRef}
              placeholder="Vertical gap size"
            />
          </td>
        </TrProperties>
        <tr>
          <td colSpan={2}>
            <PrimaryButton isSpaceBefore onClick={doWrapByContainer}>
              Create auto-flow
            </PrimaryButton>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <Divider />
          </td>
        </tr>
        <TrHead isSpaceAfter>
          <td colSpan={2}>Option 2: Create grid from elements</td>
        </TrHead>
        <tr>
          <td colSpan={2}>
            <DirectionButtonWrapper>
              {Object.values(EDirection).map((direction) => (
                <DirectionButton
                  key={direction}
                  onClick={() => setDirection(direction)}
                  active={direction === activeDirection}
                >
                  {direction === EDirection.HORIZONTAL ? (
                    <DirectionImage src={horizontal} />
                  ) : (
                    <DirectionImage src={vertical} />
                  )}
                  {direction}
                </DirectionButton>
              ))}
            </DirectionButtonWrapper>
          </td>
        </tr>
        <TrHead isSpaceBefore>
          <td colSpan={2}>Properties</td>
        </TrHead>
        <TrProperties>
          <td>Wrap count</td>
          <td>
            <PropertyInput
              type="number"
              min={0}
              ref={countRef}
              placeholder="Optional"
            />
          </td>
        </TrProperties>
        <TrProperties>
          <td>Gap size</td>
          <td>
            <PropertyInput
              type="number"
              min={0}
              ref={gapRef}
              placeholder="Optional"
            />
          </td>
        </TrProperties>
        <tr>
          <td colSpan={2}>
            <PrimaryButton isSpaceBefore isSpaceAfter onClick={doWrapByCount}>
              Create grid
            </PrimaryButton>
          </td>
        </tr>
      </Table>
    </main>
  )
}

export default App
