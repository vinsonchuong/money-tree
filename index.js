import { start } from './ui'

async function run() {
  const ui = await start()
  ui.on('exit', () => process.exit())
}

run()
