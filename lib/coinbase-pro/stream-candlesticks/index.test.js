import test from 'ava'
import streamCandlesticks from './'

test('streaming all candlesticks starting from a given date', async t => {
  const granularity = 1000 * 60 * 1
  const start = (Math.floor(Date.now() / granularity) - 2) * granularity

  const candlesticks = streamCandlesticks({
    productId: 'ETH-USD',
    granularity,
    start
  })

  const candlestick1 = (await candlesticks.next()).value
  t.log(candlestick1)
  t.is(candlestick1.time.valueOf(), start)

  const candlestick2 = (await candlesticks.next()).value
  t.log(candlestick2)
  t.is(candlestick2.time.valueOf(), start + granularity)

  const candlestick3 = (await candlesticks.next()).value
  t.log(candlestick3)
  t.is(candlestick3.time.valueOf(), start + 2 * granularity)
})
