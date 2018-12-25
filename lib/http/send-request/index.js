import { request as sendHttpRequest } from 'http'
import { request as sendHttpsRequest } from 'https'
import { parse as parseUrl } from 'url'
import { stringify as stringifyQuery } from 'querystring'
import pEvent from 'p-event'
import getStream from 'get-stream'

export default async function(request) {
  const isJsonRequest = typeof request.body === 'object'

  const method = request.method || 'GET'
  const url = parseUrl(`${request.url}?${stringifyQuery(request.query || {})}`)
  const headers = {
    ...request.headers,
    'content-type': isJsonRequest ? 'application/json' : 'text/plain',
    'user-agent': 'Node.js/1.0'
  }
  const body = isJsonRequest ? JSON.stringify(request.body) : request.body

  const nodeRequest =
    url.protocol === 'https:'
      ? sendHttpsRequest({ ...url, method, headers })
      : sendHttpRequest({ ...url, method, headers })
  nodeRequest.end(body)

  const nodeResponse = await pEvent(nodeRequest, 'response')
  const responseBody = await getStream(nodeResponse)

  return {
    status: nodeResponse.statusCode,
    headers: nodeResponse.headers,
    body: nodeResponse.headers['content-type'].includes('application/json')
      ? JSON.parse(responseBody)
      : responseBody
  }
}
