const path = require('path')

const PROJECT_PATH = path.resolve(__dirname, '../')
const PROJECT_NAME = path.parse(PROJECT_PATH).name

const isDev = process.env.NODE_ENV === 'development'

const SERVER_HOST = 'localhost'
const SERVER_PORT = '7001'

// 是否开启 modules 缓存
const IS_OPEN_HARD_SOURCE = true

// 是否开启 bundle 包分析
const shouldOpenAnalyzer = true

module.exports = {
  IS_OPEN_HARD_SOURCE,
  shouldOpenAnalyzer,
  PROJECT_PATH,
  PROJECT_NAME,
  SERVER_HOST,
  SERVER_PORT,
  isDev,
}
