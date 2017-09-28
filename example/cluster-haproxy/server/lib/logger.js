/**
 * logger
 */

/* Node modules */

/* Third-party modules */

/* Files */

exports.default = (Logger) => {
  const types = Logger.getLogLevels();

  const strategy = types.reduce((result, type) => {
    result[type] = (message, data, ...args) => {
      // eslint-disable-next-line no-console
      console.log(`[${new Date().toISOString()}] ${type.toUpperCase()}:`, data, message, ...args);
    };

    return result;
  }, {});

  return new Logger(strategy);
};

exports.inject = {
  name: '$logger',
  deps: [
    'steeplejack-logger',
  ],
};
