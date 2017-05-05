'use strict';

const path = require('path');
const webpack = require('webpack');

function buildConfig(env) {
  let baseConfig = require('./base')(env);
  let defaultSettings = require('./defaults')(env);
  let config = Object.assign({}, {
    // import base config values
    output: baseConfig.output, // defines output location of build assets (/dist)
    node: baseConfig.node,
    externals: baseConfig.externals,
    resolve: baseConfig.resolve,
    context: baseConfig.context,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: defaultSettings.srcPath,
          enforce: 'pre',
          use: 'eslint-loader'
        },
        {
          test: /\.jsx?$/,
          use: ['babel-loader'],
          include: [].concat(
            baseConfig.additionalPaths,
            [path.join(__dirname, '/../src')]
          )
        },
        {
          test: /\.css$/,
          use: [
            {loader:'style-loader', options: {sourceMap: true}},
            {loader:'css-loader', options: {sourceMap: true}}
          ]
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            'style-loader',
            {loader: 'css-loader', options: {sourceMap: true}},
            {loader: 'sass-loader', options: {sourceMap: true}}
          ]
        }, {
          test: /\.less$/,
          use: [
            'style-loader',
            {loader: 'css-loader', options: {importLoaders: 1}},
            'less-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif)(\?v=\d\.\d\.\d)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }]
        }, {
          test: /\.(mp4|ogg)(\?v=\d\.\d\.\d)?$/,
          use: ['file-loader']
        }, {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }]
        }, {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: ['file-loader']
        }
      ]
    },
    // rest is for webpack dev server && HMR
    devServer: {
      contentBase: './src/',
      historyApiFallback: true,
      hot: true,
      host: '0.0.0.0',
      port: defaultSettings.port,
      publicPath: '/assets/', // not needed, but present for clarification
      noInfo: false
    },
    entry: [
      './src/index.js',
      // additional entry points to enable HMR
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://127.0.0.1:' + defaultSettings.port,
      'webpack/hot/only-dev-server'
    ],
    cache: true,
    devtool: 'eval-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ]
  });
  return config;
}

module.exports = buildConfig;
