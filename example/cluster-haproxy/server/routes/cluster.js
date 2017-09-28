/**
 * cluster
 */

/* Node modules */

/* Third-party modules */

/* Files */

exports.default = () => ({

  '/': {

    get () {
      return {
        process: process.pid,
        serverName: process.env.NAME,
      };
    },

  },

});

exports.inject = {
  route: {
    export: 'default',
  },
};
