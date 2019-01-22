import React, { useState } from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'

const Styled = styled.g`
  .bounding-box {
    fill: none;
  }

  .grid-line {
    stroke: #000;
    stroke-width: 2;
    stroke-dasharray: 5, 5;
  }
`

export default function({
  coordinates: {
    x, y,
    time, price,
    width, height,
    minTime, maxTime,
    minPrice, maxPrice
  }
}) {
  const [position, setPosition] = useState(null)

  return (
    <Styled
      pointerEvents="bounding-box"
      onMouseMove={e => setPosition({ x: e.clientX, y: e.clientY })}
    >
      <rect
        className="bounding-box"
        x={x(minTime)}
        y={y(maxPrice)}
        width={width(maxTime - minTime)}
        height={height(maxPrice - minPrice)}
      />
      {position &&
        <>
          <line
            className="grid-line"
            x1={x(minTime)}
            y1={position.y}
            x2={x(maxTime)}
            y2={position.y}
          />
          <line
            className="grid-line"
            x1={position.x}
            y1={y(maxPrice)}
            x2={position.x}
            y2={y(minPrice)}
          />
          <text
            x={position.x}
            y={y(minPrice) + 5}
            textAnchor="middle"
            dominantBaseline="hanging"
          >
            {format(new Date(time(position.x)), 'h:mma')}
          </text>
          <text
            x={x(maxTime) + 5}
            y={position.y}
            dominantBaseline="middle"
          >
            ${price(position.y).toFixed(2)}
          </text>
        </>
      }
    </Styled>
  )
}
