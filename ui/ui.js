import React from 'react'
import { fromWebSocket } from 'heliograph'
import { render } from 'react-dom'
import Chart from './chart'

async function connectToApi() {
  if (global.socket) {
    return global.socket
  }

  const { apiUrl } = await window.getConfig()
  global.socket = await fromWebSocket(apiUrl)

  return global.socket
}

async function run() {
  const socket = await connectToApi()

  let candlesticks = []
  let volumeByPrice = []

  for await (const message of socket) {
    const { type, data } = JSON.parse(message)

    if (type === 'candlesticks') {
      candlesticks = [
        ...candlesticks,
        ...data.map(candlestick => ({
          ...candlestick,
          time: new Date(candlestick.time)
        }))
      ]
    } else if (type === 'volume-by-price') {
      volumeByPrice = data
    }

    if (candlesticks.length > 0 && volumeByPrice.length > 0) {
      render(
        <Chart
          candlesticks={candlesticks}
          volumeByPrice={volumeByPrice}
        />,
        window.root
      )
    }
  }
}

run()
