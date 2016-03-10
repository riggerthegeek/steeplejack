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


    addRoute (httpMethod, route, fn) {

        this._inst[httpMethod.toLowerCase()](route, (request, response) => {

            let tasks = _.map(fn, (task) => {

                return Bluebird.try(() => {

                    return task({
                        request,
                        response
                    });

                });

            });

            Bluebird.all(tasks)
                .then(result => {
                    this.outputHandler(null, _.last(result), request, response);
                })
                .catch(err => {
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


    outputHandler (err, data, req, res) {

        var statusCode = 200;
        var output;

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
