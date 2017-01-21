/**
 * index
 */

/* Node modules */

/* Third-party modules */

/* Files */

export default userController => ({
  '/': {
    get (req) {
      /* Simulate a valid bearer token */
      if (req.headers.authorization !== 'bearer valid') {
        return 401;
      }

      return userController.getUser('1');
    }
  }
});

export const route = {
  export: 'default',
  deps: [
    // '$userController',
  ],
};

// export const socket = {
//   export: 'socket',
//   deps: [],
// };
