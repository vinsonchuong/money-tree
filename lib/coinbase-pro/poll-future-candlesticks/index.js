import { fromClock, pipe, toArray } from 'heliograph'
import { getHistoricCandlesticks } from '../'

export default async function*({ productId, granularity }) {
  for await (const tick of fromClock(granularity)) {
    const candlesticks = await pipe(
      getHistoricCandlesticks({
        productId,
        granularity,
        start: tick - granularity,
        end: tick
      }),
      toArray
    )
    yield candlesticks[candlesticks.length - 1]
  }
}
