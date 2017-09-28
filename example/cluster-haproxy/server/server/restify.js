/**
 * restify
 */

/* Node modules */

/* Third-party modules */

/* Files */

exports.default = ({ Restify }) => new Restify();

exports.inject = {
  name: 'restify',
  deps: [
    'steeplejack-restify',
  ],
};
