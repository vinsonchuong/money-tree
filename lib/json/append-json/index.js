import { pathExists, stat, outputJson, open, write } from 'fs-extra'

export default async function(filePath, data) {
  if (await pathExists(filePath)) {
    const stats = await stat(filePath)
    const file = await open(filePath, 'r+')
    await write(
      file,
      `,${JSON.stringify(data).slice(1)}`,
     stats.size - 2 
    )
  } else {
    await outputJson(filePath, data)
  }
}
