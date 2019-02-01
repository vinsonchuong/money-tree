import test from 'ava'
import streamCandlesticks from './'

test('streaming all candlesticks starting from a given date', async t => {
  const granularity = 1000 * 60 * 1
  const start = (Math.floor(Date.now() / granularity) - 2) * granularity

  const candlestickBatches = streamCandlesticks({
    productId: 'ETH-USD',
    granularity,
    start
  })

  const batch1 = (await candlestickBatches.next()).value
  t.log(batch1)
  t.is(batch1.length, 2)
  t.is(batch1[0].time.valueOf(), start)
  t.is(batch1[1].time.valueOf(), start + granularity)


  const batch2 = (await candlestickBatches.next()).value
  t.log(batch2)
  t.is(batch2.length, 1)
  t.is(batch2[0].time.valueOf(), start + 2 * granularity)
})
