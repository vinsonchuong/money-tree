import test from 'ava'
import td from 'testdouble'
import { Simulate } from 'react-dom/test-utils'
import React from 'react'
import render from '../render'
import PanZoom from './'

test('mapping left/right scrolling to panning', t => {
  const container = document.createElement('div')
  const consume = td.function()

  render(
    <PanZoom
      initialPan={0}
      minPan={-3}
      maxPan={0}
      initialZoom={0}
      minZoom={0}
      maxZoom={0}
      threshold={50}
      render={consume}
    />,
    container
  )
  const panZoom = container.querySelector('div')

  td.verify(consume({ pan: 0, zoom: 0 }))

  Simulate.wheel(panZoom, { deltaX: 51, deltaY: 0 })
  td.verify(consume({ pan: 1, zoom: 0 }), { times: 0 })

  Simulate.wheel(panZoom, { deltaX: -25, deltaY: 0 })
  Simulate.wheel(panZoom, { deltaX: -26, deltaY: 0 })
  td.verify(consume({ pan: -1, zoom: 0 }))

  Simulate.wheel(panZoom, { deltaX: -51, deltaY: 0 })
  td.verify(consume({ pan: -2, zoom: 0 }))

  Simulate.wheel(panZoom, { deltaX: 51, deltaY: 0 })
  td.verify(consume({ pan: -1, zoom: 0 }), { times: 2 })

  t.pass()
})

test('mapping up/down scrolling to zooming', t => {
  const container = document.createElement('div')
  const consume = td.function()

  render(
    <PanZoom
      initialPan={0}
      minPan={0}
      maxPan={0}
      initialZoom={10}
      minZoom={8}
      maxZoom={12}
      threshold={50}
      render={consume}
    />,
    container
  )
  const panZoom = container.querySelector('div')

  td.verify(consume({ pan: 0, zoom: 10 }))

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 25 })
  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 26 })
  td.verify(consume({ pan: 0, zoom: 11 }))

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 51 })
  td.verify(consume({ pan: 0, zoom: 12 }))

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 51 })
  td.verify(consume({ pan: 0, zoom: 13 }), { times: 0 })

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: -52 })
  td.verify(consume({ pan: 0, zoom: 11 }), { times: 2 })

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: -52 })
  td.verify(consume({ pan: 0, zoom: 10 }), { times: 2 })

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: -51 })
  td.verify(consume({ pan: 0, zoom: 9 }))

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: -51 })
  td.verify(consume({ pan: 0, zoom: 8 }))

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: -51 })
  td.verify(consume({ pan: 0, zoom: 7 }), { times: 0 })

  t.pass()
})
