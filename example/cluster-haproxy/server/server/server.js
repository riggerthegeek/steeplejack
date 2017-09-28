/**
 * server
 */

/* Node modules */

/* Third-party modules */

/* Files */

exports.default = (Server, config, restify) => new Server(config.server, restify);

exports.inject = {
  name: 'server',
  deps: [
    'steeplejack-server',
    '$config',
    'restify',
  ],
};
