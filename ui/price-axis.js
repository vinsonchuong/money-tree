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
    minTime, maxTime,
    minPrice, maxPrice,
    x, y
  }
}) {
  return (
    <Styled className="price-axis">
      <line
        x1={x(maxTime)}
        y1={y(minPrice)}
        x2={x(maxTime)}
        y2={y(maxPrice)}
      />
      {range(Math.ceil(minPrice), Math.floor(maxPrice) + 1).map(price =>
        <Fragment key={price}>
          <text
            x={x(maxTime) + 5}
            y={y(price)}
            dominantBaseline="middle"
          >
            ${price}
          </text>
          <line
            x1={x(minTime)}
            y1={y(price)}
            x2={x(maxTime)}
            y2={y(price)}
          />
        </Fragment>
      )}
    </Styled>
  )
}
