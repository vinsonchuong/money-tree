import test from 'ava'
import defineCoordinates from './'

test('including the original parameters', t => {
  const coordinates = defineCoordinates({
    xName: 'x',
    yName: 'y',
    width: 1000,
    height: 1000,
    minX: 0,
    maxX: 100,
    minY: 0,
    maxY: 1000
  })

  t.is(coordinates.minX, 0)
  t.is(coordinates.maxX, 100)
  t.is(coordinates.minY, 0)
  t.is(coordinates.maxY, 1000)
})

test('defining a time/price to pixel coordinate system', t => {
  const { x, width, y, height } = defineCoordinates({
    xName: 'time',
    yName: 'price',
    width: 1000,
    height: 500,
    minTime: Date.parse('2018-01-01T00:00:00Z'),
    maxTime: Date.parse('2018-01-01T01:00:00Z') + 1000 * 60 * 60,
    minPrice: 99,
    maxPrice: 103
  })

  t.is(x(Date.parse('2018-01-01T00:00:00Z')), 0)
  t.is(x(Date.parse('2018-01-01T01:00:00Z')), 500)

  t.is(width(1000 * 60 * 60), 500)

  t.is(y(99), 500)
  t.is(y(101), 250)
  t.is(y(103), 0)

  t.is(height(2), 250)
})

test('providing the inverse of pixel to time/price', t => {
  const { time, price } = defineCoordinates({
    xName: 'time',
    yName: 'price',
    width: 1000,
    height: 500,
    minTime: Date.parse('2018-01-01T00:00:00Z'),
    maxTime: Date.parse('2018-01-01T01:00:00Z') + 1000 * 60 * 60,
    minPrice: 99,
    maxPrice: 103
  })

  t.is(time(0), Date.parse('2018-01-01T00:00:00Z'))
  t.is(time(500), Date.parse('2018-01-01T01:00:00Z'))

  t.is(price(500), 99)
  t.is(price(250), 101)
  t.is(price(0), 103)
})
