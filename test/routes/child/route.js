/**
 * route
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export const inject = {
  route: {
    export: () => 'route.js',
    deps: [
      'dep1'
    ]
  },
  socket: {
    export: () => 'socket.js',
    deps: [
      'dep1',
      'dep2'
    ]
  }
};
