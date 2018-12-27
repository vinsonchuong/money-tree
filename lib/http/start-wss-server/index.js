import * as https from 'https'
import WebSocket from 'ws'
import getPort from 'get-port'
import pEvent from 'p-event'
import { makeCertificate } from '../'

export default async function(onConnection) {
  const server = https.createServer(makeCertificate())

  const webSocketServer = new WebSocket.Server({ server })
  webSocketServer.on('connection', ws => {
    const iterator = pEvent.iterator(ws, 'message', {
      resolutionEvents: ['close'],
      rejectionEvents: ['error']
    })
    onConnection({
      ...iterator,
      send: (...args) => ws.send(...args)
    })
  })

  const port = await getPort()

  server.listen(port)

  return {
    port,
    close: () => {
      server.close()
    }
  }
}
