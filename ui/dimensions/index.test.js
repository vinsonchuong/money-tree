import test from 'ava'
import React from 'react'
import render from '../render'
import Dimensions from './'
import { closeTab, findElement } from 'puppet-strings'
import openApp from 'puppet-strings-open-app'

test('detecting changes in the dimensions of the container', async t => {
  const app = await openApp('ui/dimensions/fixtures/index.html')

  t.is((await findElement(app, '.width')).innerText, '800')
  t.is((await findElement(app, '.height')).innerText, '600')

  await app.puppeteer.page.setViewport({ width: 1024, height: 768 })
  t.is((await findElement(app, '.width')).innerText, '1024')
  t.is((await findElement(app, '.height')).innerText, '768')

  await closeTab(app)

  t.pass()
})
