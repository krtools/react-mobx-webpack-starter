'use strict';
const path = require('path');

const srcPath = path.join(__dirname, '/../src');
const serverPort = 8000;

function getDefaultModules(env) {
  // TODO: might place elsewhere since this value is initialized in webpack.config
  const buildEnv = env.buildEnv;
  const srcmap = (buildEnv === 'dev') ? '?sourceMap' : '';
  const sassmap = (buildEnv === 'dev') ? '?sourceMap&' : '?';

  return {
    preLoaders: [{
      test: /\.(js|jsx)$/,
      include: srcPath,
      loader: 'eslint'
    }],
    loaders: [
      {
        test: /\.css$/,
        loader: `style!css${srcmap}!postcss`
      },
      {
        test: /\.sass/,
        loader: `style!css${srcmap}!postcss!sass${sassmap}outputStyle=expanded&indentedSyntax`
      },
      {
        test: /\.scss/,
        loader: `style!css${srcmap}!postcss!sass${sassmap}outputStyle=expanded`
      },
      {
        test: /\.less/,
        loader: `style!css${srcmap}!postcss!less`
      },
      {
        test: /\.styl/,
        loader: `style!css${srcmap}!postcss!stylus`
      },
      {
        test: /\.(png|jpg|gif)(\?v=\d\.\d\.\d)?$/,
        loader: 'url?limit=8192'
      },
      {
        test: /\.(mp4|ogg)(\?v=\d\.\d\.\d)?$/,
        loader: 'file'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file"
      }
    ]
  };
}

function buildDefaults(env) {
  return {
    srcPath: srcPath,
    port: serverPort,
    getDefaultModules: () => getDefaultModules(env),
    postcss: function () {
      return [];
    }
  }
}

module.exports = buildDefaults;

