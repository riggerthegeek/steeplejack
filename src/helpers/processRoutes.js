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
        } = value[type];

        result[type][name] = injector.process(factory, deps);
      }
    });

    return result;
  }, {
    route: {},
    socket: {},
  });

  /* Put into a Router object and return */
  return {
    routes: new Router(data.route),
    sockets: new Router(data.socket),
  };
};
