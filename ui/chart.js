import React from 'react'
import defineCoordinates from './define-coordinates'
import Dimensions from './dimensions'
import PanZoom from './pan-zoom'
import Candlestick from './candlestick'
import VolumeBar from './volume-bar'
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
              const minPrice = Math.min(...candlesticks.map(c => c.low))
              const maxPrice = Math.max(...candlesticks.map(c => c.high))
              
              const coordinates = defineCoordinates({
                xName: 'time',
                yName: 'price',
                width: width - 60,
                height: height - 50,
                minTime: startTime.valueOf(),
                maxTime: endTime.valueOf(),
                minPrice: minPrice - 0.1 * (maxPrice - minPrice),
                maxPrice: maxPrice + 0.1 * (maxPrice - minPrice)
              })

              const volumeCoordinates = defineCoordinates({
                xName: 'time',
                yName: 'volume',
                width: width - 60,
                height: height - 50,
                minTime: startTime.valueOf(),
                maxTime: endTime.valueOf(),
                minVolume: 0,
                maxVolume: Math.max(...candlesticks.map(c => c.volume)) * 3,
              })
  
              return (
                <svg width="100vw" height="100vh" style={{ display: 'block' }}>
                  <DateAxis coordinates={coordinates} />
                  <PriceAxis coordinates={coordinates} />

                  {candlesticks.map(candlestick =>
                    <React.Fragment key={candlestick.time}>
                      <VolumeBar
                        coordinates={volumeCoordinates}
                        candlestick={candlestick}
                      />
                      <Candlestick
                        coordinates={coordinates}
                        candlestick={candlestick}
                      />
                    </React.Fragment>
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
