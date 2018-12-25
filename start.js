import Bundler from 'parcel-bundler'
import carlo from 'carlo'

export default async function() {
  const bundler = new Bundler('ui/index.html', {
    outDir: './dist',
    https: true,
    hmrHostname: 'localhost',
    logLevel: process.env.NODE_ENV === 'test' ? 0 : 3
  })
  await bundler.bundle()

  const carloArgs = [
    '--allow-insecure-localhost'
  ]
  if (process.env.CI) {
    carloArgs.push('--no-sandbox', '--disable-setuid-sandbox')
  }
  console.log(carloArgs)
  const ui = await carlo.launch({ args: carloArgs })
  ui.serveFolder('dist')
  await ui.load('index.html')

  return ui
}
