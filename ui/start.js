import Bundler from 'parcel-bundler'
import carlo from 'carlo'

export default async function(config) {
  const bundler = new Bundler('ui/ui.html', {
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
  const ui = await carlo.launch({ args: carloArgs })
  ui.serveFolder('dist')
  await ui.exposeFunction('getConfig', () => config)
  await ui.load('ui.html')

  return ui
}
