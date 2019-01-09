import React from 'react'
import styled from 'styled-components'
import defineCoordinates from './define-coordinates'
import Dimensions from './dimensions'
import PanZoom from './pan-zoom'
import Candlestick from './candlestick'

const Styled = styled.div`

  svg {
    display: block;
    width: 100vw;
    height: 100vh;
  }
`

export default function({ data }) {
  return (
    <Styled>
      <Dimensions
        render={({ width, height }) =>
          <PanZoom
            initialPan={0}
            minPan={-data.length}
            maxPan={0}
            initialZoom={10}
            minZoom={1}
            maxZoom={100}
            threshold={20}
            render={({ pan, zoom }) => {
              const numCandles = zoom
              const offset = pan
              const candlesticks = data.slice(
                data.length - numCandles + offset,
                data.length + offset
              )
              
              const coordinates = defineCoordinates({ width, height, candlesticks })
  
              return (
                <svg className="chart">
                  {candlesticks.map(candlestick =>
                    <Candlestick
                      key={candlestick.date}
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
