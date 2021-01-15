const webpack = require('webpack')
const { SERVER_HOST, SERVER_PORT } = require('./config')

// const proxySetting = require('../src/proxy.js.js')

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: SERVER_HOST,
    port: SERVER_PORT, // 默认是8080
    stats: 'errors-only', // 终端仅打印 error
    clientLogLevel: 'silent', // 日志等级
    compress: true, // 是否启用 gzip 压缩
    open: true, // 打开默认浏览器
    hot: true, // 热更新
    // proxy: { ...proxySetting },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
}