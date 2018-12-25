import test from 'ava'
import sendRequest from './'

test('sending HTTP GET requests', async t => {
  const response = await sendRequest({ url: 'http://example.com' })

  t.is(response.status, 200)
  t.true(response.headers.server.includes('ECS'))
  t.true(response.body.includes('Example Domain'))
})

test('sending query string params', async t => {
  const response = await sendRequest({
    method: 'GET',
    url: 'http://httpbin.org/get',
    query: {
      one: 'foo',
      two: 'bar baz'
    }
  })

  t.is(response.status, 200)
  t.is(response.body.args.one, 'foo')
  t.is(response.body.args.two, 'bar baz')
})

test('sending HTTPS GET requests', async t => {
  const response = await sendRequest({ url: 'https://example.com' })

  t.is(response.status, 200)
})

test('sending HTTP POST requests', async t => {
  const response = await sendRequest({
    method: 'POST',
    url: 'http://httpbin.org/post',
    body: {
      message: 'Hello World!'
    }
  })

  t.is(response.status, 200)
  t.is(response.body.headers['Content-Type'], 'application/json')
  t.is(response.body.json.message, 'Hello World!')
})

test('setting User-Agent', async t => {
  const response = await sendRequest({
    method: 'GET',
    url: 'http://httpbin.org/get'
  })

  t.is(response.status, 200)
  t.is(response.body.headers['User-Agent'], 'Node.js/1.0')
})
