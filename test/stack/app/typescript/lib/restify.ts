import {error} from "util";
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

            let tasks: any[] = _.map(fn, (task: Function) => {

                return Bluebird.try(() => {

                    return task(request, response);

                });

            });

            Bluebird.all(tasks)
                .then((result: any[]) => {
                    this.outputHandler(null, _.last(result), request, response);
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


    outputHandler (statusCode: Number, data: any, req: any, res: any) {

        /* Push the output */
        res.send(statusCode, data);

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
