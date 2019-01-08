import { sendRequest, rateLimit } from '../../http'

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

  const candlesticks = response.body
    .map(d => parseCandle(d, granularity)).reverse()

  let currentTime = start
  let prevCandlestick = null
  for (const nextCandlestick of candlesticks) {
    yield* padCandlesticks(
      currentTime,
      nextCandlestick.time.valueOf(),
      granularity,
      prevCandlestick
        ? prevCandlestick.close
        : nextCandlestick.open
    )

    yield nextCandlestick
    currentTime = nextCandlestick.time.valueOf() + granularity

    prevCandlestick = nextCandlestick
  }

  yield* padCandlesticks(currentTime, end, granularity, prevCandlestick.close)

  if (cursor !== end) {
    yield* getHistoricCandlesticks({
      productId,
      granularity,
      start: cursor,
      end
    })
  }
}

function* padCandlesticks(startTime, endTime, granularity, price) {
  let currentTime = startTime
  while (currentTime < endTime) {
    yield {
      time: new Date(currentTime),
      granularity,
      open: price,
      close: price,
      high: price,
      low: price
    }

    currentTime += granularity
  }
}

function parseCandle(data, granularity) {
  return {
    time: new Date(data[0] * 1000),
    granularity,
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
