/**
 * index
 */

/* Node modules */

/* Third-party modules */

/* Files */

exports.default = userController => ({
  '/': {
    get: () => userController.getUser('1'),

    post: ({ body }) => userController.createUser(body),
  },
});

exports.socketRoute = () => ({
  send: (socket) => {
    socket.broadcast({
      event: 'receive',
      data: socket.params,
    });
  },
});

const middleware = [
  ({ headers }, res, cb) => {
    /* Simulate a valid bearer token */
    if (headers.authorization !== 'bearer valid') {
      cb(401);
    } else {
      cb();
    }
  },
];

exports.inject = {
  route: {
    deps: [
      '$userController',
    ],
    export: 'default',
    middleware,
  },
  socket: {
    export: 'socketRoute',
  },
};
