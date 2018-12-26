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

  const response = await sendRequest({ url: 'https://localhost:10000' })
  t.is(response.body, 'Secure Connection')

  server.close()
})
