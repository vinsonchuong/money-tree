import test from 'ava'
import defineCoordinates from './'

test('defining a time/price to pixel coordinate system', t => {
  const { x, width, y, height } = defineCoordinates({
    width: 1000,
    height: 500,
    candlesticks: [
      {
        time: new Date('2018-01-01T00:00:00Z'),
        granularity: 1000 * 60 * 60,
        open: 100,
        close: 101,
        low: 99,
        high: 102,
        volume: 100
      },
      {
        time: new Date('2018-01-01T01:00:00Z'),
        granularity: 1000 * 60 * 60,
        open: 101,
        close: 103,
        low: 101,
        high: 103,
        volume: 200
      }
    ]
  })

  t.is(x(new Date('2018-01-01T00:00:00Z')), 0)
  t.is(x(new Date('2018-01-01T01:00:00Z')), 500)

  t.is(width(1000 * 60 * 60), 500)

  t.is(y(99), 500)
  t.is(y(101), 250)
  t.is(y(103), 0)

  t.is(height(2), 250)
})
