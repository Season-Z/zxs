const EventEmitter = require('events')

const Spinner = require('../utils/1Spinner');

module.exports = class ProjectBuilder extends EventEmitter {
  constructor(name, opts) {
    super(name, opts)
    this.name = name;
    this.context = opts
  }

  static instance(name, opts) {
    return new ProjectBuilder(name, opts)
  }

  async createProject(dir) {
    // this.createSpinner = Spinner.instance({ symbol: '❤️', text: `正在创建项目 ${this.name}` })
    // this.createSpinner.start()
  }
}