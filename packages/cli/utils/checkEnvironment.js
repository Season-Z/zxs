/**
 * 检测node环境
 */
const chalk = require("chalk");
const semver = require("semver");
const pkg = require("../package.json");

module.exports = function () {
  const { engines, name } = pkg;
  if (!semver.satisfies(process.version, engines.node)) {
    console.log(
      chalk.red(
        `你是用的Node版本号为：${process.version}，但 ${name} 需运行在 ${engines.node} .\n请升级你的Node版本`
      )
    );
    process.exit(1);
  }

  /**
   * 简单来说，Node 的主版本分为奇数版本和偶数版本。
   * 每个版本发布之后会持续六个月的时间，六个月之后，奇数版本将变为 EOL 状态，而偶数版本变为 **Active LTS **状态并且长期支持。
   * 所以我们在生产环境使用 Node 的时候，应该尽量使用它的 LTS 版本，而不是 EOL 的版本。
   */
  const EOL_NODE_MAJORS = ["8.x", "9.x", "11.x", "13.x"];
  for (const major of EOL_NODE_MAJORS) {
    if (semver.satisfies(process.version, major)) {
      console.log(
        chalk.red(
          `You are using Node ${process.version}.\n` +
            `Node.js ${major} has already reached end-of-life and will not be supported in future major releases.\n` +
            "It's strongly recommended to use an active LTS version instead.\n" +
            "请前往安装：http://nodejs.cn/"
        )
      );
    }
  }
};
