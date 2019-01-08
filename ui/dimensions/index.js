import React, { createRef, useEffect, useState } from 'react'

export default function({ render }) {
  const container = createRef()
  const [dimensions, setDimensions] = useState(null)

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setDimensions({
          width: entry.target.clientWidth,
          height: entry.target.clientHeight
        })
      }
    })
    observer.observe(container.current)
  }, [])

  return (
    <div ref={container}>
      {dimensions && render(dimensions)}
    </div>
  )
}
