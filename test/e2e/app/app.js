/**
 * app
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import Server from '../../../src/lib/server';
import Steeplejack from '../../../src/steeplejack';

/* Files */
import Restify from './lib/restify';
import SocketIO from './lib/socketio';

const app = Steeplejack.app({
  config: require('./config'),
  modules: [
    `${__dirname}/!(routes)/**/*.js`
  ],
  routesDir: path.join(__dirname, 'routes')
});

app.run($config => {

  const restify = new Restify();

  const socket = new SocketIO();

  return new Server($config.server, restify, socket);

});

export default app;
