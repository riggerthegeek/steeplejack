/**
 * logger
 */

/* Node modules */

/* Third-party modules */
import Logger from '../../../../src/lib/logger';

/* Files */

export default () => {
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

export const inject = {
  name: '$logger',
};
