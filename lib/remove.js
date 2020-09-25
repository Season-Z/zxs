
async function remove(projectName = '.', options) {
  const { targetDir, pkgName, isCurrentDir } = checkName(projectName, options)
}

module.exports = (...args) => {
  return checkName(args).catch(err => {
    console.error(chalk.red('❌', `删除缓存项目失败：${err}`))
    process.exit(-1)
  })
}