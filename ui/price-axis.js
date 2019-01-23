import React, { Fragment } from 'react'
import styled from 'styled-components'
import { range } from 'lodash'

const Styled = styled.g`
  line {
    stroke: #ddd;
    stroke-width: 2;
  }

  text {
    fill: #000;
  }
`

export default function({
  coordinates: {
    minX, maxX,
    minY, maxY,
    minPrice, maxPrice,
    y
  }
}) {
  return (
    <Styled className="price-axis">
      <line
        x1={maxX}
        y1={minY}
        x2={maxX}
        y2={maxY}
      />
      {range(Math.ceil(minPrice), Math.floor(maxPrice) + 1).map(price =>
        <Fragment key={price}>
          <text
            x={maxX + 5}
            y={y(price)}
            dominantBaseline="middle"
          >
            ${price}
          </text>
          <line
            x1={minX}
            y1={y(price)}
            x2={maxX}
            y2={y(price)}
          />
        </Fragment>
      )}
    </Styled>
  )
}
