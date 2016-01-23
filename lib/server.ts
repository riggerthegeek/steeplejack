/**
 * server
 *
 * The context of a strategy pattern. It receives
 * the strategy object and dispatches to that for
 * the individual calls.
 */

/// <reference path="../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {Base} from "./base";


export class Server extends Base {


    /**
     * Methods
     *
     * The HTTP methods that can be called. There is
     * a special "all" type which, if called, will
     * specify all of these methods.
     *
     * @type {string[]}
     * @private
     */
    protected _methods = [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "HEAD",
        "OPTIONS",
        "PATCH"
    ];


    /**
     * Options received by the constructor
     *
     * @type {object}
     * @private
     */
    protected _options: {
        port?: number;
        hostname?: string;
        backlog?: number;
    } = {};


    /**
     * The strategy instance
     *
     * @type: {IServerStrategy}
     * @private
     */
    protected _strategy: IServerStrategy;


    /**
     * Constructor
     *
     * Assigns options and the strategy object
     *
     * @param {IServerOptions} options
     * @param {IServerStrategy} strategy
     */
    public constructor (options: IServerOptions, strategy: IServerStrategy) {

        super();

        if (_.isObject(strategy) === false) {
            throw new SyntaxError("Server strategy object is required");
        }

        /* Assign options and strategy */
        this._options = options;
        this._strategy = strategy;

    }


    /**
     * Accept Parser
     *
     * Makes the server use the accept parse.  If
     * options are not an array, uses the default
     * restify options.  Returns this to make the
     * method chainable.
     *
     * If it's in strict mode then it must match
     * the accept header exactly.
     *
     * @param {*} options
     * @param {boolean} strict
     * @returns {Server}
     */
    public acceptParser (options: any, strict: boolean = false) {
        this._strategy.acceptParser(options, strict);
        return this;
    }


    /**
     * Add Route
     *
     * Adds a single route to the stack
     *
     * @param {string} httpMethod
     * @param {string} route
     * @param {Function|Function[]} fn
     * @returns {Server}
     */
    public addRoute (httpMethod: string, route: string, fn: Function | Function[]) : Server {

        if (_.isString(httpMethod) === false) {
            throw new TypeError("httpMethod must be a string");
        }

        if (_.isString(route) === false) {
            throw new TypeError("route must be a string");
        }

        if (_.isFunction(fn) === false && _.isArray(fn) === false) {
            throw new TypeError("fn must be a function or array");
        }

        httpMethod = httpMethod.toUpperCase();

        if (httpMethod === "ALL") {
            _.each(this._methods, method => {
                this.addRoute(method, route, fn);
            });
            return this;
        }

        switch (httpMethod) {

            case "DEL":
                httpMethod = "DELETE";
                break;

            case "OPTS":
                httpMethod = "OPTIONS";
                break;

            default:
                if (this._methods.indexOf(httpMethod) === -1) {
                    /* An invalid method */
                    throw new SyntaxError(`HTTP method is unknown: ${httpMethod}`);
                }
                break;

        }

        /* Emit the route for logging */
        this.emit("routeAdded", httpMethod, route);

        /* Send to the strategy */
        this._strategy.addRoute(httpMethod, route, fn);

        return this;

    }


    /**
     * Add Routes
     *
     * Takes the route object and adds to the
     * server instance
     *
     * @param {object} routes
     * @returns {Server}
     */
    public addRoutes (routes: IAddRoutes) : Server {

        if (_.isPlainObject(routes)) {

            /* Cycle through and add in the routes */
            _.each(routes, (methods: any, route: string) => {

                if (_.isPlainObject(methods)) {

                    /* Add the HTTP verbs and endpoints */
                    _.each(methods, (fn:Function | Function[], method:string) => {

                        this.addRoute(method, route, fn);

                    });

                }

            });

        }

        return this;

    }


    /**
     * Start
     *
     * Starts up the server, returning a promise
     *
     * @returns {Promise}
     */
    public start () : Promise<string> {

        return this._strategy.start(this._options.port, this._options.hostname, this._options.backlog);

    }


}
