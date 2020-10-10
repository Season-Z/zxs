const dirname = process.platform === 'win32' ? 'USERPROFILE' : 'HOME'
// 缓存目录
function cacheDir() {
  return `${process.env[dirname]}/zxs`
}

// 模板列表的缓存
function tmpDir() {
  return `${process.env[dirname]}/zxs/tmp-list.txt`
}

// 是否支持yarn命令行
let _hasYarn
function hasYarn() {
  if (_hasYarn !== undefined) {
    return _hasYarn
  }

  try {
    const { execSync } = require('child_process')
    execSync('yarn --version', { stdio: 'ignore' })

    _hasYarn = true
  } catch (error) {
    _hasYarn = false
  } finally {
    return _hasYarn
  }
}


module.exports = {
  cacheDir: cacheDir(),
  tmpDir: tmpDir(),
  hasYarn
}