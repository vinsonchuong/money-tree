import React, { createRef, useEffect, useState } from 'react'

export default function({ render }) {
  const container = createRef()
  const [dimensions, setDimensions] = useState(null)

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (const { target: { clientWidth, clientHeight } } of entries) {
        setDimensions({
          width: clientWidth,
          height: clientHeight
        })
      }
    })
    observer.observe(container.current)
  }, [])

  return (
    <div
      ref={container}
      style={{ width: '100%', height: '100%' }}
    >
      {dimensions && render(dimensions)}
    </div>
  )
}
