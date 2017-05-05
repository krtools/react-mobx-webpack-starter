'use strict';
process.env.NODE_ENV = 'production';
let path = require('path');
let webpack = require('webpack');

// puts css/sass into own css files
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// generates html with settings/values based on config and outputs
const HtmlWebpackPlugin = require('html-webpack-plugin');
// must have es6 version of uglifyjs
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

function buildConfig(env) {
  let baseConfig = require('./base')(env);

  let config = Object.assign({}, {
    // base config imports
    output: baseConfig.output, // defines output location of build assets (/dist)
    node: baseConfig.node,
    externals: baseConfig.externals,
    resolve: baseConfig.resolve,
    context: baseConfig.context,
    // dist-specific props
    entry: path.join(__dirname, '../src/index'),
    // cache: false, // probably not needed, might be useful in watch mode
    devtool: 'sourcemap', // original source
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      // minifier
      new UglifyJSPlugin({
        sourceMap: true
      }),
      // moment includes a function that has "require('moment/locale/' + name)" so webpack is forced
      // to bring in all the locales, we only care about en locale. shaves ~250kb off min prod build
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
      // xlsx-style is a fork of xlsx to support styles in cells, but author did not update internal
      // imports for xlsx, so we need to de-dupe and only get xlsx-style exports, otherwise bundle
      // doubles in size (+500KB)
      new webpack.NormalModuleReplacementPlugin(/[\\\/]xlsx[\\\/]/, req => {
        req.request = req.request.replace(/([\\\/])xlsx([\\\/])/, '$1xlsx-style$2');
      }),
      // avoid FOUC
      new ExtractTextPlugin('[name].[chunkhash].css'),
      // generate index.html
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../src/index.ejs'),
        inject: false,
        appMountId: 'app',
        title: false,
        filename: '../index.html',
        mobile: true,
        minify: {
          collapseWhitespace: true
        }
      })
    ],
    module: {}
  });

  config.module.rules = [{
    test: /\.(js|jsx)$/,
    enforce: 'pre',
    loader: 'eslint-loader'
  }, {
    test: /\.(js|jsx)$/,
    loader: 'babel-loader',
    include: [].concat(
      baseConfig.additionalPaths,
      [path.join(__dirname, '/../src')]
    )
  }, {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [{
        loader: 'css-loader',
        options: {
          minimize: true,
          sourceMap: true
        }
      }]
    })
  }, {
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: false,
            minimize: true,
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader'
        },
        {
          loader: 'sass-loader',
          query: {
            sourceMap: true
          }
        }
      ]
    })
  }, {
    test: /\.(png|jpe?g|gif)(\?v=\d\.\d\.\d)?$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: '[name].[hash].[ext]'
      }
    }]
  }, {
    test: /\.(mp4|ogg)(\?v=\d\.\d\.\d)?$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]'
      }
    }]
  }, {
    test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 10000,
        mimetype: 'application/font-woff',
        name: '[name].[hash].[ext]'
      }
    }]
  }, {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]'
      }
    }]
  }];

  // public path is the absolute location where all resources are served. This is generally used
  // if the compiled assets are served from a CDN so the generated HTML has the right base path,
  // but if everything can be served relative to index.html, then it suffices to make it undefined
  // as long as we are setting __webpack_public_path__ at runtime (using document.url)
  config.output.publicPath = undefined;

  return config;
}

module.exports = buildConfig;
