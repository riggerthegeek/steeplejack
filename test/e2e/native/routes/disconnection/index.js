/**
 * index
 */

/* Node modules */

/* Third-party modules */

/* Files */

exports.default = () => ({
  connect (conn) {
    setTimeout(() => {
      conn.disconnect();
    }, 500);
  }
});

exports.socket = {
  export: 'default'
};
