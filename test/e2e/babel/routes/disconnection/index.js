/**
 * index
 */

/* Node modules */

/* Third-party modules */

/* Files */

export default () => ({
  connect (conn) {
    setTimeout(() => {
      conn.disconnect();
    }, 500);
  }
});

export const inject = {
  socket: {
    export: 'default'
  }
};
