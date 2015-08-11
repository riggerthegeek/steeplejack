/**
 * Server
 *
 * A wrapper to create an instance of a Server. This
 * should be extended for individual implementations.
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");


/* Files */
var Base = require("./Base");
var datatypes = Base.datatypes;



module.exports = Base.extend({

    _construct: function (options) {

        options = datatypes.setObject(options, {});

        this.setBacklog(options.backlog);
        this.setIP(options.ip);
        this.setPort(options.port);

        if (this._port === null) {
            throw new SyntaxError("Server port must be set as an integer");
        }

        /* Create instance of the server */
        this._server = this._createServer({
            certificate: options.certificate,
            formatters: options.formatters,
            handleUpgrades: options.handleUpgrades,
            key: options.key,
            logger: options.logger,
            name: options.name,
            spdy: options.spdy,
            version: options.version
        });

        if (!this._server) {
            throw new SyntaxError("Server._createServer must return the server instance");
        }

    },


    /**
     * Accept Parser
     *
     * Makes the server use the accept parse.  If
     * options are not an array, uses the default
     * restify options.  Returns this to make the
     * method chainable.
     *
     * @param {*} options
     * @returns {exports}
     */
    acceptParser: function (options) {
        this._acceptParser(options);
        return this;
    },


    /**
     * Accept Parser Strict
     *
     * This is identical to the acceptParser method, except
     * that the accept header must have the accept header
     * exactly.  There is no coercion around the mime type.
     *
     * @param {*} options
     * @returns {exports}
     * @private
     */
    acceptParserStrict: function (options) {
        this._acceptParserStrict(options);
        return this;
    },


    /**
     * Add Route
     *
     * Adds a route to the stack
     *
     * @param {string} httpMethod
     * @param {string} route
     * @param {string/array} fn
     */
    addRoute: function (httpMethod, route, fn) {

        httpMethod = datatypes.setString(httpMethod, null);
        route = datatypes.setString(route, null);

        if (httpMethod === null) {
            throw new TypeError("httpMethod must be a string");
        }

        if (route === null) {
            throw new TypeError("route must be a string");
        }

        if (typeof fn !== "function" && fn instanceof Array === false) {
            throw new TypeError("fn must be a function or array");
        }

        httpMethod = httpMethod.toLowerCase();

        if (httpMethod === "all") {

            _.each([
                "get",
                "post",
                "put",
                "del",
                "head",
                "patch"
            ], function (method) {
                this.addRoute(method, route, fn);
            }, this);

        } else {

            var err;

            switch (httpMethod) {

                case "delete": {
                    /* Convert to del */
                    httpMethod = "del";
                    break;
                }

                case "get":
                case "post":
                case "put":
                case "del":
                case "head":
                case "patch": {
                    /* Nothing to do - just pass through */
                    break;
                }

                default: {
                    /* Unknown HTTP method type */
                    err = new TypeError("httpMethod is unknown: " + httpMethod);
                    break;
                }

            }

            if (err) {
                /* Throw error */
                throw err;
            }

            this._addRoute(httpMethod, route, fn);

        }

    },


    /**
     * Add Routes
     *
     * Takes the route object and adds to the server
     * instance
     *
     * @param {object} routes
     * @private
     */
    addRoutes: function (routes) {

        routes = datatypes.setObject(routes, {});

        /* Add the URLs */
        _.each(routes, function (methods, route) {

            methods = datatypes.setObject(methods, {});

            /* Add the HTTP verbs and endpoints */
            _.each(methods, function (func, method) {

                this.addRoute(method, route, func);

            }, this);

        }, this);

    },


    /**
     * After
     *
     * Set up a listener for the after event
     *
     * @param fn
     * @returns {exports}
     */
    after: function (fn) {
        if (_.isFunction(fn) === false) {
            throw new SyntaxError("Server.after must receive a function");
        }

        this._after(fn);
        return this;
    },


    /**
     * Body Parser
     *
     * Allows the server to receive the HTTP body. Returns
     * this to make it chainable.
     *
     * @returns {exports}
     */
    bodyParser: function () {
        this._bodyParser();
        return this;
    },


    /**
     * Close
     *
     * Closes the server
     *
     * @returns {exports}
     */
    close: function () {
        this._close();
        return this;
    },


    /**
     * Enable CORS
     *
     * Enables cross-origin resource sharing.  This should
     * be done with care as can lead to a major security
     * vulnerability.
     *
     * @link http://en.wikipedia.org/wiki/Cross-origin_resource_sharing
     * @param {string[]} origins
     * @param {string[]} addHeaders
     * @returns {exports}
     */
    enableCORS: function (origins, addHeaders) {
        origins = datatypes.setArray(origins, ["*"]);

        /* Check the headers are an array of strings */
        addHeaders = datatypes.setArray(addHeaders, []);

        this._enableCORS(origins, addHeaders);
        return this;
    },


    /**
     * Get Backlog
     *
     * Gets the HTTP listen backlog
     *
     * @returns {*}
     */
    getBacklog: function () {
        return this._backlog;
    },


    /**
     * Get IP
     *
     * Gets the IP address
     *
     * @returns {*}
     */
    getIP: function () {
        return this._ip;
    },


    /**
     * Get Port
     *
     * Gets the desired port number
     *
     * @returns {number}
     */
    getPort: function () {
        return this._port;
    },


    /**
     * Get Server
     *
     * Returns the server instance
     *
     * @returns {*}
     */
    getServer: function () {
        return this._server;
    },


    /**
     * GZIP Response
     *
     * Makes the response GZIP compressed.  Returns
     * this to make it chainable.
     *
     * @returns {exports}
     */
    gzipResponse: function () {
        this._gzipResponse();
        return this;
    },


    /**
     * Output Handler
     *
     * This handles the output.  This can be activated
     * directly or bundled up into a closure and passed
     * around.  Receives an optional callback function
     * at the end.
     *
     * @param err
     * @param data
     * @param req
     * @param res
     * @param cb
     */
    outputHandler: function (err, data, req, res, cb) {
        this._outputHandler(err, data, req, res);

        /* Allow a callback to be invoked */
        if (_.isFunction(cb)) {
            cb();
        }
    },


    /**
     * Pre
     *
     * Set up middleware to be ran at the start
     * of the stack.
     *
     * @param fn
     * @returns {exports}
     */
    pre: function (fn) {
        if (_.isFunction(fn) === false) {
            throw new TypeError("Server.pre must receive a function");
        }
        this._pre(fn);
        return this;
    },


    /**
     * Start
     *
     * Starts up the server
     *
     * @params {function} cb
     * @returns {exports}
     */
    start: function (cb) {
        this._start(this.getPort(), this.getIP(), this.getBacklog(), cb);
        return this;
    },


    /**
     * Query Parser
     *
     * Parses the query strings.  The mapParams option
     * allows you to decide if you want to map req.query
     * to req.params - false by default.  Returns this
     * to make it chainable.
     *
     * @param {boolean} mapParams
     * @returns {exports}
     */
    queryParser: function (mapParams) {
        mapParams = datatypes.setBool(mapParams, false);

        this._queryParser(mapParams);
        return this;
    },


    /**
     * Set Backlog
     *
     * Sets a backlog for the HTTP listen method
     *
     * @param backlog
     */
    setBacklog: function (backlog) {
        this._backlog = datatypes.setInt(backlog, null);
    },


    /**
     * Set IP
     *
     * Sets an IP for the HTTP listen method
     *
     * @param backlog
     */
    setIP: function (ip) {
        this._ip = datatypes.setString(ip, null);
    },


    /**
     * Set Port
     *
     * Sets a port for the HTTP listen method
     *
     * @param backlog
     */
    setPort: function (port) {
        this._port = datatypes.setInt(port, null);
    },


    /**
     * Uncaught Exception
     *
     * Listen to uncaught exceptions
     *
     * @param {function} fn
     * @returns {exports}
     */
    uncaughtException: function (fn) {
        if (_.isFunction(fn) === false) {
            throw new TypeError("Server.uncaughtException must receive a function");
        }

        this._uncaughtException(fn);
        return this;
    },


    /**
     * Use
     *
     * Exposes the use method on the server. Can accept
     * a function or an array of functions.  Sends as
     * individual functions.
     *
     * @param input
     * @returns {exports}
     * @private
     */
    use: function (input) {
        if (input instanceof Array === false) {
            input = [input];
        }

        _.each(input, function (fn) {

            if (_.isFunction(fn) === false) {
                throw new TypeError("Server.use can only accept functions");
            }

            this._use(fn);

        }, this);

        return this;
    }

});
