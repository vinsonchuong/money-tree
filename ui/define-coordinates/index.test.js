import test from 'ava'
import defineCoordinates from './'

test('defining a time/price to pixel coordinate system', t => {
  const { x, width, y, height } = defineCoordinates({
    width: 1000,
    height: 500,
    minX: Date.parse('2018-01-01T00:00:00Z'),
    maxX: Date.parse('2018-01-01T01:00:00Z') + 1000 * 60 * 60,
    minY: 99,
    maxY: 103
  })

  t.is(x(Date.parse('2018-01-01T00:00:00Z')), 0)
  t.is(x(Date.parse('2018-01-01T01:00:00Z')), 500)

  t.is(width(1000 * 60 * 60), 500)

  t.is(y(99), 500)
  t.is(y(101), 250)
  t.is(y(103), 0)

  t.is(height(2), 250)
})
