// we use dynamic public path, set it @ entry point before any other imports or code
import './setPublicPath';

import 'styles/base/theme.scss';
import 'normalize.css/normalize.css';
import 'font-awesome-webpack';

// polyfills, mostly for IE
import 'core-js/fn/object/assign';
import 'core-js/fn/string/starts-with';
import 'core-js/es6/promise'; // for axios
import 'core-js/fn/number/is-finite';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

// includes a prod version to not bloat the build
import {AppContainer} from 'react-hot-loader';

const render = (App) => ReactDOM.render(<AppContainer><App/></AppContainer>, document.getElementById('app'));
// Render the main component into the dom
// adding a setTimeout to defeat IE's auto-fill (can't turn it off otherwise)
setTimeout(() => render(App));

if(module.hot) {
  module.hot.accept('./components/App', () => render(App));
}
