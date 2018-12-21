import React from 'react'
import PropTypes from 'prop-types'

import { scaleTime } from 'd3-scale'
import { utcDay } from 'd3-time'

import { ChartCanvas, Chart } from 'react-stockcharts'
import { CandlestickSeries } from 'react-stockcharts/lib/series'
import { XAxis, YAxis } from 'react-stockcharts/lib/axes'
import { last, timeIntervalBarWidth } from 'react-stockcharts/lib/utils'

export default function CandleStickChart({ data }) {
  const xAccessor = d => d.date
  const xExtents = [
    xAccessor(last(data)),
    xAccessor(data[0])
  ]

  return (
    <ChartCanvas
      height={400}
      ratio={1}
      width={800}
      margin={{ left: 50, right: 50, top: 50, bottom: 50 }}
      type="hybrid"
      seriesName="MSFT"
      data={data}
      xAccessor={xAccessor}
      xScale={scaleTime()}
      xExtents={xExtents}
    >
      <Chart yExtents={d => [d.high, d.low]}>
        <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
        <YAxis axisAt="left" orient="left" ticks={5} />
        <CandlestickSeries width={timeIntervalBarWidth(utcDay)}/>
      </Chart>
    </ChartCanvas>
  )
}
