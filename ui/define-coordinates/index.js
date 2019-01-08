export default function({ width, height, candlesticks }) {
  const minTime = candlesticks[0].time.valueOf()
  const maxTime = candlesticks[candlesticks.length - 1].time.valueOf()
  const granularity = candlesticks[0].granularity
  const minPrice = Math.min(...candlesticks.map(c => c.low))
  const maxPrice = Math.max(...candlesticks.map(c => c.high))

  return {
    x: time => (time.valueOf() - minTime) / (maxTime + granularity - minTime) * width,
    width: time => time / (maxTime + granularity - minTime) * width,
    y: price => (1 - (price - minPrice) / (maxPrice - minPrice)) * height,
    height: price => price / (maxPrice - minPrice) * height,
  }
}
