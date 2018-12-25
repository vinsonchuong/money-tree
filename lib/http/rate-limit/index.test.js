import test from 'ava'
import rateLimit from './'

test('ensuring requests are not sent faster than a given interval', async t => {
  const calls = []
  const spy = () => {
    calls.push(Date.now())
  }

  const sendRequest = rateLimit(500)(spy)

  const startTime = Date.now()
  await sendRequest()
  await sendRequest()
  await sendRequest()

  t.is(calls.length, 3)
  t.true(calls[0] - startTime < 500)
  t.true(calls[1] - calls[0] >= 500 - 10)
  t.true(calls[2] - calls[1] >= 500 - 10)
})

test('proxying arguments and return value', async t => {
  const sendRequest = rateLimit(500)(arg => {
    t.is(arg, 'arg')
    return 'result'
  })

  t.is(await sendRequest('arg'), 'result')
})
