const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')

require('@babel/polyfill')

module.exports = (env, opts) => {
  const config = {
    resolve: {
      extensions: [
        '.vue', '.js'
      ]
    },
    //진입점
    entry: {
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'main.js')
      ]
    },
    // 결과물에 대한 설정
    output: {
      filename: '[name].js', // app.js
      path: path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/i,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new CopyPlugin({
        patterns: [
          { from: 'assets/', to: '' }
        ]
      }),
    ]
  }

  if (opts.mode === 'development') {
    //개발용
    return merge(config, {
      //추가 개발용 옵션
      devtool: 'eval',
      devServer: {
        open: false,
        hot: true,
        contentBase: path.join(__dirname, 'dist'),
        port: 8080
      },
    })
  } else {
    //제품용
    return merge(config, {
      //추가 제품용 옵션
      devtool: 'cheap-module-source-map',
      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }
}