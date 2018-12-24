import * as React from 'react'
import render from './render'
import Candlesticks from './candlesticks'

const data = [
  { date: Date.parse('2013-08-18'), open: 5705.45, high: 5716.6, low: 5496.05, close: 5507.85 },
  { date: Date.parse('2013-08-19'), open: 5497.55, high: 5499.65, low: 5360.65, close: 5414.75 },
  { date: Date.parse('2013-08-20'), open: 5353.45, high: 5417.8, low: 5306.35, close: 5401.45 },
  { date: Date.parse('2013-08-21'), open: 5353.45, high: 5417.8, low: 5306.35, close: 5401.45 },
  { date: Date.parse('2013-08-22'), open: 5353.45, high: 5417.8, low: 5306.35, close: 5401.45 },
  { date: Date.parse('2013-08-23'), open: 5353.45, high: 5417.8, low: 5306.35, close: 5401.45 },
  { date: Date.parse('2013-08-24'), open: 5353.45, high: 5417.8, low: 5306.35, close: 5401.45 },
  { date: Date.parse('2013-08-25'), open: 5353.45, high: 5417.8, low: 5306.35, close: 5401.45 },
]

render(
  <div>
    <h1>Money Tree</h1>
    <Candlesticks data={data} />
  </div>,
  window.root
)
