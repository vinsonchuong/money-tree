import { start } from './ui'
import { startWssServer } from './lib/http'
import { streamCandlesticks } from './lib/coinbase-pro'
import { pipe, map, consume } from 'heliograph'

async function run() {
  const api = await startWssServer(async socket => {
    pipe(
      streamCandlesticks({
        productId: 'ETH-USD',
        granularity: 1000 * 60 * 15,
        start: Date.parse('2019-01-25')
      }),
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
