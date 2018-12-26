import test from 'ava'
import * as https from 'https'
import { makeCertificate, sendRequest } from '../'

test('generating an SSL certtificate', async t => {
  const { cert, key } = makeCertificate()
  const server = https.createServer({ cert, key }, (request, response) => {
    response.writeHead(200)
    response.end('Secure Connection')
  })
  server.listen(10000)

  await t.throwsAsync(
    sendRequest({ url: 'https://localhost:10000' }),
    'self signed certificate'
  )

  server.close()
})
