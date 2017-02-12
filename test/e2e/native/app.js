/**
 * app
 */

/* Node modules */
const path = require('path');

/* Third-party modules */
const Server = require('../../../build/lib/server'); // eslint-disable-line import/no-unresolved
const Steeplejack = require('../../../build/steeplejack'); // eslint-disable-line import/no-unresolved

/* Files */

const app = Steeplejack.app({
  config: require('./config'),
  modules: [
    `${__dirname}/!(routes)/**/*.js`,
  ],
  routesDir: path.join(__dirname, 'routes'),
});

const deps = [
  '$config',
  'Restify',
  'SocketIO',
];

app.run(deps, (config, Restify, SocketIO) => {
  const restify = new Restify();

  restify.bodyParser();
  restify.gzipResponse();

  const socket = new SocketIO();

  return new Server(config.server, restify, socket);
});

module.exports = app;
