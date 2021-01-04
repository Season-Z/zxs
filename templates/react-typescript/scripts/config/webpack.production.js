const { resolve } = require('path')
const { merge } = require('webpack-merge')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TersetWebpackPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const glob = require('glob')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')

const baseConfig = require('./webpack.common')
const { PROJECT_PATH } = require('../constant')

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'none',
  output: {
    path: resolve(PROJECT_PATH, 'dist'),
    filename: 'scripts/[name].[contenthash:8].js',
    chunkFilename: 'scripts/[name].[contenthash:8].js',
  },
  parallelism: 1, // 限制并行处理模块的数量
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
      new TersetWebpackPlugin({
        extractComments: false,
        terserOptions: {
          compress: { pure_funcs: ['console.log'] }, // 去除console
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    /**
     * glob 是用来查找文件路径的，我们同步找到 src 下面的后缀为 .tsx 、 .(sc|c|le)ss 的文件路径并以数组形式返给 paths ，然后该插件就会去解析每一个路径对应的文件，将无用样式去除；
     * nodir 即去除文件夹的路径，加快处理速度。
     */
    new PurgeCSSPlugin({
      paths: glob.sync(`${resolve(PROJECT_PATH, './src')}/**/*.{tsx,scss,less,css}`, { nodir: true }),
      whitelist: ['html', 'body'],
    }),
  ],
})
