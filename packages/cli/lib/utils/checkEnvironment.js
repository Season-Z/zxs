/**
 * 检测node环境
 */
const chalk = require('chalk')
const semver = require('semver')
const pkg = require('../../package.json')

module.exports = function () {
  function checkNodeVersion(wanted, id) {
    if (!semver.satisfies(process.version, wanted)) {
      console.log(chalk.red(
        `你是用的Node版本号为：${process.version}，但 ${id} 需运行在 ${wanted} .\n请升级你的Node版本`
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
}