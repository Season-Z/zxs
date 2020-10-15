const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const chalk = require('chalk')
const axios = require('axios')
const ora = require('ora')
const readline = require('readline')

const checkName = require('../utils/checkName')
const Downloader = require('../utils/Downloader')
const Manger = require('../utils/Manager')
const { tmpDir, hasYarn } = require('../utils/config')

const tplSpinner = ora('正在拉取模板列表...')
const tagSpinner = ora(`获取版本列表...`)
const proSpinner = ora('正在创建项目...')

/**
 * 获取远端的项目list
 */
async function remoteTmpList() {
  tplSpinner.start()
  // 获取模板列表
  const { data } = await axios.get('https://api.github.com/users/Season-Z/repos')
  tplSpinner.stop()

  // 所有模板的名称
  const tmpList = data.map(i => i.name)

  // 本地缓存
  fs.writeFile(tmpDir, tmpList)

  return tmpList
}

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
 */
async function getTemplateList(params) {
  let tmpList = [];

  const exsitfile = fs.existsSync(tmpDir)

  if (exsitfile) {
    const { uselocal } = await inquirer.prompt({
      type: 'confirm',
      name: 'uselocal',
      message: '检测到本地存在模板列表，是否读取缓存？',
    })

    // 读取缓存数据
    if (uselocal) {
      const content = fs.readFileSync(tmpDir).toString()
      tmpList = content.split(',')
    } else {
      // 获取github里的
      tmpList = await remoteTmpList()
    }
  } else {
    // 获取github里的
    tmpList = await remoteTmpList()
  }

  const { templateName } = await inquirer.prompt({
    type: 'list',
    name: 'templateName',
    message: "请选择目标仓库模板",
    choices: tmpList
  })

  return Object.assign({}, params, { templateName })
}

/**
 * 选择要下载模板项目对应的版本
 * @param {*} params 用户交互录入的数据以及命令行的一些配置参数
 */
async function getTagsList(params) {
  // const { templateName } = params

  // let tags = []
  // try {
  //   tagSpinner.start()
  //   const { data } = await axios.get(`https://api.github.com/repos/Season-Z/${templateName}/tags`)
  //   tagSpinner.stop()

  //   tags = data.map(item => item.name)
  // } catch (error) {
  //   throw '获取版本列表失败'
  // }

  // if (tags.length) {
  //   // 存在多个版本
  //   const { tagv } = await inquirer.prompt({
  //     type: 'list',
  //     name: 'tagv',
  //     message: `请选择${chalk.yellow(templateName)}的版本`
  //   })

  //   return Object.assign({}, params, { tagv })
  // }

  // 不存在多个版本
  return params
}

/**
 * 下载模板
 */
async function downloadTemplate(params) {
  const { targetDir, templateName, projectName, tagv } = params;
  const downloader = new Downloader({ targetDir, templateName, projectName, tagv })

  await downloader.run()

  return params
}

/**
 * 生成项目
 */
async function generateProject(params) {
  const { version, description, license } = await inquirer.prompt([{
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
    type: 'choices',
    name: 'license',
    message: '请选择协议',
    default: 'MIT'
  }])

  proSpinner.start()

  const { projectName, targetDir } = params
  const pkgPath = path.resolve(targetDir, './package.json')
  const pkgJson = await fs.readJSON(pkgPath)

  const pkg = Object.assign(pkgJson, {
    name: projectName, version, description, license
  })

  // 删除文件，创建新的package.json
  await fs.remove(path.resolve(targetDir, './.git'))
  await fs.remove(pkgPath)
  await fs.writeJSON(pkgPath, pkg)

  proSpinner.stop()

  return params
}

/**
 * 安装依赖
 */
async function installDeps(params) {
  const mg = new Manger(params.targetDir)

  // 进入项目目录
  mg.cdProjectPath()

  mg.install()

  mg.git()
  console.log(`🎉 成功生成项目:${params.projectName}`)
}

module.exports = (...args) => {
  return init(...args)
    .then(getTemplateList)
    .then(getTagsList)
    .then(downloadTemplate)
    .then(generateProject)
    .then(installDeps)
    .catch(err => {
      tplSpinner.stop()
      tagSpinner.stop()
      proSpinner.stop()

      // 当标准输出为终端时，清空
      if (process.stdout.isTTY) {
        readline.clearScreenDown(process.stdout)
      }
      console.error(chalk.red('❌', `创建项目失败：${err}`))
      process.exit(-1)
    })
}