import React from 'react'
import defineCoordinates from './define-coordinates'
import Dimensions from './dimensions'
import PanZoom from './pan-zoom'
import Candlestick from './candlestick'
import DateAxis from './date-axis' 
import PriceAxis from './price-axis'
import MousePosition from './mouse-position'

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
                xName: 'time',
                yName: 'price',
                width: width - 60,
                height: height - 50,
                minTime: startTime.valueOf(),
                maxTime: endTime.valueOf(),
                minPrice: Math.min(...candlesticks.map(c => c.low)),
                maxPrice: Math.max(...candlesticks.map(c => c.high)),
              })
  
              return (
                <svg width="100vw" height="100vh" style={{ display: 'block' }}>
                  <DateAxis coordinates={coordinates} />
                  <PriceAxis coordinates={coordinates} />
                  {candlesticks.map(candlestick =>
                    <Candlestick
                      key={candlestick.time}
                      coordinates={coordinates}
                      candlestick={candlestick}
                    />
                  )}
                  <MousePosition coordinates={coordinates} />
                </svg>
              )
            }}
          />
        }
      />
    </div>
  )
}
