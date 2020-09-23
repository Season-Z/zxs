#!/usr/bin/env node

const program = require('commander');

const pkg = require('../package.json')

program.version(pkg.version)
  .usage('<command> [options]')

program.command('init <name>')
  .description('初始化项目文件')
  .action((name, opt) => {
    require('../lib/init')(name, opt)
    // console.log(name, argv)
    // inquirer.prompt([
    //   {
    //     type: 'input',
    //     name: 'description',
    //     message: '请输入项目的描述信息',
    //     default: ''
    //   },
    //   {

    //   }
    // ])
  })

program.parse(process.argv) // 解析变量