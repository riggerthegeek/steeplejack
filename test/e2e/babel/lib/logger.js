/**
 * logger
 */

/* Node modules */

/* Third-party modules */

/* Files */

export default () => ({
  info: (...args) => {
    console.log(`[${new Date().toISOString()}] INFO:`, ...args);
  }
});

export const inject = {
  name: '$logger'
};
