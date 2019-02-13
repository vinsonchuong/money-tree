import React from 'react'
import defineCoordinates from './define-coordinates'
import Dimensions from './dimensions'
import PanZoom from './pan-zoom'
import Candlestick from './candlestick'
import VolumeBar from './volume-bar'
import VolumeByPrice from './volume-by-price'
import TrendLine from './trend-line'
import DateAxis from './date-axis' 
import PriceAxis from './price-axis'
import MousePosition from './mouse-position'

export default function({ candlesticks, volumeByPrice }) {
  const granularity = candlesticks[0].granularity
  const oldestOpen = candlesticks[0].time.valueOf()
  const mostRecentOpen = candlesticks[candlesticks.length - 1].time.valueOf()

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
            min={candlesticks[0].time.valueOf()}
            max={mostRecentOpen + granularity}
            minWindowSize={10 * granularity}
            maxWindowSize={1000 * granularity}
            render={({ start: startTime, end: endTime }) => {
              const candlesticksInView = candlesticks.slice(
                Math.floor((startTime - oldestOpen) / granularity),
                Math.ceil((endTime - granularity - oldestOpen) / granularity) + 1
              )
              const minPrice = Math.min(...candlesticksInView.map(c => c.low))
              const maxPrice = Math.max(...candlesticksInView.map(c => c.high))

              const volumeByPriceInView = volumeByPrice
                .filter(({ priceRange }) => priceRange >= minPrice && priceRange <= maxPrice)
              
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

              const volumeByPriceCoordinates = defineCoordinates({
                xName: 'volume',
                yName: 'price',
                width: width - 60,
                height: height - 50,
                minVolume: 0,
                maxVolume: Math.max(...volumeByPrice.map(({ volume }) => volume)) * 3,
                minPrice: coordinates.minPrice,
                maxPrice: coordinates.maxPrice,
              })

              const volumeCoordinates = defineCoordinates({
                xName: 'time',
                yName: 'volume',
                width: width - 60,
                height: height - 50,
                minTime: startTime.valueOf(),
                maxTime: endTime.valueOf(),
                minVolume: 0,
                maxVolume: Math.max(...candlesticksInView.map(c => c.volume)) * 3,
              })
  
              return (
                <svg width="100vw" height="100vh" style={{ display: 'block' }}>
                  <DateAxis coordinates={coordinates} />
                  <PriceAxis coordinates={coordinates} />

                  <VolumeByPrice
                    coordinates={volumeByPriceCoordinates}
                    volumeByPrice={volumeByPriceInView}
                  />

                  {candlesticksInView.map(candlestick =>
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

                  <TrendLine
                    coordinates={coordinates}
                    candlesticks={candlesticksInView}
                    name="sma50"
                    color="#a4afcb"
                  />
                  <TrendLine
                    coordinates={coordinates}
                    candlesticks={candlesticksInView}
                    name="sma200"
                    color="#7583aa"
                  />

                  <TrendLine
                    coordinates={coordinates}
                    candlesticks={candlesticksInView}
                    name="ema12"
                    color="#f5b573"
                  />
                  <TrendLine
                    coordinates={coordinates}
                    candlesticks={candlesticksInView}
                    name="ema26"
                    color="#d38e47"
                  />

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
