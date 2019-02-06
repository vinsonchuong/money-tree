export default function(periods) {
  return async function*(candlestickBatches) {
    const scalingFactor = 2 / (periods + 1)

    let iteration = 1
    let sma = 0
    let ema = null

    for await (const candlestickBatch of candlestickBatches) {
      yield candlestickBatch.map(candlestick => {
        if (iteration <= periods) {
          sma += candlestick.close / periods
        }

        if (iteration === periods) {
          ema = sma
        }

        if (iteration > periods) {
          ema = (candlestick.close - ema) * scalingFactor + ema
        }

        iteration += 1

        return {
          ...candlestick,
          [`ema${periods}`]: ema
        }
      })
    }
  }
}
