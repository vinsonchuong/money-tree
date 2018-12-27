import test from 'ava'
import startWssServer from './'
import { fromWebSocket } from 'heliograph'

test('starting a secure WebSocket server', async t => {
  const server = await startWssServer(async serverSocket => {
    const { value } = await serverSocket.next()
    t.is(value, 'From Client')

    serverSocket.send('From Server')
  })

  const clientSocket = await fromWebSocket(`wss://localhost:${server.port}`)
  clientSocket.send('From Client')

  const { value } = await clientSocket.next()
  t.is(value, 'From Server')

  server.close()
})
