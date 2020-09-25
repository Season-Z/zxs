const ora = require('ora')

const spinner = ora()
let currentSpinner = {
  symbol: '',
  text: ''
}

function spinner(symbol, msg) {
  currentSpinner = {
    symbol,
    msg
  }
  spinner = currentSpinner

  spinner.start()
}

module.exports = spinner