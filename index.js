import { start } from './ui'
import { startWssServer } from './lib/http'
import { streamAndCacheCandlesticks } from './lib/coinbase-pro'
import { simpleMovingAverage, exponentialMovingAverage } from './lib/indicators'
import { pipe, map, consume } from 'heliograph'

async function run() {
  const api = await startWssServer(async socket => {
    pipe(
      streamAndCacheCandlesticks(),
      simpleMovingAverage(50),
      simpleMovingAverage(200),
      exponentialMovingAverage(12),
      exponentialMovingAverage(26),
      map(JSON.stringify),
      consume(socket.send)
    )
  })

  const ui = await start({
    apiUrl: `wss://localhost:${api.port}`
  })

  ui.on('exit', () => {
    api.close()
  })
}

run()
