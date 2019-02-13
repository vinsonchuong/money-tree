import React from 'react'
import styled from 'styled-components'

const Styled = styled.g`
  stroke-width: 0;
  fill: #eee;
`

const margin = 10 

export default function({
  coordinates: { width, height, y },
  volumeByPrice
}) {
  return (
    <Styled className="volume-by-price">
      {volumeByPrice.map(({ priceRange, volume }) =>
        <rect
          key={priceRange}
          x={0}
          width={width(volume)}
          y={y(priceRange) + margin}
          height={height(1) - 2 * margin}
        />
      )}
    </Styled>
  )
}
