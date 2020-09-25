const downloadHandler = require('download-git-repo')
const path = require('path')
const fs = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')

const { cacheDir } = require('./config')

function downloader(params) {
  return new Promise((resolve, reject) => {
    /**
     * targetDir： 用户录入的项目名称，输出的文件地址
     * templateName：模板代码的项目名称
     * projectName：用户自定义的目录
     * tagv：版本号
     */
    const { targetDir, templateName, projectName, tagv } = params;

    // 如果有版本标记上版本号
    const url = `Season-Z/${templateName}${tagv ? `#${tagv}` : ''}`

    // 缓存目录
    // const dirname = process.platform === 'win32' ? 'USERPROFILE' : 'HOME'
    // const cacheDir = `${process.env[dirname]}/zxs`
    const dir = cacheDir()
    const dest = path.resolve(dir, templateName)

    if (fs.existsSync(dest)) {
      // 将缓存内容拷贝出来
      resolve(fs.copy(dest, targetDir))
      return
    }

    const spinner = ora(`开始下载模板：${chalk.yellow(templateName)}`)
    spinner.start()

    downloadHandler(url, targetDir, { clone: true }, function (err) {
      if (err) {
        reject('拉取代码失败：', err)
      }
      resolve()
      spinner.succeed(`成功下载模板：${chalk.yellow(templateName)}`)

      // 拷贝文件至缓存目录
      fs.copySync(targetDir, dest)
    })
  })
}

module.exports = downloader