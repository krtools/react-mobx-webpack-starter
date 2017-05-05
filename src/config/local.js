'use strict';

import baseConfig from './base';
import devConfig from './dev';

let config = {
  appEnv: 'dev'
};

export default Object.freeze(Object.assign({}, baseConfig, devConfig, config));
