/**
 * restify
 *
 * This is a cut-down Restify strategy pattern for the
 * Server class.  If using Restify in production, use
 * the steeplejack-restify package instead.
 */

"use strict";


/* Node modules */
var http = require("http");


/* Third-party modules */
var _ = require("lodash");
var Bluebird = require("bluebird");
var restify = require("restify");


/* Files */
var Base = require("../../../../../lib/base").Base;
var ValidationException = require("../../../../../exception/validation/index").ValidationException;


exports.Restify = Base.extend({

    __construct: function () {
        this._inst = Bluebird.promisifyAll(restify.createServer());
    },


    addRoute: function (httpMethod, route, fn) {

        this._inst[httpMethod.toLowerCase()](route, fn);

    },


    bodyParser: function () {
        this.use(restify.bodyParser());
    },


    close: function () {
        this._inst.close();
    },


    getServer: function () {
        return this._inst;
    },


    gzipResponse: function () {
        this.use(restify.gzipResponse());
    },


    outputHandler: function (err, data, req, res) {

        var statusCode = 200;
        var output;

        if (err) {

            /* Convert to a Restify error and process */
            if (err instanceof restify.RestError) {

                /* Already a RestError - use it */
                statusCode = err.statusCode;
                output = err;

            } else if (err instanceof ValidationException) {

                /* A steeplejack validation error */
                statusCode = 400;
                output = {
                    code: err.type,
                    message: err.message
                };

                if (err.hasErrors()) {
                    output.error = err.getErrors();
                }

            } else {

                /* Convert to a restify-friendly error */
                statusCode = _.isFunction(err.getHttpCode) ? err.getHttpCode() : 500;
                output = _.isFunction(err.getDetail) ? err.getDetail() : err.message;

            }

        } else if (data) {

            /* Success */
            if (_.isFunction(data.getData)) {
                output = data.getData();
            } else {
                output = data;
            }

        } else {
            /* No content */
            statusCode = 204;
        }

        /* Push the output */
        res.send(statusCode, output);

    },


    queryParser: function (mapParams) {
        this.use(restify.queryParser({
            mapParams: mapParams
        }));
    },


    start: function (port, hostname, backlog) {

        return this._inst.listenAsync(port, hostname, backlog);

    },


    uncaughtException: function (fn) {
        this._inst.on("uncaughtException", fn);
    },


    use: function (fn) {
        this._inst.use(fn);
    }


});
