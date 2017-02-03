/**
 * logger
 */

/* Node modules */

/* Third-party modules */

/* Files */

export default () => ({
  info: (...args) => {
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] INFO:`, ...args);
  },
});

export const inject = {
  name: '$logger',
};
