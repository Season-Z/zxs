const chalk = require("chalk");
const fs = require("fs-extra");

const { cacheDir } = require("../utils/config");

async function clear() {
  await fs.remove(cacheDir);

  console.log();
  console.log(chalk.green(" 🚀 成功清除本地缓存！"));
  console.log();
}

module.exports = (...args) => {
  return clear(...args).catch((err) => {
    console.clear();
    console.log();
    console.error(chalk.red("❌", err));
    console.log();
    process.exit(-1);
  });
};
