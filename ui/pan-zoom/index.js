import React, { useState } from 'react'

export default function({
  initialStart, initialEnd,
  min, max,
  minWindowSize, maxWindowSize,
  render
}) {
  const [{ start, end }, setWindow] = useState({
    start: initialStart,
    end: initialEnd
  })

  function handleWheel(event) {
    if (event.deltaX > 0 && end < max) {
      const increment = Math.min(0.1 * (end - start), max - end)
      setWindow({ start: start + increment, end: end + increment })
    }

    if (event.deltaX < 0 && start > min) {
      const increment = Math.min(0.1 * (end - start), start - min)
      setWindow({ start: start - increment, end: end - increment })
    }

    if (event.deltaY > 0) {
      const increment = Math.min(
        0.1 * (end - start),
        maxWindowSize - (end - start)
      )
      const startIncrement = Math.min(increment, start - min)
      const endIncrement = Math.min(increment - startIncrement, max - end)

      setWindow({
        start: start - startIncrement,
        end: end + endIncrement
      })
    }

    if (event.deltaY < 0) {
      const increment = Math.min(
        0.1 * (end - start),
        (end - start) - minWindowSize
      )
      setWindow({ start: start + increment, end })
    }
  }

  return (
    <div
      className="pan-zoom"
      onWheel={handleWheel}
    >
      {render({ start, end })}
    </div>
  )
}
