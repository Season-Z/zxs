
const fs = require('fs-extra')
const path = require('path')
const valiablePkgName = require('validate-npm-package-name')
const inquirer = require('inquirer')
const chalk = require('chalk');
const axios = require('axios')

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
      console.error(chalk.red(`😮 不符合npm包名规则: ${err}`))
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
          type: 'confirm',
          name: 'handle',
          message: '目录已经存在，是否确认覆盖？',
        }
      ])

      if (handle) {
        await fs.remove(targetDir) // 将本地原文件删除
      } else {
        return
      }

    }
  }
}

async function downloadTml() {
  // 获取模板列表
  const { data } = await axios.get('https://api.github.com/users/Season-Z/repos')
  const repos = data.map(i => i.name)
  console.log(repos)
}

module.exports = (...args) => {
  return initProject(...args).then(downloadTml).catch(err => {
    console.error(chalk.red(`创建失败：${err}`))
  })
}