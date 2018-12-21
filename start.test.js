import test from 'ava'
import carlo from 'carlo'
import start from './start'

test('starting the ui', async t => {
  carlo.enterTestMode()
  const ui = await start()

  const browser = ui.browserForTest()
  const [page] = await browser.pages()
  const text = await page.$eval('div', el => el.textContent)

  t.true(text.includes('Money Tree'))

  await ui.exit()
})
