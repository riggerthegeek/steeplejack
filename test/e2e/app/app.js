/**
 * app
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import Server from '../../../src/lib/server';
import Steeplejack from '../../../src/steeplejack';

/* Files */

const app = Steeplejack.app({
  config: require('./config'),
  modules: [
    `${__dirname}/!(routes)/**/*.js`
  ],
  routesDir: path.join(__dirname, 'routes')
});

const deps = [
  '$config',
  'Restify',
  'SocketIO',
];

app.run(deps, function run (config, Restify, SocketIO) {
  const restify = new Restify();

  const socket = new SocketIO();

  return new Server(config.server, restify, socket);
});

export default app;
