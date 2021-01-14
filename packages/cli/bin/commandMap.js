const chalk = require('chalk')
const minimist = require('minimist')

const commandMap = {
  create: {
    command: 'create <app-name>',
    alias: 'i',
    description: '初始化项目文件',
    examples: ['zxs create <app-name>'],
    validate: async () => {
      if (minimist(process.argv.slice(3))._.length > 1) {
        console.log(chalk.yellow('🥑  检测到您输入了多个名称，将以第一个参数为项目名，舍弃后续参数哦'))
        process.exit(1)
      }
    }
  },
  clear: {
    command: 'clear',
    alias: 'c',
    description: '删除本地缓存文件',
    examples: ['zxs clear']
  }
}

const commandKeys = Reflect.ownKeys(commandMap)

module.exports = { commandMap, commandKeys }
