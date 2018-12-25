import { promisify } from 'util'

const sleep = promisify(setTimeout)

export default rate => {
  let lastCallTime = 0

  return next => async (...args) => {
    const currentTime = Date.now()
    if (currentTime - lastCallTime < rate) {
      await sleep(rate - (currentTime - lastCallTime))
    }

    const result = await next(...args)
    lastCallTime = Date.now()
    return result
  }
}
