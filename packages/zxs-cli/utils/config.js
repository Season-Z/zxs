const envBin = require("./env");

const dirname = process.platform === "win32" ? "USERPROFILE" : "HOME";
// 缓存目录
function cacheDir() {
  return `${process.env[dirname]}/zxs`;
}

// 模板列表的缓存
function tmpDir() {
  return `${process.env[dirname]}/zxs/tmp-list.txt`;
}

module.exports = {
  cacheDir: cacheDir(),
  tmpDir: tmpDir(),
  ...envBin,
};
