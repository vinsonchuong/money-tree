import test from 'ava'
import { openCarlo, findElement, evalInTab } from 'puppet-strings'
import { startWssServer } from '../lib/http'
import start from './start'

test('starting the ui', async t => {
  const granularity = 1000 * 60 * 15
  const candlestickIndex = Math.floor(Date.now() / granularity)

  const api = await startWssServer(async socket => {
    await socket.send(JSON.stringify([
      {
        time: new Date((candlestickIndex - 1) * granularity),
        granularity,
        open: 100,
        close: 110,
        high: 120,
        low: 90
      },
      {
        time: new Date(candlestickIndex * granularity),
        granularity,
        open: 110,
        close: 120,
        high: 130,
        low: 100
      }
    ]))
  })
  const ui = await start({ apiUrl: `wss://localhost:${api.port}` })

  const tab = await openCarlo(ui)

  await findElement(tab, '.chart')
  t.is(
    await evalInTab(tab, [], `return document.querySelectorAll('.candlestick').length`),
    2
  )

  await ui.exit()
})
