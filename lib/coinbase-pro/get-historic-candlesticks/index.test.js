import test from 'ava'
import getHistoricCandlesticks from './'
import { toArray, pipe } from 'heliograph'

test('getting candlesticks', async t => {
  const granularity = 1000 * 60 * 5

  const candlestickBatches = await pipe(
    getHistoricCandlesticks({
      productId: 'ETH-USD',
      granularity,
      start: Date.parse('2016-05-27'),
      end: Date.parse('2016-05-28')
    }),
    toArray
  )
  t.is(candlestickBatches.length, 1)
  t.is(candlestickBatches[0].length, (24 * 60) / 5)

  let previousCandlestick
  for (const batch of candlestickBatches) {
    for (const candlestick of batch) {
      if (previousCandlestick) {
        t.is(
          candlestick.time.valueOf(),
          previousCandlestick.time.valueOf() + granularity
        )
      }

      previousCandlestick = candlestick
    }
  }
})

test('returning nothing when start > end', async t => {
  const candlestickBatches = await pipe(
    getHistoricCandlesticks({
      productId: 'ETH-USD',
      granularity: 1000 * 60,
      start: Date.parse('2018-05-27'),
      end: Date.parse('2018-05-26')
    }),
    toArray
  )
  t.is(candlestickBatches.length, 0)
})
