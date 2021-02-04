const fs = require("fs-extra");
const path = require("path");

/**
 * 拷贝文件至输出目录
 * @param {*} targetDir 输出目录
 * @param {*} templateType 模板类型
 */
module.exports = async function (targetDir, templateType) {
  const tempSrc = path.join(__dirname, "./react-typescript");

  await fs.copy(tempSrc, targetDir);
};
