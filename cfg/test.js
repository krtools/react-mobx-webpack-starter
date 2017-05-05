'use strict';

let path = require('path');
let srcPath = path.join(__dirname, '/../src/');
let testPath = path.join(__dirname, '/../test/');


function buildConfig(env) {
  let baseConfig = require('./base')(env);

  let config = {
    devtool: 'inline-source-map',
    entry: path.join(srcPath, 'index'),
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [{
            loader: 'babel-loader?plugins=rewire',
          }],
          include: [].concat(
            baseConfig.additionalPaths,
            [
              path.join(__dirname, '/../src'),
              path.join(__dirname, '/../test')
            ]
          )
        }, {
          test: name => !/\.jsx?$/.test(name),
          use: 'null-loader'
        }
      ]
    },
    // suppress node-exclusive requirements for xlsx (not used)
    node: baseConfig.node,
    externals: baseConfig.externals,

    resolve: {
      extensions: ['.js', '.jsx'],
      alias: Object.assign({}, baseConfig.resolve.alias, {
        test: testPath
      })
    },
    plugins: []
  };

  return config;
}

module.exports = buildConfig;
