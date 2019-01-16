import React from 'react'
import styled from 'styled-components'
import defineCoordinates from './define-coordinates'
import Dimensions from './dimensions'
import PanZoom from './pan-zoom'
import Candlestick from './candlestick'
import DateAxis from './date-axis' 
import PriceAxis from './price-axis'

const Styled = styled.div`
  svg {
    display: block;
    width: 100vw;
    height: 100vh;
  }
`

export default function({ data }) {
  const granularity = data[0].granularity
  const oldestOpen = data[0].time.valueOf()
  const mostRecentOpen = data[data.length - 1].time.valueOf()

  return (
    <Styled>
      <Dimensions
        render={({ width, height }) =>
          <PanZoom
            initialStart={mostRecentOpen - 9 * granularity}
            initialEnd={mostRecentOpen + granularity}
            min={data[0].time.valueOf()}
            max={mostRecentOpen + granularity}
            minWindowSize={10 * granularity}
            maxWindowSize={1000 * granularity}
            render={({ start: startTime, end: endTime }) => {
              const candlesticks = data.slice(
                Math.floor((startTime - oldestOpen) / granularity),
                Math.ceil((endTime - granularity - oldestOpen) / granularity) + 1
              )
              
              const coordinates = defineCoordinates({
                width: width - 50,
                height: height - 50,
                minX: startTime.valueOf(),
                maxX: endTime.valueOf(),
                minY: Math.min(...candlesticks.map(c => c.low)),
                maxY: Math.max(...candlesticks.map(c => c.high)),
              })
  
              return (
                <svg className="chart">
                  <DateAxis coordinates={coordinates} />
                  <PriceAxis coordinates={coordinates} />
                  {candlesticks.map(candlestick =>
                    <Candlestick
                      key={candlestick.time}
                      coordinates={coordinates}
                      candlestick={candlestick}
                    />
                  )}
                </svg>
              )
            }}
          />
        }
      />
    </Styled>
  )
}
