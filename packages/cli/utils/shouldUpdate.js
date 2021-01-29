const semver = require("semver");
const fs = require("fs-extra");
const ora = require("ora");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { execSync } = require("child_process");

const EXPIRES_TIME = 86400000;

/**
 * 获取依赖的版本信息
 * @param {*} name 依赖包名
 */
function getDepVersion(name) {
  let version = "";

  try {
    version = execSync(`npm view ${name} version`, {
      encoding: "utf8",
    });
    version = version ? version.replace(/[\r\n]/g, "") : "";
  } catch (error) {}
  return version;
}

/**
 * 获取版本信息
 */
function checkVersion({ filePath, name }) {
  const lastTime = fs.readFileSync(filePath).toString();
  const currentTime = new Date().getTime();

  if (lastTime && currentTime - lastTime < EXPIRES_TIME) {
    return;
  }

  fs.writeFileSync(filePath, currentTime);

  return getDepVersion(name);
}

/**
 * 校验版本，是否需要更新
 * @param {*} pkg package.json 文件
 * @param {*} versionPath 记录校验版本的时间戳文件
 */
module.exports = async function (pkg, versionPath) {
  const { version, name } = pkg;
  const lastVersion = checkVersion({ filePath: versionPath, name }) || "1.0.0";

  if (lastVersion && semver.gt(lastVersion, version)) {
    const { ok } = await inquirer.prompt([
      {
        type: "confirm",
        message: `最新版本是 ${lastVersion} ，需要更新吗？`,
        name: "ok",
      },
    ]);

    if (ok) {
      const spinner = ora(`正在准备更新 ${name} ...`);
      spinner.start();

      execSync(`npm update ${name} -g`);
      spinner.succeed(chalk.green(`${name} 已经更新至 ${lastVersion}`));
    }
  }
};
