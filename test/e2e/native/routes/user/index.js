/**
 * index
 */

/* Node modules */

/* Third-party modules */

/* Files */

exports.default = userController => ({
  '/': {
    error: {
      get () {
        throw new Error('some error');
      },
    },

    get: () => userController.getUser('1'),

    post: req => userController.createUser(req.body),
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
  (req, res, cb) => {
    /* Simulate a valid bearer token */
    if (req.headers.authorization !== 'bearer valid') {
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
