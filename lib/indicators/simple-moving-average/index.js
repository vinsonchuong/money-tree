export default function(periods) {
  const window = []

  return candlestick => {
    window.push(candlestick)

    if (window.length > periods) {
      window.shift()
    }

    return {
      ...candlestick,
      [`sma${periods}`]: window.length === periods
        ? window.reduce((sum, c) => sum + c.close, 0) / periods
        : null
    }
  }
}
