/**
 * index
 */

/* Node modules */

/* Third-party modules */

/* Files */

exports.default = userController => ({
  '/': {
    get (req) {
      return {
        hello: 'world'
      };
      /* Simulate a valid bearer token */
      if (req.headers.authorization !== 'bearer valid') {
        return 401;
      }

      return userController.getUser('1');
    }
  }
});

exports.route = {
  export: 'default',
  deps: [
    // '$userController',
  ],
};

// exports.socket = {
//   export: 'socket',
//   deps: [],
// };
