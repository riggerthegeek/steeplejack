/**
 * restify
 *
 * This is a cut-down Restify strategy pattern for the
 * Server class.  If using Restify in production, use
 * the steeplejack-restify package instead.
 */


"use strict";


/* Node modules */
import http from "http";


/* Third-party modules */
import {_} from "lodash";
import Bluebird from "bluebird";
import restify from "restify";


/* Files */
import {Base} from "../../../../../lib/base";
import {ValidationException} from "../../../../../exception/validation/index";


export class Restify {


    constructor () {
        this._inst = Bluebird.promisifyAll(restify.createServer());
    }


    addRoute (httpMethod, route, iterator) {

        let method = httpMethod.toLowerCase();

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
