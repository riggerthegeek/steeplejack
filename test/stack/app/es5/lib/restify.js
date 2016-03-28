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


exports.Restify = Base.extend({

    __construct: function () {
        this._inst = Bluebird.promisifyAll(restify.createServer());
    },


    addRoute: function (httpMethod, route, iterator) {

        var method = httpMethod.toLowerCase();

        this._inst[method](route, function (req, res) {
            iterator(req, res);
        });

    },


    bodyParser: function () {
        this.use(restify.bodyParser());
    },


    close: function () {
        this._inst.close();
    },


    getRawServer: function () {
        return this._inst.server;
    },


    getServer: function () {
        return this._inst;
    },


    gzipResponse: function () {
        this.use(restify.gzipResponse());
    },


    outputHandler: function (statusCode, data, req, res) {

        /* Push the output */
        res.send(statusCode, data);

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
