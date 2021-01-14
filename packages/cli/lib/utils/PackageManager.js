const chalk = require('chalk')
const { execSync } = require('child_process')

const { hasYarn, hasCnpm, hasGit } = require('./config')

const PM_CONFIG = {
  npm: {
    install: ['install', '--loglevel', 'error'],
    uninstall: ['uninstall', '--loglevel', 'error'],
  },
  yarn: {
    install: [],
    uninstall: ['remove'],
  },
};
PM_CONFIG.cnpm = PM_CONFIG.npm;

module.exports = class PackageManager {
  constructor(targetDir) {
    this.targetDir = targetDir // 生成的项目的目录

    if (hasYarn()) {
      this.bin = 'yarn'
    } else if (hasCnpm) {
      this.bin = 'cnpm'
    } else {
      this.bin = 'npm'
    }
  }

  // 进入目标项目目录
  cdProjectPath() {
    try {
      process.chdir(this.targetDir)
    } catch (error) {
      console.log(chalk.red('不存在该项目目录'))
      process.exit(-1)
    }
  }

  run(command, args = []) {
    try {
      const commands = [this.bin, ...PM_CONFIG[this.bin][command], ...args]
      const newCommands = commands.join(' ')

      execSync(newCommands, { stdio: [0, 1, 2] })
    } catch (error) {
      console.log(chalk.red(`${newCommands} 执行失败`))
      throw (error)
    }
  }

  install() {
    try {
      this.run('install', ['--offline'])
    } catch (error) {
      this.run('install')
    }
  }

  git() {
    if (!hasGit()) {
      console.log(chalk.yellow('您本地还没有安装git，请前往安装：https://git-scm.com/'))
      return
    }
    execSync('git init');
  }
}