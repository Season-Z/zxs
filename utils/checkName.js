const path = require('path')
const valiablePkgName = require('validate-npm-package-name')
const chalk = require('chalk');

/**
 * 校验是否为有效项目名称
 * @param {*} name 项目或文件名称
 * @param {*} options 参数配置
 */
function checkName(name = '.', options) {
  const cwd = options.cwd || process.cwd()
  // 是否在当前目录
  const isCurrentDir = name === '.'
  // 项目名称
  const pkgName = isCurrentDir ? path.relative('../', cwd) : name
  // 路径
  const targetDir = path.resolve(cwd, name)

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

  return {
    isCurrentDir,
    pkgName,
    targetDir
  }
}

module.exports = checkName