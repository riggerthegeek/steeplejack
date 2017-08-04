/**
 * Server
 *
 * This is a strategy pattern for managing
 * a server, it's routes and sockets
 */

/* Node modules */
import http from 'http';

/* Third-party modules */
import { _ } from 'lodash';
import { Base } from '@steeplejack/core';
import requestIp from 'request-ip';
import uuid from 'uuid/v4';

/* Files */
import Socket from './socket';

class Server extends Base {
  constructor (options, strategy, socket = undefined) {
    super();

    if (_.isObject(strategy) === false) {
      throw new SyntaxError('Server strategy object is required');
    }

    this.middleware = {
      afterUse: [],
      preSend: undefined,
    };
    this.options = options;
    this.strategy = strategy;
    this.socket = undefined;

    /* Set the client IP on the request stack */
    this.strategy.use(requestIp.mw({
      attributeName: Server.clientIp,
    }));

    /* Optional - create a socket server */
    if (socket) {
      socket.createSocket(this.strategy);

      this.socket = new Socket(socket);
    }
  }

  /**
   * Logger
   *
   * Gets the logger instance
   *
   * @returns {*}
   */
  get log () {
    return this.logger;
  }

  /**
   * Logger
   *
   * Sets the logger instance. If there is a socket
   * set, it also sets the logger to that too.
   *
   * This is automatically set with either the logger
   * or a noop function during the bootstrapping of
   * the application.
   *
   * @param {*} logger
   */
  set log (logger) {
    this.logger = logger;
    this.strategy.log = logger;

    if (this.socket) {
      this.socket.log = logger;
    }
  }

  /**
   * Add Route
   *
   * Adds a single route to the stack. Accepts either
   * a function or an array of functions - it always
   * converts this to an array of functions.
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
      _.each(Server.allowableHTTPMethods, (method) => {
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
        if (Server.allowableHTTPMethods.indexOf(httpMethod) === -1) {
          /* An invalid method */
          throw new SyntaxError(`HTTP method is unknown: ${httpMethod}:${route}`);
        }
        break;
    }

    /* Log the route */
    this.log('trace', 'New route added', {
      httpMethod,
      route,
    });

    /* Emit the route */
    this.emit('routeAdded', httpMethod, route);

    /* Ensure routeFn is always an array */
    if (_.isArray(fn)) {
      routeFn = fn;
    } else {
      routeFn = [fn];
    }

    this.strategy.addRoute(httpMethod, route, (request, response) =>
      this.routeFactory(request, response, routeFn));

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
    if (this.socket) {
      _.each(sockets, (events, namespace) => {
        this.socket.namespace(namespace, events);
        _.each(events, (event, eventName) => {
          this.emit('socketAdded', namespace, eventName);
        });
      });
    }

    return this;
  }

  /**
   * After
   *
   * This function is run after the routes/sockets
   * are added.
   *
   * @param {*[]} args
   * @returns {Server}
   */
  after (...args) {
    const closure = () => args;

    this.middleware.afterUse.push(closure);

    return this;
  }

  /**
   * Close
   *
   * Closes the server
   *
   * @returns {Server}
   */
  close () {
    this.strategy.close();

    return this;
  }

  /**
   * Get Server
   *
   * Gets the server instance from the strategy
   *
   * @returns {object}
   */
  getServer () {
    return this.strategy.getServer();
  }

  /**
   * Output Handler
   *
   * Handles the output, dispatching to the strategy
   * so it displays the output correctly. This invokes
   * the given function as a Promise and then handles
   * what it returns. This is how the router should
   * start going to the application tier and beyond.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} fn
   * @param {boolean} logError
   * @returns {Promise.<*>}
   */
  outputHandler (req, res, fn, logError = true) {
    const task = resolve => resolve(fn());

    return new Promise(task)
      .then(data => Server.parseData(data))
      .then(({ end, output, statusCode }) => {
        if (this.middleware.preSend && !end) {
          return this.middleware.preSend(statusCode, output, req, res);
        }
        return {
          end,
          output,
          statusCode,
        };
      })
      .catch((err) => {
        const parsedError = Server.parseError(err);

        /* A thrown error is an uncaught error */
        if (logError) {
          this.emit('error_log', err);
        }

        return parsedError;
      })
      .then(({ end, output, statusCode }) => {
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

        if (!end) {
          /* Log the output */
          const requestTime = Date.now() - req.startTime;

          /* A View object should be parsed to make logs easier to read */
          let body = output;
          if (
            _.isObject(output) &&
            _.isFunction(output.getRenderData) &&
            _.isFunction(output.getRenderTemplate)
          ) {
            body = {
              data: output.getRenderData(),
              template: output.getRenderTemplate(),
            };
          }

          this.log('debug', 'Returning response to client', {
            body,
            id: req.id,
            requestTime,
            statusCode,
          });

          return this.strategy.outputHandler(statusCode, output, req, res);
        }

        return undefined;
      })
      .catch((err) => {
        /* Log the error */
        this.log('fatal', 'Uncaught exception', {
          err,
          id: req.id,
        });

        /* Check if there are any configured listeners */
        if (this.listeners('uncaughtException').length === 0) {
          /* Throw the error for the outputHandler to show */
          throw err;
        }

        /* Listeners - emit an uncaught exception */
        this.emit('uncaughtException', req, res, err);

        /* No throwing as uncaught exception handler will deal with the outputting */
      });
  }

  /**
   * Pre Send
   *
   * Similar to .use and .after, this is a hook that is
   * called immediately before the data is sent. This is
   * only run when there is a successful (2xx) response
   * and is designed for inspecting the data object so
   * HTTP caching can be configured.
   *
   * @param {function} fn
   * @returns {Server}
   */
  preSend (fn) {
    this.middleware.preSend = fn;

    return this;
  }

  /**
   * Route Factory
   *
   * Adds the route to the strategy and configures
   * the output ready for use by the output handler.
   * The tasks are run in order, not resolving any
   * future ones if a previous one has failed.
   *
   * @param {object} request
   * @param {object} response
   * @param {Array} tasks
   * @returns {Promise}
   */
  routeFactory (request, response, tasks) {
    /* Use the outputHandler method to output */
    return this.outputHandler(request, response, () => {
      /* Set a request ID and time */
      request.id = uuid();
      request.startTime = Date.now();

      /* Log the input */
      this.log('info', 'New HTTP call', {
        body: request.body,
        headers: request.headers,
        id: request.id,
        ip: request.clientIp,
        method: request.method,
        time: request.startTime,
        url: request.url,
      });

      return tasks
        .reduce((thenable, task) => thenable
          .then(() => new Promise((resolve, reject) => {
            /* Callback or promise? */
            const promise = task(request, response, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });

            /* Resolve the promise if no callback */
            if (task.length !== 3) {
              resolve(promise);
            }
          })), Promise.resolve());
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

  /**
   * Uncaught Exception
   *
   * Listens for uncaught exceptions. The listener
   * receives three parameters, request, response
   * and the error itself.
   *
   * @param {Function} fn
   * @returns {Server}
   */
  uncaughtException (fn) {
    if (_.isFunction(fn) === false) {
      throw new TypeError('Server.uncaughtException must receive a function');
    }

    /* Listen for uncaught exceptions in the application */
    this.on('uncaughtException', fn);

    /* Listen for uncaught exceptions in the strategy */
    this.strategy.uncaughtException(fn);

    return this;
  }

  /**
   * Use
   *
   * Allows you to apply anything to the call. Although
   * this will usually be a function or array of functions,
   * it doesn't have to be.
   *
   * @param {*[]} args
   * @returns {Server}
   */
  use (...args) {
    this.strategy.use(...args);

    return this;
  }

  /**
   * Allowable HTTP Methods
   *
   * The HTTP methods that can be called. There is
   * a special 'all' type which, if called, will
   * specify all of these methods.
   *
   * @type {string[]}
   */
  static get allowableHTTPMethods () {
    return [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'HEAD',
      'OPTIONS',
      'PATCH',
    ];
  }

  /**
   * Client IP
   *
   * The attribute name for the client IP
   *
   * @returns {string}
   */
  static get clientIp () {
    return 'clientIp';
  }

  /**
   * Parse Data
   *
   * Parses the data output
   *
   * @param {*} data
   * @returns {{end: boolean, statusCode: number, output: *}}
   */
  static parseData (data) {
    let end = false;
    let output;
    let statusCode = 200;

    /* Some data to display */
    if (data >= 100 && data < 600) {
      /* HTTP status code */
      statusCode = data;
    } else if (_.isObject(data) && _.isFunction(data.getData)) {
      /* Get the data from a function */
      output = data.getData();
    } else if (data === 'end') {
      end = true;
    } else {
      /* Just output the data */
      output = data;
    }

    return {
      end,
      statusCode,
      output,
    };
  }

  /**
   * Parse Error
   *
   * Parses the error output
   *
   * @param {Error} err
   * @returns {{statusCode: number, output: *}}
   */
  static parseError (err) {
    let output;
    let statusCode = 500;

    /* Work out the appropriate error message */
    if (err >= 100 && err < 600) {
      /* HTTP status code */
      statusCode = err;
    } else if (_.isFunction(err.hasErrors)) {
      /* A steeplejack validation error */
      statusCode = 400;
      output = {
        code: err.type,
        message: err.message,
      };

      if (err.hasErrors()) {
        output.error = err.getErrors();
      }
    } else if (_.isFunction(err.getHttpCode) && _.isFunction(err.getDetail)) {
      /* It's a Steeplejack error - output as normal */
      statusCode = err.getHttpCode();
      output = err.getDetail();
    } else {
      /* Could be anything - treat as uncaught exception */
      throw err;
    }

    /* If output is empty, add the default message */
    if (!output) {
      output = {
        statusCode,
        message: http.STATUS_CODES[statusCode] || 'Unknown error',
      };
    }

    return {
      statusCode,
      output,
    };
  }
}

module.exports = Server;
