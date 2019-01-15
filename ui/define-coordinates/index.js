export default function({
  width, height,
  minX, maxX,
  minY, maxY
}) {

  return {
    x: x => (x - minX) / (maxX - minX) * width,
    width: x => x / (maxX - minX) * width,
    y: price => (1 - (price - minY) / (maxY - minY)) * height,
    height: price => price / (maxY - minY) * height,
  }
}
