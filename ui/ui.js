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
  for await (const message of socket) {
    const candlestickBatch = JSON.parse(message)
    candlesticks = [
      ...candlesticks,
      ...candlestickBatch.map(candlestick => ({
        ...candlestick,
        time: new Date(candlestick.time)
      }))
    ]

    render(<Chart data={candlesticks} />, window.root)
  }
}

run()
