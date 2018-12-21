import test from 'ava'
import * as React from 'react'
import { render } from 'react-dom'
import { JSDOM } from 'jsdom'
import App from './app'

test('rendering the app', t => {
  const { window } = new JSDOM('<!doctype html>')
  global.window = window
  const container = window.document.createElement('div')
  render(<App />, container)

  t.is(container.textContent, 'Hello World!')
})
