module.exports = {
  publicPath: './',

  //打包文件放置目录
  outputDir:'dist',
  
  //打包后静态文件放置目录
  assetsDir:'static',

  //是否展示源码
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,

  devServer: {
    // host:'localhost',//开发时的项目虚拟服务器地址，可不配置自适应
    // port:8082,//开发时的项目端口，可不配置自适应
    proxy: {
        '/api': {
            target: 'https://trialtest.olcourt.cn/api/',   // 需要请求的地址
            changeOrigin: true,  // 是否跨域
            pathRewrite: {
                '^/api': '/'  // 替换target中的请求地址，也就是说，在请求的时候，
                              // url用'/api'代替'https://trialtest.olcourt.cn/api/'
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
    },
  }
}