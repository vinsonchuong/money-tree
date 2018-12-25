import { concat } from 'heliograph'
import {
  getHistoricCandlesticks,
  pollFutureCandlesticks
} from '../'

export default async function*({ productId, granularity, start }) {
  const currentCandleStart = Math.floor(Date.now() / granularity) * granularity

  yield* concat(
    getHistoricCandlesticks({
      productId,
      granularity,
      start,
      end: currentCandleStart
    }),
    pollFutureCandlesticks({ productId, granularity })
  )
}
