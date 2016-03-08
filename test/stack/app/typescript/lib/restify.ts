/**
 * restify
 */

/// <reference path="../../../../../typings/main/ambient/lodash/lodash.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
let Bluebird = require("bluebird");
let restify = require("restify");


/* Files */
import {Base} from "../../../../../lib/base";
import {IServerStrategy} from "../../../../../interfaces/serverStrategy";
import {ValidationException} from "../../../../../exception/validation/index";


export class Restify extends Base implements IServerStrategy {


    _inst: any;


    constructor () {
        super();
        this._inst = Bluebird.promisifyAll(restify.createServer());
    }

    acceptParser: (options: any, strict: boolean) => void;
    after: (fn: Function) => void;
    before: (fn: Function) => void;
    enableCORS: (origins: string[], addHeaders: string[]) => void;


    addRoute (httpMethod: string, route: string, fn: Function[]) {

        this._inst[httpMethod.toLowerCase()](route, (request: any, response: any) => {

            let tasks = _.map(fn, (task: Function) => {

                return Bluebird.try(() => {
                    return task({
                        request,
                        response
                    });
                });

            });

            Bluebird.reduce(tasks, () => {})
                .then((result: any) => {
                    this.outputHandler(null, result, request, response);
                })
                .catch((err: any) => {
                    this.outputHandler(err, null, request, response);
                });

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


    gzipResponse () {
        this.use(restify.gzipResponse());
    }


    outputHandler (err: any, data: any, req: any, res: any) {

        var statusCode = 200;
        var output: any;

        if (err) {

            /* Convert to a Restify error and process */
            if (err > 100 && err < 600) {
                statusCode = err;
            } else if (err instanceof restify.RestError) {

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
            if (data > 100 && data < 600) {
                statusCode = data;
            } else if (_.isFunction(data.getData)) {
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

    }


    queryParser (mapParams: boolean) {
        this.use(restify.queryParser({
            mapParams: mapParams
        }));
    }


    start (port: number, hostname: string, backlog: number) {

        return this._inst.listenAsync(port, hostname, backlog);

    }


    uncaughtException (fn: Function) {
        this._inst.on("uncaughtException", fn);
    }


    use (fn: Function | Function[]) {
        this._inst.use(fn);
    }


}
