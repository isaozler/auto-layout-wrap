import { createStitches, globalCss } from '@stitches/react'

export const globalStyles = globalCss({
  ':root': {
    buttonBg: `var(--bg-primary-btn)`,
  }
})

export const { styled } = createStitches({
  theme: {
    colors: {},
  },
})

export const Table = styled('table', {
  width: '100%',
  border: 0,
  boxSizing: 'border-box',
  borderCollapse: 'collapse',
  tr: {
    textAlign: 'left',
    td: {
      textAlign: 'left',
      fontSize: '1rem',
    }
  }
})

export const TrHead = styled('tr', {
  fontSize: '1.2rem',
  td: {
    textAlign: 'left',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  variants: {
    isSpaceBefore: {
      true: {
        td: {
          paddingTop: 10,
        }
      }
    },
    isSpaceAfter: {
      true: {
        td: {
          paddingBottom: 10,
        }
      }
    }
  }
})

export const Divider = styled('div', {
  display: 'block',
  width: '100%',
  height: 2,
  background: 'var(--figma-color-border)',
  marginTop: 20,
  marginBottom: 20,
})

export const TrProperties = styled('tr', {
  td: {
    textAlign: 'left',
    fontSize: '1rem',
    width: '100%',
  },
  variants: {
    isSpaceBefore: {
      true: {
        td: {
          paddingTop: 10,
        }
      }
    }
  }
})

export const PropertyInput = styled('input', {
  textAlign: 'left',
  fontSize: '1rem',
  fontWeight: 'normal',
  // width: 100,
  height: 24,
  border: 'none',
  borderColor: 'black',
  borderBottom: '1px solid var(--figma-color-border)',
  outline: 'none',
  '&:focus': {
    borderColor: 'var(--figma-color-border-onbrand)'
  }
})

const iconSize = 32

export const DirectionButtonWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
})

export const DirectionButton = styled('button', {
  height: iconSize,
  padding: 0,
  margin: 0,
  marginBottom: 14,
  paddingRight: 14,
  border: 'none',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  fontWeight: 'bold',
  cursor: 'pointer',
  variants: {
    active: {
      true: {
        background: 'black',
        color: 'white',
      },
      false: {
        opacity: 0.5,
        background: 'transparent',
        color: 'black',
        '&:hover': {
          opacity: 1,
          color: 'red',
        },
      }
    }
  },
  '&:not(:last-of-type)': {
    marginRight: 10,
  }
})

export const HeaderImageWrapper = styled('div', {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: 20,
  paddingTop: 0,
})

export const FlowTransformImage = styled('img', {
  width: '100%',
  maxWidth: '100%',
})

export const DirectionImage = styled('img', {
  width: iconSize,
  height: iconSize,
  marginRight: 14,
})

export const PrimaryButton = styled('button', {
  color: 'var(--figma-color-bg-brand)',
  background: 'var(--figma-color-bg-pressed)',
  width: '100%',
  border: 0,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  padding: 10,
  cursor: 'pointer',
  variants: {
    isSpaceBefore: {
      true: {
        marginTop: 10,
      }
    },
    isSpaceAfter: {
      true: {
        marginBottom: 10,
      }
    },
  },
  '&:hover': {
    background: 'var(--figma-color-bg-brand)',
    color: 'var(--figma-color-bg-pressed)',
  }
})

