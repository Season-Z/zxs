#!/usr/bin/env node

const program = require('commander')

const pkg = require('../package.json')
const files = require('../')

const commandMap = {
  init: {
    command: 'init <name>',
    alias: 'i',
    description: '初始化项目文件',
    examples: ['zxs init <name>']
  },
  clear: {
    command: 'remove',
    alias: 'c',
    description: '删除本地缓存文件',
    examples: ['zxs clear']
  }
}

const commandKeys = Reflect.ownKeys(commandMap)

// 生成命令
commandKeys.forEach((name) => {
  const { command, alias, description } = commandMap[name]
  program
    .command(command)
    .alias(alias)
    .description(description)
    .action((...args) => {
      files(name, ...args)
    })
})

// 添加 --help 输出的内容
program.on('--help', () => {
  console.log('Examples: ')
  commandKeys.forEach((coms) => {
    const { examples } = commandMap[coms]
    const examplesMsg = examples.join('\n').trim()
    console.log('  ' + examplesMsg)
  })
})

program.version(pkg.version)
  .usage('<command> [options]')

// program.command('init <name>')
//   .alias('i')
//   .description('初始化项目文件')
//   .action((name, opt) => {
//     require('../lib/init')(name, opt)
//   })

program.parse(process.argv) // 解析变量
