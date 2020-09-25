const fs = require('fs-extra')
const inquirer = require('inquirer')
const chalk = require('chalk');
const axios = require('axios')
const ora = require('ora')

const checkName = require('../utils/checkName')
const downloader = require('../utils/downloader')

const tplSpinner = ora('正在拉取模板列表...')
const tagSpinner = ora(`获取版本列表...`)

/**
 * 校验项目名称，目录名称
 * @param {*} projectName 用户录入的项目名称
 * @param {*} options 其他配置信息
 */
async function init(projectName = '.', options) {
  const { targetDir, pkgName, isCurrentDir } = checkName(projectName, options)

  if (fs.existsSync(targetDir)) {
    if (isCurrentDir) {
      const { ok } = await inquirer.prompt([
        {
          type: "confirm",
          name: 'ok',
          message: '确认当前目录下初始化项目吗？'
        }
      ])

      if (!ok) {
        process.exit(-1)
      }
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
        process.exit(-1)
      }
    }
  }

  return Object.assign({}, options, { projectName: pkgName, targetDir })
}

/**
 * 获取github仓库项目模板列表
 * @param {*} params 
 */
async function getTemplateList(params) {
  tplSpinner.start()
  // 获取模板列表
  const { data } = await axios.get('https://api.github.com/users/Season-Z/repos')

  if (!data) {
    tplSpinner.fail('获取模板列表失败')
    process.exit(-1)
  }

  tplSpinner.stop()

  // 所有模板的名称
  const repos = data.map(i => i.name)

  const { templateName } = await inquirer.prompt({
    type: 'list',
    name: 'templateName',
    message: "请选择目标仓库模板",
    choices: repos
  })

  return Object.assign({}, params, { templateName })
}

/**
 * 选择要下载模板项目对应的版本
 * @param {*} params 用户交互录入的数据以及命令行的一些配置参数
 */
async function getTagsList(params) {
  const { templateName } = params

  tagSpinner.start()

  const { data } = await axios.get(`https://api.github.com/repos/Season-Z/${templateName}/tags`)
  if (!data) {
    tagSpinner.stop('获取版本列表失败')
    process.exit(-1)
  }
  tagSpinner.stop()

  const tags = data.map(item => item.name)
  if (tags.length) {
    // 存在多个版本
    const { tagv } = await inquirer.prompt({
      type: 'list',
      name: 'tagv',
      message: `请选择${chalk.yellow(templateName)}的版本`
    })

    return Object.assign({}, params, { tagv })
  }

  // 不存在多个版本
  return params
}

/**
 * 下载模板
 */
async function downloadTemplate(params) {
  const { targetDir, templateName, projectName, tagv } = params;
  await downloader({ targetDir, templateName, projectName, tagv })

  return params
}

/**
 * 生成项目
 */
async function generateProject(params) {
  const answers = await inquirer.prompt([{
    type: 'input',
    name: 'version',
    message: '请输入项目的版本号',
    default: '1.0.0'
  }, {
    type: 'input',
    name: 'description',
    message: '请输入项目的描述',
    default: ''
  }, {
    type: 'input',
    name: 'author',
    message: '请输入作者',
    default: ''
  }, {
    type: 'choices',
    name: 'license',
    message: '请选择协议',
    default: 'MIT'
  }])

  console.log(`🌪  成功生成项目：${params.projectName}`)
}

module.exports = (...args) => {
  return init(...args)
    .then(getTemplateList)
    .then(getTagsList)
    .then(downloadTemplate)
    .then(generateProject)
    .catch(err => {
      tplSpinner.stop()
      tagSpinner.stop()

      console.error(chalk.red('❌', `创建项目失败：${err}`))
      process.exit(-1)
    })
}