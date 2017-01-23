/**
 * app
 */

/* Node modules */
const path = require('path');

/* Third-party modules */
const Server = require('../../../src/lib/server');
const Steeplejack = require('../../../src/steeplejack');

/* Files */

const app = Steeplejack.app({
  config: require('./config'),
  modules: [
    `${__dirname}/!(routes)/**/*.es6`
  ],
  routesDir: path.join(__dirname, 'routes'),
  routesGlob: '**/*.es6'
});

const deps = [
  '$config',
  'Restify',
  'SocketIO',
];

app.run(deps, (config, Restify, SocketIO) => {
  const restify = new Restify();

  const socket = new SocketIO();

  return new Server(config.server, restify, socket);
});

module.exports = app;
