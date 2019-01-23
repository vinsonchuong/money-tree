import { capitalize } from 'lodash'

export default function(config) {
  const { width, height, xName, yName } = config

  const domainXSuffix = capitalize(xName)
  const domainYSuffix = capitalize(yName)

  const minDomainX = config[`min${domainXSuffix}`]
  const maxDomainX = config[`max${domainXSuffix}`]
  const minDomainY = config[`min${domainYSuffix}`]
  const maxDomainY = config[`max${domainYSuffix}`]

  return {
    ...config,
    minX: 0,
    maxX: width,
    minY: 0,
    maxY: height,
    x: x => (x - minDomainX) / (maxDomainX - minDomainX) * width,
    width: x => x / (maxDomainX - minDomainX) * width,
    y: price => (1 - (price - minDomainY) / (maxDomainY - minDomainY)) * height,
    height: price => price / (maxDomainY - minDomainY) * height,
    [xName]: x => x / width * (maxDomainX - minDomainX) + minDomainX,
    [yName]: y => (1 - y / height) * (maxDomainY - minDomainY) + minDomainY
  }
}
