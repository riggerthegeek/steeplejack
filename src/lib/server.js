/**
 * server
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';
import { Base } from '@steeplejack/core'

/* Files */
import Socket from './socket';

/**
 * Add Route
 *
 * Adds the route to the strategy and configures
 * the output ready for use by the output handler.
 * The tasks are run in order, not resolving any
 * future ones if a previous one has failed.
 *
 * This must be set to the scope of the class.
 *
 * @param {object} request
 * @param {object} response
 * @param {Array} tasks
 * @returns {Promise}
 */
function addRoute (request, response, tasks) {
  /* Use the outputHandler method to output */
  return this.outputHandler(request, response, () => {
    /* Run the tasks in order */
    return tasks.reduce((thenable, task) => {
      return thenable.then(() => {
        return new Promise(resolve => {
          /* Invoke the function */
          const result = task(request, response);
          /* Resolve the result */
          resolve(result);
        });
      });
    }, Promise.resolve());
  });
}

/**
 * Methods
 *
 * The HTTP methods that can be called. There is
 * a special 'all' type which, if called, will
 * specify all of these methods.
 *
 * @type {string[]}
 */
const methods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'PATCH'
];

class Server extends Base {

  constructor (options, strategy, socket) {
    super();

    if (_.isObject(strategy) === false) {
      throw new SyntaxError('Server strategy object is required');
    }

    this.afterUse = [];
    this.options = options;
    this.strategy = strategy;
    this.socket = undefined;

    /* Optional - create a socket server */
    if (socket) {
      socket.createSocket(this.strategy);

      this.socket = new Socket(socket);
    }
  }

  /**
   * Add Route
   *
   * Adds a single route to the stack
   *
   * @param {string} httpMethod
   * @param {string} route
   * @param {Function|Function[]} fn
   * @returns {Server}
   */
  addRoute (httpMethod, route, fn) {

    /* This the function that is set to the route */
    let routeFn;

    if (_.isString(httpMethod) === false) {
      throw new TypeError('httpMethod must be a string');
    }

    if (_.isString(route) === false) {
      throw new TypeError('route must be a string');
    }

    if (_.isFunction(fn) === false && _.isArray(fn) === false) {
      throw new TypeError('fn must be a function or array');
    }

    httpMethod = httpMethod.toUpperCase();

    if (httpMethod === 'ALL') {
      _.each(methods, method => {
        this.addRoute(method, route, fn);
      });
      return this;
    }

    switch (httpMethod) {

      case 'DEL':
        httpMethod = 'DELETE';
        break;

      case 'OPTS':
        httpMethod = 'OPTIONS';
        break;

      default:
        if (methods.indexOf(httpMethod) === -1) {
          /* An invalid method */
          throw new SyntaxError(`HTTP method is unknown: ${httpMethod}`);
        }
        break;

    }

    /* Emit the route for logging */
    this.emit('routeAdded', httpMethod, route);

    /* Ensure routeFn is always an array */
    if (_.isArray(fn)) {
      routeFn = fn;
    } else {
      routeFn = [ fn ];
    }

    this.strategy.addRoute(httpMethod, route, (request, response) => {
      return addRoute.call(this, request, response, routeFn);
    });

    return this;

  }

  /**
   * Add Routes
   *
   * Takes the route object and adds to the
   * server instance
   *
   * @param {object} routes
   * @returns {Server}
   */
  addRoutes (routes) {
    if (_.isPlainObject(routes)) {
      /* Cycle through and add in the routes */
      _.each(routes, (methods, route) => {
        if (_.isPlainObject(methods)) {
          /* Add the HTTP verbs and endpoints */
          _.each(methods, (fn, method) => {
            this.addRoute(method, route, fn);
          });
        }
      });
    }

    return this;
  }

  /**
   * Add Sockets
   *
   * Adds namespaces and events to the socket
   * instance. If there's no socket server
   * configured, it won't add anything.
   *
   * @param {object} sockets
   * @returns {Server}
   */
  addSockets (sockets) {
    /* Only add if a socket connection */
    if (this.socket !== null) {
      _.each(sockets, (events, namespace) => {
        this.socket.namespace(namespace, events);
        _.each(events, (event, eventName) => {
          this.emit('socketAdded', namespace, eventName);
        });
      });
    }

    return this;
  }

  getServer () {
    return this.strategy.getServer();
  }

  outputHandler (req, res, fn, logError = true) {
    const task = resolve => resolve(fn());

    return new Promise(task)
      .then(data => Server.parseData(data))
      // @todo - add preSend
      // .then(({ statusCode, output }) => {
      //   console.log({
      //     statusCode,
      //     output
      //   });
      //   process.exit();
      // })
      .catch(err => {
        const parsedError = Server.parseError(err);

        /* A thrown error is an uncaught error */
        if (logError) {
          this.emit('error_log', err);
        }

        return parsedError;
      })
      .then(({ statusCode, output }) => {
        /* Is output empty? */
        if (
          statusCode === 200 &&
          _.isEmpty(output) &&
          _.isNumber(output) === false &&
          _.isObject(output) === false
        ) {
          statusCode = 204;
          output = undefined;
        }

        return this.strategy.outputHandler(statusCode, output, req, res);
      })
      .catch(err => {
        if (this.listeners('uncaughtException').length === 0) {
          console.error('--- UNCAUGHT EXCEPTION ---');
          if (err.stack) {
            console.error(err.stack);
          } else {
            console.error(err);
          }

          /* Throw the error for the outputHandler to show */
          throw err;
        }

        /* Emit an uncaught exception */
        this.emit('uncaughtException', req, res, err);

        /* No throwing as uncaught exception handler will deal with the outputting */
      });
  }

  /**
   * Start
   *
   * Starts up the server, returning a Promise
   *
   * @return {Promise}
   */
  start () {
    return this.strategy.start(this.options.port, this.options.hostname, this.options.backlog);
  }

  static parseData (data) {
    let statusCode = 200;
    let output;

    /* Some data to display */
    if (data >= 100 && data < 600) {
      /* HTTP status code */
      statusCode = data;
    } else if (_.isObject(data) && _.isFunction(data.getData)) {
      /* Get the data from a function */
      output = data.getData();
    } else if (data === 'end') {
      statusCode = 999;
    } else {
      /* Just output the data */
      output = data;
    }

    return {
      statusCode,
      output
    };
  }

}

module.exports = Server;
