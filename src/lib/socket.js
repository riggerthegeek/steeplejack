/**
 * Socket
 *
 * Socket strategy. This adds socket capability
 * to a server.
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';
import { Base } from '@steeplejack/core';

/* Files */
import SocketRequest from './socketRequest';

export const CONNECT_FLAG = 'connect';

export const MIDDLEWARE_FLAG = '__middleware';

export default class Socket extends Base {

  constructor (strategy) {
    super();

    this.strategy = strategy;

    if (_.isObject(this.strategy) === false) {
      throw new SyntaxError('Socket strategy object is required');
    }
  }

  /**
   * Logger
   *
   * Gets the logger instance
   *
   * @returns {*}
   */
  get logger () {
    return this.definedLogger;
  }

  /**
   * Logger
   *
   * Sets the logger instance.
   *
   * @param {*} logger
   */
  set logger (logger) {
    this.definedLogger = logger;
    this.strategy.logger = logger;
  }

  /**
   * Listen
   *
   * Makes the socket server listen for socket
   * connections
   *
   * @param {*} request
   * @param {string} event
   * @param {function} socketFn
   */
  listen (request, event, socketFn) {
    this.strategy.listen(request.socket, event, (...params) => {
      /* Set the parameters received */
      request.params = params;

      return new Promise((resolve) => {
        /* Invoke the function */
        const result = socketFn(request);

        /* Resolve the result */
        resolve(result);
      });
    });
  }

  /**
   * Namespace
   *
   * Adds a new namespace to the socket
   * server. This is synonymous with an
   * HTTP route.
   *
   * @param {string} namespace
   * @param {*} events
   * @returns {Socket}
   */
  namespace (namespace, events) {
    /* Get connection listener */
    const onConnect = events[CONNECT_FLAG];

    /* Search for any middleware functions */
    let middleware = [];
    if (_.has(events, MIDDLEWARE_FLAG)) {
      middleware = events[MIDDLEWARE_FLAG];
    }

    /* Omit the connect and middleware functions now */
    events = _.omit(events, [
      CONNECT_FLAG,
      MIDDLEWARE_FLAG,
    ]);

    this.strategy.connect(namespace, middleware)
      .on(`${namespace}_connected`, (connection) => {
        const request = new SocketRequest(connection, this.strategy);

        /* Listen for a broadcast event */
        request.on('broadcast', (broadcast) => {
          this.strategy.broadcast(request, broadcast);
        });

        /* Fire the connection event */
        if (_.isFunction(onConnect)) {
          onConnect(request);
        }

        _.each(events, (fn, event) => {
          /* Listen for the event */
          this.listen(request, event, fn);

          /* Emit the socket for logging */
          this.emit('socketAdded', namespace, event);
        });
      });

    return this;
  }

}
