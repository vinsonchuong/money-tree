import { fromClock } from 'heliograph'
import { getHistoricCandlesticks } from '../'

export default async function*({ productId, granularity }) {
  for await (const tick of fromClock(granularity)) {
    yield* getHistoricCandlesticks({
      productId,
      granularity,
      start: tick - granularity,
      end: tick
    })
  }
}
