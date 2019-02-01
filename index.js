import { start } from './ui'
import { startWssServer } from './lib/http'
import { streamAndCacheCandlesticks } from './lib/coinbase-pro'
import { pipe, map, consume } from 'heliograph'

async function run() {
  const api = await startWssServer(async socket => {
    pipe(
      streamAndCacheCandlesticks(),
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
