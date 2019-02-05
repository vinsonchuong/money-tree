import * as path from 'path'
import {
  openDatabase,
  closeDatabase,
  readSchema,
  createTable,
  createIndex,
  sendQuery,
  insertRows
} from 'rumor-mill'
import { getHistoricCandlesticks } from './lib/coinbase-pro'

async function run() {
  const granularity = 1000 * 60

  const database = await openDatabase(`sqlite://${path.resolve('candlesticks.db')}`)
  
  const schema = await readSchema(database)
  if (!('candlesticks' in schema)) {
    await createTable(
      database,
      'candlesticks',
      {
        time: 'datetime',
        granularity: 'integer',
        open: 'float',
        close: 'float',
        high: 'float',
        low: 'float',
        volume: 'float'
      }
    )

    await createIndex(database, 'candlesticks', ['time'], true)
  }

  const [mostRecentCandlestick] = await sendQuery(database, {
    $select: {
      $from: 'candlesticks',
      $where: { granularity },
      $orderBy: { time: 'DESC' },
      $limit: 1
    }
  })

  const candlestickBatches = getHistoricCandlesticks({
    productId: 'ETH-USD',
    granularity,
    start: mostRecentCandlestick
      ? mostRecentCandlestick.time.valueOf() + granularity
      : Date.parse('2016-05-18T00:14:00.000Z'),
    end: Math.floor(Date.now() / granularity) * granularity
  })

  for await (const batch of candlestickBatches) {
    await insertRows(database, 'candlesticks', batch)
  }

  await closeDatabase(database)
}

run()
