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
    minX, maxX,
    minY, maxY,
    time, price
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
        x={minX}
        y={minY}
        width={maxX - minX}
        height={maxY - minY}
      />
      {position &&
        <>
          <line
            className="grid-line"
            x1={minX}
            y1={position.y}
            x2={maxX}
            y2={position.y}
          />
          <line
            className="grid-line"
            x1={position.x}
            y1={minY}
            x2={position.x}
            y2={maxY}
          />
          <text
            x={position.x}
            y={maxY + 5}
            textAnchor="middle"
            dominantBaseline="hanging"
          >
            {format(new Date(time(position.x)), 'h:mma')}
          </text>
          <text
            x={maxX + 5}
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
