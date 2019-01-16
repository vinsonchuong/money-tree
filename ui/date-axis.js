import React, { Fragment } from 'react'
import styled from 'styled-components'
import { range } from 'lodash'
import { format } from 'date-fns'

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
    minX: minTime, maxX: maxTime,
    minY, maxY,
    x, y
  }
}) {
  const granularity = 1000 * 60 * 60

  return (
    <Styled className="date-axis">
      <line
        x1={x(minTime)}
        y1={y(minY)}
        x2={x(maxTime)}
        y2={y(minY)}
      />
      {
        range(
          roundUp(granularity, minTime),
          roundDown(granularity, maxTime) + 1,
          granularity
        ).map(time =>
          <Fragment key={time}>
            <text
              x={x(time)}
              y={y(minY) + 5}
              textAnchor="middle"
              dominantBaseline="hanging"
            >
              {format(new Date(time), 'h:mma')}
            </text>
            <line
              x1={x(time)}
              y1={y(maxY)}
              x2={x(time)}
              y2={y(minY)}
            />
          </Fragment>
        )
      }
    </Styled>
  )
}

function roundUp(granularity, number) {
  return Math.ceil(number / granularity) * granularity
}

function roundDown(granularity, number) {
  return Math.floor(number / granularity) * granularity
}
