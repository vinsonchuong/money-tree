import test from 'ava'
import getHistoricCandlesticks from './'
import { toArray, pipe } from 'heliograph'

test('getting candlesticks', async t => {
  const granularity = 1000 * 60 * 5

  const candlesticks = await pipe(
    getHistoricCandlesticks({
      productId: 'ETH-USD',
      granularity,
      start: Date.parse('2016-05-27'),
      end: Date.parse('2016-05-28')
    }),
    toArray
  )
  t.is(candlesticks.length, (24 * 60) / 5)

  let previousCandlestick
  for (const candlestick of candlesticks) {
    if (previousCandlestick) {
      t.is(
        candlestick.time.valueOf(),
        previousCandlestick.time.valueOf() + granularity
      )
    }

    previousCandlestick = candlestick
  }
})
