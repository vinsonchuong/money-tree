import { capitalize } from 'lodash'

export default function(config) {
  const { width, height, xName, yName } = config

  const xSuffix = capitalize(xName)
  const ySuffix = capitalize(yName)

  const minX = config[`min${xSuffix}`]
  const maxX = config[`max${xSuffix}`]
  const minY = config[`min${ySuffix}`]
  const maxY = config[`max${ySuffix}`]

  return {
    ...config,
    x: x => (x - minX) / (maxX - minX) * width,
    width: x => x / (maxX - minX) * width,
    y: price => (1 - (price - minY) / (maxY - minY)) * height,
    height: price => price / (maxY - minY) * height,
    [xName]: x => x / width * (maxX - minX) + minX,
    [yName]: y => (1 - y / height) * (maxY - minY) + minY
  }
}
