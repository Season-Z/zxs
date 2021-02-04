const fs = require("fs-extra");
const inquirer = require("inquirer");
const chalk = require("chalk");
const path = require("path");

const template = require("../../templates");
const checkEnvironment = require("../utils/checkEnvironment");
const checkName = require("../utils/checkName");
const clearArgv = require("../utils/clearArgv");
const PackageManager = require("../utils/PackageManager");
const shouldUpdate = require("../utils/shouldUpdate");
const pkg = require("../package.json");

/**
 * 校验项目名称，目录名称
 * @param {*} projectName 用户录入的项目名称
 * @param {*} options 其他配置信息
 */
async function validateName(projectName = ".", options) {
  // 检查node环境
  await checkEnvironment();

  // 是否需要更新
  const versionPath = path.join(__dirname, "../config/version.txt");
  await shouldUpdate(pkg, versionPath);

  const { targetDir, pkgName, isCurrentDir } = checkName(projectName, options);

  if (fs.existsSync(targetDir)) {
    clearArgv();

    if (isCurrentDir) {
      const { ok } = await inquirer.prompt([
        {
          type: "confirm",
          name: "ok",
          message: "确认当前目录下初始化项目吗？",
        },
      ]);

      if (!ok) {
        process.exit(-1);
      }
    } else {
      const { handle } = await inquirer.prompt([
        {
          type: "confirm",
          name: "handle",
          message: "目录已经存在，是否确认覆盖？",
        },
      ]);

      if (handle) {
        await fs.remove(targetDir); // 将本地原文件删除
      } else {
        process.exit(-1);
      }
    }
  }
  clearArgv();

  return Object.assign({}, options, { projectName: pkgName, targetDir });
}

/**
 * 初始化项目，拉取模板
 * @param {*} params
 */
async function initProject(params) {
  const { targetDir } = params;

  const { temp } = await inquirer.prompt([
    {
      type: "list",
      name: "temp",
      message: "请选择模板",
      choices: [{ name: "react-typescript", value: "rt" }],
    },
  ]);

  // 拷贝文件
  await template(targetDir, temp);

  clearArgv();
  return params;
}

/**
 * 安装依赖
 */
async function installDeps(params) {
  const { projectName, targetDir } = params;
  const mg = new PackageManager(targetDir);

  // 进入项目目录
  mg.cdProjectPath();
  mg.install();
  mg.git();

  console.log();
  console.log(`🎉 成功生成项目:${projectName}`);
  console.log();
}

module.exports = (...args) => {
  return validateName(...args)
    .then(initProject)
    .then(installDeps)
    .catch((err) => {
      console.log();
      console.error(chalk.red("❌", `创建项目失败：${err}`));
      console.log();
      process.exit(-1);
    });
};
