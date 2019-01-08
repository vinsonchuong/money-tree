import React from 'react'
import { render } from 'react-dom'
import Dimensions from '../'

render(
  <Dimensions render={({ width, height }) =>
    <div className="container">
      <div className="width">{width}</div>
      <div className="height">{height}</div>
    </div>
  } />,
  window.root
)
