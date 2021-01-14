'use strict';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const devConfig = require('./config/webpack.development')
// const prodConfig = require('./config/webpack.production')

module.exports = () => {
  const { devServer } = devConfig;
  const compiler = webpack(devConfig);
  console.log(devServer)
  const server = new WebpackDevServer(compiler, { ...devServer });
  server.listen(devServer.port);
};
