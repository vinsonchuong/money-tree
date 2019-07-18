import { start } from './ui'
import { startWssServer } from './lib/http'
import { streamAndCacheCandlesticks } from './lib/coinbase-pro'
import { simpleMovingAverage, exponentialMovingAverage } from './lib/indicators'
import { pipe, map, observe, consume } from 'heliograph'
import { batchMap } from './lib/async-iteration'
import { sortBy } from 'lodash'

async function run() {
  const api = await startWssServer(async socket => {
    const volumeByPrice = new Map()

    pipe(
      streamAndCacheCandlesticks(),
      batchMap(simpleMovingAverage(50)),
      batchMap(simpleMovingAverage(200)),
      batchMap(exponentialMovingAverage(12)),
      batchMap(exponentialMovingAverage(26)),

      observe(async candlestickBatch => {
        for (const candlestick of candlestickBatch) {
          const priceRange = Math.floor(candlestick.close)

          if (!volumeByPrice.has(priceRange)) {
            volumeByPrice.set(priceRange, 0)
          }

          volumeByPrice.set(
            priceRange,
            volumeByPrice.get(priceRange) + candlestick.volume
          )

          if (candlestick.time.valueOf() + 2 * (1000 * 60 * 15) < Date.now()) {
            continue
          }

          const data = sortBy(
            Array.from(volumeByPrice.entries()),
            ([priceRange]) => priceRange
          )
            .map(([priceRange, volume]) => ({ priceRange, volume }))

          await socket.send(JSON.stringify({ type: 'volume-by-price', data }))
        }
      }),

      consume(async candlestickBatch => {
        await socket.send(JSON.stringify({
          type: 'candlesticks',
          data: candlestickBatch
        }))
      })
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
