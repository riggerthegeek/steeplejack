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


    addRoute (httpMethod: string, route: string, iterator: (req: any, res: any) => any) {

        this._inst.get(route, (req: any, res: any) => {
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
