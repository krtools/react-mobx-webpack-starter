'use strict';

import baseConfig from './base';
import devConfig from './dev';

let config = {
  appEnv: 'test'
};

export default Object.freeze(Object.assign(baseConfig, devConfig, config));
