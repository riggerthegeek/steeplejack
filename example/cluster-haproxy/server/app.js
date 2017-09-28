/**
 * app
 *
 * Guerrilla Software website
 *
 * Built with Steeplejack
 *
 * @link https://getsteeplejack.com
 */

/* Node modules */

/* Third-party modules */
const Steeplejack = require('steeplejack');
const restify = require('@steeplejack/restify');

/* Files */
const config = require('./config.json');

/* Bootstrap the Steeplejack app */
const app = Steeplejack.app({
  config,
  logger: '$logger',
  modules: [
    `${__dirname}/!(node_modules|routes|themes)/**/*.js`,
    restify,
  ],
  routesDir: `${__dirname}/routes`,
});

/* Load up the server */
app.run(['server'], server => server);

exports.default = app;
