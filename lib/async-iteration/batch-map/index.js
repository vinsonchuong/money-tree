export default function(transform) {
  return async function*(batches) {
    for await (const batch of batches) {
      yield batch.map(transform)
    }
  }
}
