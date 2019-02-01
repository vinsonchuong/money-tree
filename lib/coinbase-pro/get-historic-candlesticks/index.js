import { sendRequest, rateLimit } from '../../http'

const rateLimitedSendRequest = rateLimit(500)(sendRequest)

export default async function* getHistoricCandlesticks({
  productId,
  granularity,
  start,
  end
}) {
  let prevCandlestick = null
  let pageStart = start

  while (pageStart < end) {
    const pageEnd = Math.min(pageStart + 300 * granularity, end)

    const response = await rateLimitedSendRequest({
      url: `https://api.pro.coinbase.com/products/${productId}/candles`,
      query: {
        granularity: granularity / 1000,
        start: timestampToISO(pageStart),
        end: timestampToISO(pageEnd)
      }
    })

    if (response.status !== 200) {
      throw new Error('Coinbase API returned non-200 response')
    }

    const candlesticks = response.body
      .map(d => parseCandle(d, granularity))
      .reverse()
    const batch = []

    let currentTime = pageStart
    for (const nextCandlestick of candlesticks) {
      batch.push(...padCandlesticks(
        currentTime,
        nextCandlestick.time.valueOf(),
        granularity,
        prevCandlestick
          ? prevCandlestick.close
          : nextCandlestick.open
      ))

      batch.push(nextCandlestick)

      currentTime = nextCandlestick.time.valueOf() + granularity

      prevCandlestick = nextCandlestick
    }

    if (prevCandlestick) {
      batch.push(...padCandlesticks(
        currentTime,
        pageEnd,
        granularity,
        prevCandlestick.close
      ))
    }

    if (batch.length > 0) {
      yield batch
    }

    pageStart = pageEnd
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
      low: price,
      volume: 0
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
