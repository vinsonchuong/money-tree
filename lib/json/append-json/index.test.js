import test from 'ava'
import { readJson, appendJson } from '../'
import tempy from 'tempy'

test('appending to a file that does not exist', async t => {
  const file = tempy.file()

  await appendJson(file, [
    { name: 'One' },
    { name: 'Two' }
  ])

  t.deepEqual(await readJson(file), [
    { name: 'One' },
    { name: 'Two' }
  ])
})

test('appending to an existing file', async t => {
  const file = tempy.file()

  await appendJson(file, [
    { name: 'One' },
    { name: 'Two' }
  ])

  await appendJson(file, [
    { name: 'Three' }
  ])

  t.deepEqual(await readJson(file), [
    { name: 'One' },
    { name: 'Two' },
    { name: 'Three' }
  ])
})
