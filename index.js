import { start } from './ui'
import { startWssServer } from './lib/http'
import { streamCandlesticks } from './lib/coinbase-pro'

async function run() {
  const api = await startWssServer(async socket => {
    const candlesticks = streamCandlesticks({
      productId: 'ETH-USD',
      granularity: 1000 * 60 * 5 * 3,
      start: Date.parse('2018-12-27')
    })

    for await (const candlestick of candlesticks) {
      await socket.send(JSON.stringify(candlestick))
    }
  })

  const ui = await start({
    apiUrl: `wss://localhost:${api.port}`
  })

  ui.on('exit', () => {
    api.close()
  })
}

run()
