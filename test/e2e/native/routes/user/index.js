/**
 * index
 */

/* Node modules */

/* Third-party modules */

/* Files */

exports.default = userController => ({
  '/': {
    get (req) {
      /* Simulate a valid bearer token */
      if (req.headers.authorization !== 'bearer valid') {
        return 401;
      }

      return userController.getUser('1');
    },

    post (req) {
      /* Simulate a valid bearer token */
      if (req.headers.authorization !== 'bearer valid') {
        return 401;
      }

      return userController.createUser(req.body);
    },
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

exports.inject = {
  route: {
    export: 'default',
    deps: [
      '$userController',
    ],
  },
  socket: {
    export: 'socketRoute',
  },
};
