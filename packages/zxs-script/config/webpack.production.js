const { resolve } = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const glob = require("glob");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");
const { PROJECT_PATH } = require("./config");

module.exports = {
  mode: "production",
  devtool: "none",
  plugins: [
    new CleanWebpackPlugin(),
    new PurgeCSSPlugin({
      paths: glob.sync(
        `${resolve(PROJECT_PATH, "./src")}/**/*.{tsx,scss,less,css}`,
        { nodir: true }
      ),
      whitelist: ["html", "body"],
    }),
    new webpack.BannerPlugin({
      raw: true,
      banner:
        "/** @preserve Powered by webpack-react-typescript (https://Season-Z.github.io/webpack-react-typescript) */",
    }),
    // shouldOpenAnalyzer &&
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 8888,
    // }),
  ].filter(Boolean),
};
