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
import { streamCandlesticks } from '../'

const cacheFilePath = path.resolve('candlesticks.db')
const firstCandlestickTime = Date.parse('2016-05-18T00:14:00.000Z')
const granularity = 1000 * 60
const productId = 'ETH-USD'

export default async function*() {
  const database = await openDatabase(`sqlite://${cacheFilePath}`)

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

  console.log('Loading candlesticks from cache')
  const cachedCandlesticks = await sendQuery(database, {
    $select: {
      $from: 'candlesticks',
      $orderBy: { time: 'ASC' }
    }
  })

  console.log('Sending cached candlesticks to UI')
  yield cachedCandlesticks

  console.log('Streaming from Coinbase Pro')
  const candlestickBatches = streamCandlesticks({
    productId,
    granularity,
    start: cachedCandlesticks.length > 0
      ? cachedCandlesticks[cachedCandlesticks.length - 1].time.valueOf() + granularity
      : firstCandlestickTime
  })

  for await (const batch of candlestickBatches) {
    await insertRows(database, 'candlesticks', batch)
    yield batch
  }

  await closeDatabase(database)
}
