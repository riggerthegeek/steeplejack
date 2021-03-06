/**
 * Router
 *
 * This manages the loading and using of
 * routes and sockets
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import { _ } from 'lodash';
import { Base } from '@steeplejack/core';
import { sync as glob } from 'glob';

/* Files */

/**
 *
 * Clean Slashes
 *
 * Gets rid of excess slashes from a string
 *
 * @param {string} str
 * @return {string}
 */
function cleanSlashes (str) {
  /* Remove forward slashes */
  str = str.replace(/\\/g, '/');

  /* Remove excess slashes */
  str = str.replace(/\/+/g, '/');

  return str;
}

/**
 *
 * Set Route Name
 *
 * Sets the route name
 *
 * @param {string} parent
 * @param {string} route
 * @return {string}
 */
function setRouteName (parent, route) {
  const str = [
    parent,
    route,
  ].join('/');

  return cleanSlashes(str);
}

class Router extends Base {
  constructor (routes, middleware) {
    super();

    this.routes = {};

    this.addRoute(routes)
      .addMiddleware(middleware);
  }

  /**
   * Add Middleware
   *
   * Adds any middleware to the existing
   *
   * @param {object} middlewares
   * @returns {Router}
   */
  addMiddleware (middlewares) {
    _.each(middlewares, (middleware, key) => {
      const routeName = setRouteName('', key);

      if (_.isArray(middleware) && middleware.length > 0) {
        _.each(this.routes[routeName], (fn, method) => {
          /* Ensure everything is an array of functions */
          if (_.isArray(fn) === false) {
            fn = [fn];
          }

          /* Now, apply each of the middleware functions before the functions */
          this.routes[routeName][method] = middleware.concat(fn);
        });
      }
    });

    return this;
  }

  /**
   *
   * Add Route
   *
   * Adds in a new route(s) to the object
   *
   * @param {object} routes
   * @param {string} parent
   * @return {Router}
   */
  addRoute (routes, parent = undefined) {
    _.each(routes, (value, key) => {
      if (_.isPlainObject(value)) {
        /* It's an object - we're not yet at the lowest level */
        this.addRoute(value, setRouteName(parent, key));
      } else {
        /* Remove final slash */
        if (parent !== undefined && parent !== '/') {
          parent = parent.replace(/(\/+)$/, '');
        }

        /* Save to the instance */
        if (_.has(this.routes, parent) === false) {
          this.routes[parent] = {};
        }

        if (_.has(this.routes, [parent, key])) {
          /* Can't overwrite a route */
          const err = new SyntaxError('CANNOT_OVERWRITE_A_ROUTE');
          err.route = parent;
          err.key = key;
          throw err;
        }

        this.routes[parent][key] = value;
      }
    });

    return this;
  }

  /**
   * Discover Routes
   *
   * This is discovers the route files in the
   * given route directory and then loads them
   * up.  It then returns an object of route
   * functions that can be used.
   *
   * @param {{ name: {string}, path: {string} }[]} files
   * @return {*}
   */
  static discoverRoutes (files) {
    const splitNames = new RegExp(`^(([\\w\\.\\-\\:]+${path.sep})+)?(\\w+)`);

    return files.reduce((result, file) => {
      const segments = file.name.match(splitNames);

      if (segments !== null) {
        let tmp = segments[3];

        if (tmp === 'index') {
          tmp = segments[1];
          if (_.isUndefined(tmp)) {
            tmp = '';
          } else {
            /* Remove any trailing slash */
            tmp = tmp.replace(new RegExp(`${path.sep}$`), '');
          }
        } else if (segments[1]) {
          tmp = segments[1] + tmp;
        }

        const filePath = path.join(file.path, file.name);

        /* Load the route file */
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const objRoute = require(filePath);

        if (!objRoute.inject) {
          throw new SyntaxError(`No inject exported from file: ${filePath}`);
        }

        /* Parse the routes and sockets */
        const route = Router.parseModule('route', objRoute);
        const socket = Router.parseModule('socket', objRoute);

        if (!route && !socket) {
          throw new SyntaxError(`No route or socket exported from file: ${filePath}`);
        }

        /* Put in stack */
        result[tmp] = {
          route,
          socket,
        };
      }

      return result;
    }, {});
  }

  /**
   * Get File List
   *
   * Finds all the files in the route directory
   * that matches the glob.
   *
   * @param {string} routeDir
   * @param {string} routeGlob
   * @return {{ name: {string}, path: {string} }[]}
   */
  static getFileList (routeDir, routeGlob) {
    /* Build the routes up */
    const routes = path.join(routeDir, routeGlob);

    /* Get the route files */
    return glob(routes, {
      /* Don't waste effort sorting here */
      nosort: true,
    }).map(file => ({
      name: file.replace(routeDir + path.sep, ''),
      path: routeDir,
    })).sort((a, b) => {
      /* Put an index file at the end */
      if (a.name.match(/index\./)) {
        return 1;
      }
      /* Sort by filename */
      return a.name > b.name ? 1 : -1;
    });
  }

  /**
   * Parse Module
   *
   * Parses the route/socket so that it returns
   * a factory function and dependencies. If there
   * is no factory function registered, it returns
   * null.
   *
   * @param {string} type
   * @param {object} route
   * @return {{factory: Function, deps: Array}|null}
   */
  static parseModule (type, route) {
    const container = route.inject[type];

    let factory = null;
    let deps = [];

    if (_.has(container, 'export')) {
      const exportable = container.export;

      if (_.isFunction(exportable)) {
        factory = exportable;
      } else if (_.has(route, exportable) && _.isFunction(route[exportable])) {
        factory = route[exportable];
      }
    }

    if (_.has(container, 'deps')) {
      deps = container.deps;
    }

    if (factory === null) {
      return null;
    }

    return {
      deps,
      factory,
      middleware: container.middleware || [],
    };
  }
}

module.exports = Router;
