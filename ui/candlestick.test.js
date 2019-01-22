import test from 'ava'
import React from 'react'
import { render } from 'test-tube'
import defineCoordinates from './define-coordinates'
import Candlestick from './candlestick'

const candlesticks = [
  {
    time: new Date('2019-01-01T00:00:00.000Z'),
    granularity: 1000 * 60 * 15,
    open: 100,
    close: 110,
    high: 120,
    low: 90
  },
  {
    time: new Date('2019-01-01T00:15:00.000Z'),
    granularity: 1000 * 60 * 15,
    open: 110,
    close: 90,
    high: 110,
    low: 80
  }
]

const coordinates = defineCoordinates({
  xName: 'time',
  yName: 'price',
  width: 1000,
  height: 1000,
  minTime: candlesticks[0].time.valueOf(),
  maxTime: candlesticks[1].time.valueOf() + candlesticks[0].granularity,
  minPrice: Math.min(...candlesticks.map(c => c.low)),
  maxPrice: Math.max(...candlesticks.map(c => c.high)),
})

test('rendering an increasing candlestick', t => {
  const container = render(
    <svg>
      <Candlestick
        coordinates={coordinates}
        candlestick={candlesticks[0]}
      />
    </svg>
  )

  const candlestick = container.querySelector('.candlestick')
  t.true(candlestick.classList.contains('increasing'))

  const upperShadow = candlestick.querySelector('.upper-shadow')
  t.deepEqual(
    getAttributes(upperShadow),
    { class: 'upper-shadow', x1: '250', y1: '0', x2: '250', y2: '250'}
  )

  const realBody = candlestick.querySelector('.real-body')
  t.deepEqual(
    getAttributes(realBody),
    { class: 'real-body', x: '2', width: '496', y: '250', height: '250'}
  )

  const lowerShadow = candlestick.querySelector('.lower-shadow')
  t.deepEqual(
    getAttributes(lowerShadow),
    { class: 'lower-shadow', x1: '250', y1: '500', x2: '250', y2: '750'}
  )
})

test('rendering a decreasing candlestick', t => {
  const container = render(
    <svg>
      <Candlestick
        coordinates={coordinates}
        candlestick={candlesticks[1]}
      />
    </svg>
  )

  const candlestick = container.querySelector('.candlestick')
  t.true(candlestick.classList.contains('decreasing'))

  const upperShadow = candlestick.querySelector('.upper-shadow')
  t.deepEqual(
    getAttributes(upperShadow),
    { class: 'upper-shadow', x1: '750', y1: '250', x2: '750', y2: '250'}
  )

  const realBody = candlestick.querySelector('.real-body')
  t.deepEqual(
    getAttributes(realBody),
    { class: 'real-body', x: '502', width: '496', y: '250', height: '500'}
  )

  const lowerShadow = candlestick.querySelector('.lower-shadow')
  t.deepEqual(
    getAttributes(lowerShadow),
    { class: 'lower-shadow', x1: '750', y1: '750', x2: '750', y2: '1000'}
  )
})

function getAttributes(element) {
  const attributes = {}
  for (const attribute of element.attributes) {
    attributes[attribute.name] = attribute.value
  }
  return attributes
}
