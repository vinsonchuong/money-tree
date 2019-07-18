import * as path from 'path'
import {
  openDatabase,
  closeDatabase,
  sendQuery,
} from 'rumor-mill'
import { simpleMovingAverage, exponentialMovingAverage } from './lib/indicators'

async function run() {
  const granularity = 1000 * 60 * 15
  const database = await openDatabase(`sqlite://${path.resolve('candlesticks.db')}`)

  const candlesticks = await sendQuery(database, {
    $select: {
      $from: 'candlesticks',
      $where: {
        granularity,
        // time: { $gte: new Date('2018-01-01') }
      },
      $orderBy: { time: 'ASC' }
    }
  })
  console.log(candlesticks.length)

  await closeDatabase(database)

  let currentTrend = null
  let signal = false

  const result = candlesticks
    .map(simpleMovingAverage(50))
    .map(simpleMovingAverage(200))
    .map(exponentialMovingAverage(12))
    .map(exponentialMovingAverage(26))
    .reduce(({ usd, eth }, candlestick) => {
      if (!candlestick.ema26) {
        return doNothing({ usd, eth })
      }

      if (candlestick.low >= candlestick.ema26) {
        currentTrend = 'up'
      } else if (candlestick.high <= candlestick.ema26) {
        currentTrend = 'down'
      }

      if (
        currentTrend === 'up' &&
        candlestick.close >= candlestick.ema26 &&
        candlestick.low <= candlestick.ema26
      ) {
        signal = true
        return doNothing({ usd, eth })
      } else if (
        currentTrend === 'down' &&
        candlestick.close <= candlestick.ema26 &&
        candlestick.high >= candlestick.ema26
      ) {
        signal = true
        return doNothing({ usd, eth })
      }

      if (signal && currentTrend === 'up') {

      } else if (signal && currentTrend === 'down') {

      } else {
        return doNothing({ usd, eth })
      }
    }, { usd: 10000, eth: 0  })

  console.log(result)
}

function buy({ usd, eth }, candlestick) {
  return {
    usd: 0,
    eth: eth + usd / candlestick.close
  }
}

function sell({ usd, eth }, candlestick) {
  return {
    usd: usd + candlestick.close * eth,
    eth: 0
  }
}

function doNothing({ usd, eth }) {
  return { usd, eth }
}

run()
