/**
 * 根据用户自定义的配置文件来匹配webpack配置
 */
"use strict";

const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const { merge } = require("webpack-merge");

const commonConfigFunc = require("./config/webpack.common");
const devConfig = require("./config/webpack.development");
const prodConfig = require("./config/webpack.development");
const {
  defaultCustomerConfig,
  excludeValidateKeyArr,
  ALIAS,
} = require("./defaultCustomerConfig");

const cwd = process.cwd();
// 默认在根目录
const customerConfig = require(`${cwd}/zxs.config.js`);

// 校验并返回绝对路径
function validateFilePath(filename, filePath, validate) {
  const completePath = path.resolve(cwd, filePath);

  if (!fs.existsSync(completePath) && validate) {
    console.log(
      `${chalk.bgRed("配置错误:")} ${chalk.red(`${filename} 文件不存在`)}`
    );
    process.exit(1);
  }

  return completePath;
}

// 获取配置文件的路径
function getConfigFilePath(params) {
  const completePathObject = Object.entries(params).reduce((pre, next) => {
    const [filename, filePath] = next;

    if (filename === ALIAS) {
      const result = getConfigFilePath(filePath);
      return {
        ...pre,
        [filename]: result,
      };
    }

    const shouldeValidate = !excludeValidateKeyArr.includes(filename);
    const file = validateFilePath(filename, filePath, shouldeValidate);

    return {
      ...pre,
      [filename]: file,
    };
  }, {});
  return completePathObject;
}

// 合并配置
const finalConfig = Object.assign({}, defaultCustomerConfig, customerConfig);
// 获取绝对路径
const completePathConfig = getConfigFilePath(finalConfig);
// webpack 公共配置
const baseConfig = commonConfigFunc(completePathConfig);

exports.developmentConfig = () => merge(baseConfig, devConfig);
exports.productionConfig = () => merge(baseConfig, prodConfig);
