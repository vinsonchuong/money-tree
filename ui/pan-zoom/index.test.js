import test from 'ava'
import td from 'testdouble'
import { Simulate } from 'react-dom/test-utils'
import React from 'react'
import { render } from 'test-tube'
import PanZoom from './'

function renderPanZoom({
  initialStart = 1,
  initialEnd = 999,
  min = 0,
  max = 1000,
  minWindowSize = 0,
  maxWindowSize = 1000
}) {
  const consume = td.function()

  const container = render(
    <PanZoom
      initialStart={initialStart}
      initialEnd={initialEnd}
      min={min}
      max={max}
      minWindowSize={minWindowSize}
      maxWindowSize={maxWindowSize}
      render={consume}
    />
  )

  const panZoom = container.querySelector('.pan-zoom')

  return { panZoom, consume }
}

test('starting from an initial window', t => {
  const { consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200
  }) 
  td.verify(consume({ start: 100, end: 200 }))
  t.pass()
})


test('panning', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200
  }) 

  Simulate.wheel(panZoom, { deltaX: 100, deltaY: 0 })
  td.verify(consume({ start: 110, end: 210 }))

  Simulate.wheel(panZoom, { deltaX: -100, deltaY: 0 })
  td.verify(consume({ start: 100, end: 200 }))

  Simulate.wheel(panZoom, { deltaX: -100, deltaY: 0 })
  td.verify(consume({ start: 90, end: 190 }))

  t.pass()
})

test('not panning beyond the min', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200,
    min: 100
  }) 

  Simulate.wheel(panZoom, { deltaX: -100, deltaY: 0 })
  td.verify(consume({ start: 90, end: 190 }), { times: 0 })

  t.pass()
})

test('panning right up to the min', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200,
    min: 95
  }) 

  Simulate.wheel(panZoom, { deltaX: -100, deltaY: 0 })
  td.verify(consume({ start: 95, end: 195 }))

  t.pass()
})

test('not panning beyond the max', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200,
    max: 200
  }) 

  Simulate.wheel(panZoom, { deltaX: 100, deltaY: 0 })
  td.verify(consume({ start: 110, end: 210 }), { times: 0 })

  t.pass()
})

test('panning right up to the max', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200,
    max: 205
  }) 

  Simulate.wheel(panZoom, { deltaX: 100, deltaY: 0 })
  td.verify(consume({ start: 105, end: 205 }))

  t.pass()
})

test('zooming out', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 100 })
  td.verify(consume({ start: 90, end: 200 }))

  t.pass()
})

test('zooming out while at min', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200,
    min: 100
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 100 })
  td.verify(consume({ start: 100, end: 210 }))

  t.pass()
})

test('not zooming out any further when at min and max', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200,
    min: 100,
    max: 200
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 100 })
  td.verify(consume({ start: 90, end: 200 }), { times: 0 })
  td.verify(consume({ start: 100, end: 210 }), { times: 0 })

  t.pass()
})

test('zooming out right up to the min and max', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200,
    min: 95,
    max: 205
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 100 })
  td.verify(consume({ start: 95, end: 205 }))

  t.pass()
})

test('zooming out right up to but not beyond the min and max', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200,
    min: 94,
    max: 204
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 100 })
  td.verify(consume({ start: 94, end: 204 }))

  t.pass()
})

test('not zooming out beyond the max window size', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200,
    maxWindowSize: 100
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 100 })
  td.verify(consume({ start: 90, end: 200 }), { times: 0 })

  t.pass()
})

test('zooming out up to the max window size', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200,
    maxWindowSize: 105
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 100 })
  td.verify(consume({ start: 95, end: 200 }))

  t.pass()
})

test('panning faster after zooming out', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 100 })
  Simulate.wheel(panZoom, { deltaX: 100, deltaY: 0 })
  td.verify(consume({ start: 101, end: 211 }))

  t.pass()
})

test('zooming out faster after zooming out', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 100 })
  Simulate.wheel(panZoom, { deltaX: 0, deltaY: 100 })
  td.verify(consume({ start: 79, end: 200 }))

  t.pass()
})

test('zooming in', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: -100 })
  td.verify(consume({ start: 110, end: 200 }))

  t.pass()
})

test('not zooming in beyond the min window size', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200,
    minWindowSize: 100
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: -100 })
  td.verify(consume({ start: 110, end: 200 }), { times: 0 })

  t.pass()
})

test('zooming in up to the min window size', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200,
    minWindowSize: 95 
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: -100 })
  td.verify(consume({ start: 105, end: 200 }))

  t.pass()
})

test('panning slower after zooming in', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: -100 })
  Simulate.wheel(panZoom, { deltaX: 100, deltaY: 0 })
  td.verify(consume({ start: 119, end: 209 }))

  t.pass()
})

test('zooming in slower after zooming in', t => {
  const { panZoom, consume } = renderPanZoom({
    initialStart: 100,
    initialEnd: 200
  }) 

  Simulate.wheel(panZoom, { deltaX: 0, deltaY: -100 })
  Simulate.wheel(panZoom, { deltaX: 0, deltaY: -100 })
  td.verify(consume({ start: 119, end: 200 }))

  t.pass()
})
