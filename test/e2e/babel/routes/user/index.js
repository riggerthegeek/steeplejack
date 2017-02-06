/**
 * index
 */

/* Node modules */

/* Third-party modules */

/* Files */

export default userController => ({
  '/': {
    get: () => userController.getUser('1'),

    post: ({ body }) => userController.createUser(body),
  },
});

export const socketRoute = () => ({
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

export const inject = {
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
