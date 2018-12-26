import * as path from 'path'
import generateCertificate from 'parcel-bundler/src/utils/generateCertificate'

export default function() {
  return generateCertificate({
    cache: true,
    cacheDir: path.resolve('.cache')
  })
}
