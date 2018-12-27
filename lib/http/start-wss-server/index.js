import * as https from 'https'
import WebSocket from 'ws'
import pEvent from 'p-event'
import { makeCertificate } from '../'

export default function(port, onConnection) {
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
  server.listen(port)

  webSocketServer.close = () => {
    server.close()
  }
  return webSocketServer
}
