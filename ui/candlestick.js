import React from 'react'
import cx from 'classnames'
import styled from 'styled-components'

const Styled = styled.g`
  stroke-width: 0;
  fill: transparent;
  opacity: 0.8;

  &.increasing {
    stroke: #2d882d;
    fill: #2d882d;
  }

  &.decreasing {
    stroke: #aa3939;
    fill: #aa3939;
  }

  line {
    stroke-width: 2;
  }
`

const margin = 2

export default function({
  coordinates: { x, y, width, height },
  candlestick: { time, granularity, open, close, high, low }
}) {
  const bodyTop = Math.max(open, close)
  const bodyBottom = Math.min(open, close)

  return (
    <Styled
      className={cx('candlestick', { increasing: close >= open, decreasing: close < open })}
    >
      <line
        className="upper-shadow"
        x1={x(time.valueOf() + granularity / 2)}
        y1={y(high)}
        x2={x(time.valueOf() + granularity / 2)}
        y2={y(bodyTop)}
      />
      <rect
        className="real-body"
        x={x(time) + margin}
        width={width(granularity) - 2 * margin}
        y={y(bodyTop)}
        height={height(bodyTop - bodyBottom)}
      />
      <line
        className="lower-shadow"
        x1={x(time.valueOf() + granularity / 2)}
        y1={y(bodyBottom)}
        x2={x(time.valueOf() + granularity / 2)}
        y2={y(low)}
      />
    </Styled>
  )
}
