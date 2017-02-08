/**
 * logger
 */

/* Node modules */

/* Third-party modules */

/* Files */

export default () => {
  const types = [
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace',
  ];

  return types.reduce((result, type) => {
    result[type] = (message, data, ...args) => {
      // eslint-disable-next-line no-console
      console.log(`[${new Date().toISOString()}] ${type.toUpperCase()}:`, data, message, ...args);
    };

    return result;
  }, {});
};

export const inject = {
  name: '$logger',
};
