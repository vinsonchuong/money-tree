import React, { useState } from 'react'

export default function({
  initialPan, minPan, maxPan,
  initialZoom, minZoom, maxZoom,
  threshold,
  render
}) {
  const [pan, setPan] = useState(initialPan)
  const [zoom, setZoom] = useState(initialZoom)

  let dx = 0
  let dy = 0

  return (
    <div
      onWheel={event => {
        if (
          event.deltaX < 0 && pan > minPan ||
          event.deltaX > 0 && pan < maxPan
        ) {
          dx += event.deltaX
        }

        if (
          event.deltaY < 0 && zoom > minZoom ||
          event.deltaY > 0 && zoom < maxZoom
        ) {
          dy += event.deltaY
        }

        if (dx > threshold) setPan(pan + 1)
        if (dx < -threshold) setPan(pan - 1)
        if (dy > threshold) setZoom(zoom + 1)
        if (dy < -threshold) setZoom(zoom - 1)
      }}
    >
      {render({ pan, zoom })}
    </div>
  )
}
