import React from 'react'
import styled from 'styled-components'

const Styled = styled.g`
  stroke-width: 0;
  fill: #eee;
`

const margin = 2

export default function({
  coordinates: { maxY, x, y, width, height },
  candlestick: { time, granularity, volume }
}) {
  return (
    <Styled className="volume-bar">
      <rect
        x={x(time) + margin}
        width={width(granularity) - 2 * margin}
        y={y(volume)}
        height={height(volume)}
      />
    </Styled>
  )
}
