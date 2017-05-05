/*eslint no-console:0 */
'use strict';
const webpack = require('webpack');
const args = require('minimist')(process.argv.slice(2));

// if there's an env passed down that means we're debugging a specific environment, otherwise
// we are simply serving up the resources in ./dist
if(args.env) {
	console.log('Starting webpack dev server for %s profile', args.env);
	const config = require('./webpack.config')({
    env: args.env
  });

	const WebpackDevServer = require('webpack-dev-server');
	new WebpackDevServer(webpack(config), config.devServer)
	.listen(config.devServer.port, '0.0.0.0', (err) => {
		if (err) {
			console.log(err);
		}
		console.log('Listening at localhost:' + config.devServer.port);
	});
} else {
	// basic http server to test the /dist build
	// runs with `npm run serve:dist
	const pathRoot = __dirname + '/dist';

	const express = require('express');
	const compression = require('compression');

	const app = express();
	app.use(compression());

	app.use('/', express.static(pathRoot, {
		maxAge: 86400 * 1000 * 365
	}));

	app.listen('8000', '0.0.0.0', err => {
		if(err) {
			console.error(err);
		}
		console.info('Listening on localhost:8000');
	});
}
