import { sendRequest, rateLimit } from '../../http'
import { pipe } from 'heliograph'

const rateLimitedSendRequest = rateLimit(500)(sendRequest)

export default async function* getHistoricCandlesticks({
  productId,
  granularity,
  start,
  end
}) {
  const cursor = Math.min(start + 300 * granularity, end)

  const response = await rateLimitedSendRequest({
    url: `https://api.pro.coinbase.com/products/${productId}/candles`,
    query: {
      granularity: granularity / 1000,
      start: timestampToISO(start),
      end: timestampToISO(cursor)
    }
  })

  const candlesticks = response.body.map(parseCandle)

  yield* pipe(
    candlesticks,
    reverse
  )

  if (cursor !== end) {
    yield* getHistoricCandlesticks({
      productId,
      granularity,
      start: cursor,
      end
    })
  }
}

function* reverse(list) {
  for (let i = list.length - 1; i >= 0; i--) {
    yield list[i]
  }
}

function parseCandle(data) {
  return {
    time: new Date(data[0] * 1000),
    open: data[3],
    close: data[4],
    low: data[1],
    high: data[2],
    volume: data[5]
  }
}

function timestampToISO(timestamp) {
  return new Date(timestamp).toISOString()
}
