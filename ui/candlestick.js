import React from 'react'
import styled from 'styled-components'

const Styled = styled.g`
  stroke-width: 2;
  fill: transparent;

  &.increasing {
    stroke: #2d882d;
  }

  &.decreasing {
    stroke: #aa3939;
    fill: #aa3939;
  }
`

const width = 100
const margin = 10

export default function({ index, candlestick: { open, close, high, low } }) {
  const bodyTop = Math.max(open, close)
  const bodyBottom = Math.min(open, close)

  return (
    <Styled
      className={close > open ? 'increasing': 'decreasing'}
      transform="scale(1, -1)"
    >
      <line
        x1={(index + 0.5) * width}
        y1={high}
        x2={(index + 0.5) * width}
        y2={bodyTop}
      />
      <rect
        x={index * width + margin}
        width={width - 2 * margin}
        y={bodyBottom}
        height={bodyTop - bodyBottom}
      />
      <line
        x1={(index + 0.5) * width}
        y1={bodyBottom}
        x2={(index + 0.5) * width}
        y2={low}
      />
    </Styled>
  )
}
