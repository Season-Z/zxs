const proxyConfig = {
  '/api': {
    target: 'https://apigw.ypshengxian.com/request',
    changeOrigin: true,
    pathRewrite: {
      '/api': '',
    },
  },
}

module.exports = proxyConfig
