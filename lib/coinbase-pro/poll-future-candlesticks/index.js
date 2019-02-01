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

    // The Coinbase API can include extra candlesticks that fall outside of the
    // requested range
    yield candlesticks[candlesticks.length - 1].slice(-1)
  }
}
