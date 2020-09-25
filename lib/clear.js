const chalk = require('chalk')
const fs = require('fs-extra')

const { cacheDir } = require('../utils/config')

async function clear() {
  const dir = cacheDir()
  await fs.remove(dir)
}

module.exports = (...args) => {
  return clear(...args)
    .catch(err => {
      console.clear()
      console.error(chalk.red('❌', err))
      process.exit(-1)
    })
}
