'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    disableHostCheck: true,
    // 控制台消息提示:
    clientLogLevel: 'warning',
    // 404页面被替代
    historyApiFallback: true,
    // 模块热替换
    hot: true,
    // 一切服务都启用gzip压缩
    compress: true,
    // 默认是localhost,外部服务器可访问则需要配置
    host: HOST || config.dev.host,
    // 监听请求的端口号
    port: PORT || config.dev.port,
    // 默认提供http服务,可选择https
    https: true,
    // 当open可用时,dev server将打开浏览器
    open: config.dev.autoOpenBrowser,
    // 当发生error或warning时是否在浏览器全屏显示，默认禁用
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    //此路径下的打包文件可以在浏览器中访问
    publicPath: config.dev.assetsPublicPath,
    // 有单独的后端开发服务器api时,同域名下发送api请求
    proxy: config.dev.proxyTable,
    // 启动后，除初始启动信息之外的内容都不会被打印到控制台
    quiet: true, // necessary for FriendlyErrorsPlugin
    // 监听文件相关的控制选项
    watchOptions: {
      poll: config.dev.poll
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'Zhongke Xinhe Mine Comprehensive Detection System'
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${
                devWebpackConfig.devServer.host
              }:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
