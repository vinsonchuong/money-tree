import React from 'react'
import styled from 'styled-components'

const Styled = styled.g`
  polyline {
    stroke-width: 2;
    fill: none;
  }
`

export default function({
  coordinates: { x, y, maxX },
  candlesticks,
  name,
  color
}) {
  return (
    <Styled className="trend-line">
      <polyline
        points={
        candlesticks
          .map(c => `${x(c.time.valueOf() + c.granularity)},${y(c[name])}`)
         .join(' ')
        }
        stroke={color}
      />
      <text
        x={maxX + 5}
        y={y(candlesticks[candlesticks.length - 1][name])}
        dominantBaseline="middle"
        fill={color}
      >
        {name}
      </text>
    </Styled>
  )
}
