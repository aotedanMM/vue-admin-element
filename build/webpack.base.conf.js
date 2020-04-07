'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const { VueLoaderPlugin } = require('vue-loader')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  // 上下文解析路径
  context: path.resolve(__dirname, '../'),
  // 打包入口文件
  entry: {app: ['babel-polyfill', './src/main.js']},
  // entry: {
  //   app: './src/main.js'
  // },
  // 输出配置
  output: {
    // 输出路径
    path: config.build.assetsRoot,
    // 输出多文件名字为[name].js
    filename: '[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  // 解析
  resolve: {
    // 用户在引入模块时不带扩展.js .vue .json
    extensions: ['.js', '.vue', '.json'],
    // 起别名
    alias: {
      '@': resolve('src')
    }
  },
  // loader 将不同格式文件通过对应loader转化为webpack能解析的js
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      // 格式为.vue文件的时候使用vue-loader转化
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/webpack-dev-server/client')
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          publicPath: '../../',
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 800000, // 解决打包后element图标不显示问题
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  // 插件
  plugins: [new VueLoaderPlugin()],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty', // 数据报
    fs: 'empty', // 文件系统
    net: 'empty', // 网络
    tls: 'empty',  // 安全传输层
    child_process: 'empty' // 子进程
  }
}
