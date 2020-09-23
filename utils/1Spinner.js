const Ora = require('ora')

module.exports = class Spinner extends Ora {
  constructor(config) {
    const { symbol, ...rest } = config
    super(rest)

    this.symbol = symbol;

    // this.spinner = ora();
    // this.spinner.text = ` ${text}`;
  }

  static instance(config) {
    return new Spinner(config)
  }

  static symbol() {
    return this.symbol
  }
}