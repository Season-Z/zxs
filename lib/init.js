
const fs = require('fs-extra')
const path = require('path')
const valiablePkgName = require('validate-npm-package-name')
const inquirer = require('inquirer')
const chalk = require('chalk');

const ProjectBuilder = require('./ProjectBuilder');

async function initProject(projectName = '.', options) {
  const cwd = options.cwd || process.cwd()
  // 是否在当前目录
  const isCurrentDir = projectName === '.'
  // 项目名称
  const pkgName = isCurrentDir ? path.relative('../', cwd) : projectName
  // 路径
  const targetDir = path.resolve(cwd, projectName)

  const res = valiablePkgName(pkgName);
  if (!res.validForNewPackages) {
    res.errors && res.errors.forEach(err => {
      console.error(chalk.red(`👾 不符合npm包名规则: ${err}`))
    })
    res.warnings && res.warnings.forEach(warn => {
      console.error(chalk.red(`😮 不符合npm包名规则: ${warn}`))
    })
    process.exit(-1)
  }

  if (fs.existsSync(targetDir)) {
    if (isCurrentDir) {
      const { ok } = await inquirer.prompt([
        {
          type: "confirm",
          name: 'ok',
          message: '确认当前目录下初始化项目吗？'
        }
      ])

      if (!ok) return
    } else {
      const { handle } = await inquirer.prompt([
        {
          type: 'list',
          name: 'handle',
          message: `${chalk.magenta(targetDir)}目录已经存在，请选择：`,
          choices: [{ name: '覆盖', value: true }, { name: '取消', value: false }]
        }
      ])

      if (handle) {
        await fs.remove(targetDir) // 将本地原文件删除
      } else {
        return
      }

    }
  }

  ProjectBuilder.instance(pkgName, options).createProject(targetDir)
  console.log(pkgName)
}

module.exports = (...args) => {
  return initProject(...args).catch(err => {
    console.error(chalk.red(`创建失败：${err}`))
  })
}