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
    minX, maxX,
    minY, maxY,
    minTime, maxTime,
    x
  }
}) {
  const granularity = 1000 * 60 * 60

  return (
    <Styled className="date-axis">
      <line
        x1={minX}
        y1={maxY}
        x2={maxX}
        y2={maxY}
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
              y={maxY + 5}
              textAnchor="middle"
              dominantBaseline="hanging"
            >
              {
                format(new Date(time), 'ha') === '12am'
                  ? format(new Date(time), 'MMM D')
                  : format(new Date(time), 'ha')
              }
            </text>
            <line
              x1={x(time)}
              y1={minY}
              x2={x(time)}
              y2={maxY}
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
