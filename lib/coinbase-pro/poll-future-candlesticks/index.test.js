import test from 'ava'
import pollFutureCandlesticks from './'

test('polling for candlesticks', async t => {
  const start = Date.now()
  const granularity = 1000 * 60

  const candlestickBatches = pollFutureCandlesticks({
    productId: 'ETH-USD',
    granularity
  })

  let iteration = 1
  for await (const [candlestick] of candlestickBatches) {
    t.is(candlestick.time.valueOf() % granularity, 0)
    t.true(candlestick.time.valueOf() > start - iteration * granularity)
    t.true(candlestick.time.valueOf() < start + iteration * granularity)
    t.log(candlestick)

    if (iteration++ === 3) break
  }
})
