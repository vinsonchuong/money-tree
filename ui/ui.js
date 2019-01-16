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
    const parsedMessage = JSON.parse(message)
    const candlestick = {
      ...parsedMessage,
      time: new Date(parsedMessage.time)
    }
    candlesticks = [...candlesticks, candlestick]

    if (new Date() - candlestick.time <= 2 * 1000 * 60 * 15) {
      render(<Chart data={candlesticks} />, window.root)
    }
  }
}

run()
