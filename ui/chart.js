import React from 'react'
import defineCoordinates from './define-coordinates'
import Dimensions from './dimensions'
import PanZoom from './pan-zoom'
import Candlestick from './candlestick'
import DateAxis from './date-axis' 
import PriceAxis from './price-axis'

export default function({ data }) {
  const granularity = data[0].granularity
  const oldestOpen = data[0].time.valueOf()
  const mostRecentOpen = data[data.length - 1].time.valueOf()

  return (
    <div
      className="chart"
      style={{ width: '100vw', height: '100vh' }}
    >
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
                <svg width="100vw" height="100vh">
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
    </div>
  )
}
