export default function(periods) {
  const scalingFactor = 2 / (periods + 1)

  let iteration = 1
  let sma = 0
  let ema = null

  return candlestick => {
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
  }
}
