const downloadHandler = require('download-git-repo')
const path = require('path')
const fs = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')

const { cacheDir } = require('./config')

class Downloader {
  constructor(props) {
    /**
     * targetDir： 用户录入的项目名称，输出的文件地址
     * templateName：模板代码的项目名称
     * projectName：用户自定义的目录
     * tagv：版本号
     */
    const { targetDir, templateName, projectName, tagv } = props;

    this.targetDir = targetDir;
    this.templateName = templateName;
    this.projectName = projectName;
    this.tagv = tagv;

    // 缓存目录
    this.dest = path.resolve(cacheDir, this.templateName)
  }

  checkCache() {
    return fs.existsSync(this.dest)
  }

  async run() {
    if (this.checkCache()) {
      // 将缓存内容拷贝出来
      await fs.copy(this.dest, this.targetDir)
    } else {
      await this.handleDownload()
    }
  }

  handleDownload() {
    return new Promise((resolve, reject) => {
      const spinner = ora(`开始下载模板：${chalk.yellow(this.templateName)}`)
      spinner.start()

      // 如果有版本标记上版本号
      const url = `Season-Z/${this.templateName}${this.tagv ? `#${this.tagv}` : ''}`

      downloadHandler(url, this.targetDir, { clone: true }, (err) => {
        if (err) {
          reject(`拉取代码失败：, ${err}`)
        }
        spinner.succeed(`成功下载模板：${chalk.yellow(this.templateName)}`)

        // 拷贝文件至缓存目录
        fs.copy(this.targetDir, this.dest)
        resolve()
      })
    })
  }
}

module.exports = Downloader