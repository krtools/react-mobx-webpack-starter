'use strict';
const path = require('path');

function getEnvs(env) {
  // List of allowed app environments
// configures the API urls and other "runtime" configuration
  const allowedAppEnvs = ['dev', 'prod', 'local', 'test'];

  // List of allowed build environments
  // dev -- debug mode, sourcemaps and HMR
  // dist -- all optimizations turned on, copy files to ./dist, used in conjunction with npm run serve:dist
  // test -- for karma tests, uses dev app environment
  const allowedBuildEnvs = ['dev', 'dist', 'test'];

  // --env controls runtime environment (dev/sat/prod)
  let appEnv = env.env;
  if (process.env.NODE_ENV === 'test') {
    appEnv = 'test';
  } else if (!appEnv || allowedAppEnvs.indexOf(appEnv) === -1) {
    throw new Error(`valid app env (${allowedAppEnvs}) is required for a webpack build, you passed ${appEnv}`);
  }

  //--buildenv controls build type (dev/dist)
  let buildEnv;
  if (process.env.NODE_ENV === 'test') {
    buildEnv = 'test';
  } else if (env.buildenv) {
    buildEnv = env.buildenv;
  } else {
    // when not specified we assume dev
    buildEnv = 'dev';
  }
  if (!buildEnv || allowedBuildEnvs.indexOf(buildEnv) === -1) {
    throw new Error(`valid build env (${allowedBuildEnvs}) is required for a webpack build, you passed ${buildEnv}`);
  }

  return {
    env: appEnv,
    buildEnv: buildEnv
  };

}

// allow different environment to undertake prod's build configuration...but use
// "app" env configuration for things like urls. by breaking out the app environment
// and the build environment, we can deploy a minified and optimized build for dev
// or prod, still apply the specific app configs. It also allows us to test the
// public distribution build locally with `npm run dist:<env> && npm run serve:<env>`
/**
 * Build the webpack configuration
 * @param  {String} wantedEnv The wanted environment
 * @return {Object} Webpack config
 */
function buildConfig(env) {
  env = Object.assign({}, env, getEnvs(env));
  let config = require('./cfg/' + env.buildEnv);
  return config(env);
};

module.exports = buildConfig;
