import test from 'ava'
import carlo from 'carlo'
import start from './start'

test('starting the ui', async t => {
  carlo.enterTestMode()

  const config = {
    param1: 'foo',
    paran2: 'bar'
  }

  const ui = await start(config)

  const browser = ui.browserForTest()
  const [page] = await browser.pages()

  const text = await page.$eval('body', el => el.textContent)
  t.true(text.includes('Money Tree'))

  t.deepEqual(await page.evaluate('window.getConfig()'), config)

  await ui.exit()
})
