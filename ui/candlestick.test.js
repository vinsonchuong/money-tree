import test from 'ava'
import React from 'react'
import render from './render'
import Candlestick from './candlestick'

/*
price          Increasing Decreasing
  |
  |   high ---- '    ||    '    ||    ' ---- high
  |             '    ||    '    ||    '
  |  close ---- '  ======  '  ======  ' ---- open
  |             '  |    |  '  |xxxx|  '
  |             '  |    |  '  |xxxx|  '
  |             '  |    |  '  |xxxx|  '
  |   open ---- '  ======  '  ======  ' ---- close
  |             '    ||    '    ||    '
  |    low ---- '    ||    '    ||    ' ---- low
  |             '          '          '
  |-------------|--|----|--|--|----|--|
  | index * 100  10  80  10 10  80  10
  +------------------------------------------ index
*/

test('rendering an increasing candlestick', t => {
  const container = document.createElement('svg')
  render(
    <Candlestick
      index={0}
      candlestick={{ open: 1, close: 2, low: 0, high: 3 }}
    />,
    container
  )

  t.true(container.querySelector('g').className.includes('increasing'))

  t.deepEqual(
    getAttributes(container.querySelectorAll('line')[0]),
    { x1: '50', y1: '3', x2: '50', y2: '2'}
  )
  t.deepEqual(
    getAttributes(container.querySelector('rect')),
    { x: '10', width: '80', y: '1', height: '1' }
  )
  t.deepEqual(
    getAttributes(container.querySelectorAll('line')[1]),
    { x1: '50', y1: '1', x2: '50', y2: '0'}
  )
})

test('rendering a decreasing candlestick', t => {
  const container = document.createElement('svg')
  render(
    <Candlestick
      index={0}
      candlestick={{ open: 2, close: 1, low: 0, high: 3 }}
    />,
    container
  )

  t.true(container.querySelector('g').className.includes('decreasing'))

  t.deepEqual(
    getAttributes(container.querySelectorAll('line')[0]),
    { x1: '50', y1: '3', x2: '50', y2: '2'}
  )
  t.deepEqual(
    getAttributes(container.querySelector('rect')),
    { x: '10', width: '80', y: '1', height: '1' }
  )
  t.deepEqual(
    getAttributes(container.querySelectorAll('line')[1]),
    { x1: '50', y1: '1', x2: '50', y2: '0'}
  )
})

function getAttributes(element) {
  const attributes = {}
  for (const attribute of element.attributes) {
    attributes[attribute.name] = attribute.value
  }
  return attributes
}
