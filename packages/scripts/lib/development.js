'use strict';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { developmentConfig } = require('./complexConfig')

module.exports = () => {
  const config = developmentConfig()
  const { devServer } = config;

  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, { ...devServer });

  server.listen(devServer.port);
};
