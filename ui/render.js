import { render } from 'react-dom'

if (process.env.NODE_ENV === 'test') {
  const { JSDOM } = require('jsdom')

  const { window } = new JSDOM('<!doctype html>')
  global.window = window
  global.document = window.document

  const oldConsoleError = console.error
  console.error = (...args) => {
    if (args[0].includes('Warning: The tag <%s> is unrecognized in this browser')) {
      return
    }

    oldConsoleError(...args)
  }
}

export default function(jsx, container) {
  render(jsx, container)
}
