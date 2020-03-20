module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : './',
    outputDir:'dist',
    assetsDir:'',
    devServer: {
      proxy: {
        //   将 setBaseUrl.js 里的 baseUrl 匹配过来
        //       || 
          '/api': {
              target: 'https://trialtest.olcourt.cn/api/',   // 需要请求的地址
              changeOrigin: true,  // 是否跨域
              pathRewrite: {
                  '^/api': '/'  // 替换target中的请求地址，也就是说，在请求的时候，
                                // url用'/proxy'代替'http://ip.taobao.com'
              }
          }
      },  // 配置多个代理
    },
    configureWebpack:{//webpack配置
      performance:{
        hints:'warning',
        maxEntrypointSize:50000000,
        maxAssetSize:50000000,
        assetFilter: function(assetFilename) {
          return assetFilename.endsWith('.js');//只给初相关js文件的性能提示
        }
      }
    },
};