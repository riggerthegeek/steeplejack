/**
 * restify
 */

/* Node modules */

/* Third-party modules */
const Bluebird = require('bluebird');
const restify = require('restify');

/* Files */

exports.default = () => {
  class Restify {

    constructor () {
      this._inst = Bluebird.promisifyAll(restify.createServer());
    }

    addRoute (httpMethod, route, iterator) {

      const method = httpMethod.toLowerCase();

      this._inst[method](route, (req, res) => {
        iterator(req, res);
      });

    }

    bodyParser () {
      this.use(restify.bodyParser());
    }

    close () {
      this._inst.close();
    }

    getServer () {
      return this._inst;
    }

    getRawServer () {
      return this._inst.server;
    }

    gzipResponse () {
      this.use(restify.gzipResponse());
    }

    outputHandler (statusCode, data, req, res) {

      /* Push the output */
      res.send(statusCode, data);

    }

    queryParser (mapParams) {
      this.use(restify.queryParser({
        mapParams: mapParams
      }));
    }

    start (port, hostname, backlog) {

      return this._inst.listenAsync(port, hostname, backlog);

    }

    uncaughtException (fn) {
      this._inst.on("uncaughtException", fn);
    }

    use (fn) {
      this._inst.use(fn);
    }

  }

  return Restify;
};

exports.inject = {
  name: 'Restify'
//   export: 'default',
//   type: 'factory',
//   deps: [
//
//   ]
};
