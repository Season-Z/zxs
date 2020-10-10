#!/usr/bin/env node

// 检测node版本函数
const chalk = require('chalk')
const semver = require('semver')
const pkg = require('../package.json')

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      '你是用的Node版本号为： ' + process.version + ', 但 ' + id +
      ' 需运行在 ' + wanted + '.\n请升级你的Node版本'
    ))
    process.exit(1)
  }
}

const nodeVersion = pkg.engines.node
checkNodeVersion(nodeVersion, 'zxs-cli')

if (semver.satisfies(process.version, '9.x')) {
  console.log(chalk.red(
    `你是用的Node版本是 ${process.version}.\n` +
    `强烈建议你使用最新 LTS 版本`
  ))
}

const program = require('commander')

const { commandMap, commandKeys } = require('./commandMap')
const files = require('../')


// 自定义错误提示信息
const errorMsg = require('../utils/errorMsg')
// 缺少参数的错误提示
errorMsg('missingArgument', argName => {
  return `缺少必要参数 ${chalk.red(`<${argName}>`)}.`
})

// 生成命令
commandKeys.forEach((name) => {
  const { command, alias, description, validate } = commandMap[name]
  program
    .command(command)
    .alias(alias)
    .description(description)
    .action(async (...args) => {
      // 如果存在校验函数
      if (validate && typeof validate === 'function') {
        await validate(...args);
      }
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

program.version(pkg.version, '-v, --version')
  .usage('<command> [options]')

program.parse(process.argv) // 解析变量

if (!process.argv.slice(2).length) {
  program.outputHelp()
}