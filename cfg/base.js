'use strict';
let path = require('path');
let buildDefaults = require('./defaults');

function buildConfig(env) {
  let defaultSettings = buildDefaults(env);
  // Add all foreign plugins you may need into this array
  let npmBase = path.join(__dirname, '../node_modules');

  // modules that require babel
  let additionalPaths = [
  ];

  return {
    additionalPaths: additionalPaths,
    // for easy loader syntax
    moduleExtensions: ['-loader'],
    // so external files use this loader context
    context: path.join(__dirname, '/..'),
    output: {
      path: path.join(__dirname, '/../dist/assets/'),
      // dev does not need hashing, dist we use for long-term caching
      filename: env.buildEnv === 'dev' ? 'app.js' : 'app.[chunkhash].js',
    },

    resolve: {
      symlinks: false,
      modules: [
        // always check our node_modules first
        npmBase,
        'node_modules'
      ],
      extensions: ['.js', '.jsx'],
      alias: {
        components: `${defaultSettings.srcPath}/components/`,
        api: `${defaultSettings.srcPath}/api/`,
        stores: `${defaultSettings.srcPath}/stores/`,
        styles: `${defaultSettings.srcPath}/styles/`,
        config: `${defaultSettings.srcPath}/config/` + env.env
      }
    }
  };
}

module.exports = buildConfig;
