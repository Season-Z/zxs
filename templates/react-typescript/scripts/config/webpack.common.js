const os = require('os')
const { resolve } = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const WebpackBar = require('webpackbar')

const { PROJECT_PATH, isDev } = require('../constant')

// 开辟一个线程池
// 拿到系统CPU的最大核数，happypack 将编译工作灌满所有线程
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const cssLoader = (importLoaders) => [
  {
    loader: 'cache-loader',
    options: {
      cacheDirectory: '.tmp/css-loader',
    },
  },
  isDev ? { loader: 'style-loader' } : MiniCSSExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: { sourceMap: isDev, modules: false, importLoaders },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          // 修复一些和 flex 布局相关的 bug
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              grid: true,
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          require('postcss-normalize'),
        ],
      },
      sourceMap: isDev,
    },
  },
]

module.exports = {
  entry: resolve(PROJECT_PATH, './src/index.tsx'),
  output: {
    path: resolve(PROJECT_PATH, 'dist'),
    filename: `scripts/[name]${isDev ? '' : '.[hash:8]'}.js`,
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoader(1),
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          ...cssLoader(2),
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: 'happypack/loader?id=js',
      },
      {
        test: /\.(png|jp(e)?g|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024, // 大于 10kb ， url-loader 就不用，转而去使用 file-loader
          esModule: false,
          name: '[name].[contenthash:8].[ext]',
          outputPath: 'assets/images',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[contenthash:8].[ext]',
            outputPath: 'assets/fonts',
          },
        },
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'initial',
          name: 'vendors',
          priority: 10,
          enforce: true,
        },
        default: {
          chunks: 'initial',
          minChunks: 2,
          name: 'commons',
        },
      },
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    modules: [resolve(PROJECT_PATH, './src'), 'node_modules'],
    alias: {
      '@src': resolve(PROJECT_PATH, './src'),
      '@components': resolve(PROJECT_PATH, './src/components'),
      '@utils': resolve(PROJECT_PATH, './src/utils'),
    },
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM', // 大写 驼峰
  },
  plugins: [
    new WebpackBar(),
    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            cacheDirectory: '.tmp/babel-loader',
          },
        },
      ],
    }),
    !isDev &&
    new MiniCSSExtractPlugin({
      filename: 'style/[name].[hash:8].css',
      chunkFilename: 'style/[name].[hash:8].css', // 未被列在entry中，却又需要被打包出来的文件命名配置。按需加载时
    }),
    new HtmlWebpackPlugin({
      title: 'hello world',
      template: resolve(PROJECT_PATH, 'public/index.html'),
      cache: false, // 防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
      minify: isDev
        ? false
        : {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          removeComments: true,
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          useShortDoctype: true,
        },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: resolve(PROJECT_PATH, './public'),
          from: '*',
          to: resolve(PROJECT_PATH, './dist'),
          toType: 'dir',
        },
      ],
    }),
    new webpack.DefinePlugin({
      // 值要求的是一个代码片段
      BASE_URL: JSON.stringify('./'),
    }),
    // 存在ts的编译报错，打包不能成功
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: resolve(PROJECT_PATH, './tsconfig.json'),
      },
    }),
  ].filter(Boolean),
}
