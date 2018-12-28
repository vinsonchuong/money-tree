import React from 'react'
import { fromWebSocket } from 'heliograph'
import render from './render'
import Candlesticks from './candlesticks'

async function run() {
  const { apiUrl } = await window.getConfig()
  let candlesticks = []

  render(
    <div>
      <h1>Money Tree</h1>
      <Candlesticks data={candlesticks} />
    </div>,
    window.root
  )

  const socket = await fromWebSocket(apiUrl)
  for await (const message of socket) {
    candlesticks = [...candlesticks, JSON.parse(message)]
    render(
      <div>
        <h1>Money Tree</h1>
        <Candlesticks data={candlesticks} />
      </div>,
      window.root
    )
  }
}

run()
