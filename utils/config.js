// 缓存目录
function cacheDir() {
  const dirname = process.platform === 'win32' ? 'USERPROFILE' : 'HOME'
  return `${process.env[dirname]}/zxs`
}


module.exports = {
  cacheDir
}