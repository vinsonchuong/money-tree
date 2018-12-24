import React from 'react'
import styled from 'styled-components'
import Candlestick from './candlestick'

const Styled = styled.div`
  svg {
    display: block;
    width: 100%;
    height: 600px;
  }
`

const candleWidth = 100

export default function({ data }) {
  const max = Math.max(...data.map(d => d.high))
  const min = Math.min(...data.map(d => d.low))
  const range = max - min

  return (
    <Styled>
      <svg viewBox={`0 ${-max} ${data.length * candleWidth} ${range}`}>
        {data.map((candlestick, index) =>
          <Candlestick key={index} index={index} candlestick={candlestick} />
        )}
      </svg>
    </Styled>
  )
}
