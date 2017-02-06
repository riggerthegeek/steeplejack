/**
 * processRoutes
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';

/* Files */
import Router from '../lib/router';

export default (injector, routes) => {
  const types = [
    'route',
    'socket',
  ];

  const data = _.reduce(routes, (result, value, name) => {
    _.each(types, (type) => {
      if (value[type]) {
        const {
          deps,
          factory,
          middleware,
        } = value[type];

        /* Set the route */
        result.routes[type][name] = injector.process(factory, deps);

        /* Set the middleware */
        result.middleware[type][name] = middleware;
      }
    });

    return result;
  }, {
    middleware: {
      route: {},
      socket: {},
    },
    routes: {
      route: {},
      socket: {},
    },
  });

  /* Put into a Router object and return */
  return {
    routes: new Router(data.routes.route, data.middleware.route),
    sockets: new Router(data.routes.socket, data.middleware.socket),
  };
};
