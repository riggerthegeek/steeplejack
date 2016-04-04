/**
 * Server
 *
 * The context of a strategy pattern. It receives
 * the strategy object and dispatches to that for
 * the individual calls.
 *
 * It creates and manages the HTTP connection. If
 * configured to do so, it will also create an
 * instance of a socket connection as a child of the
 * HTTP server.
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import {Promise} from "es6-promise";


/* Files */
import {Base} from "./base";
import {IAddRoutes} from "../interfaces/addRoutes";
import {IAddSocket} from "../interfaces/addSocket";
import {IServerOptions} from "../interfaces/serverOptions";
import {IServerStrategy} from "../interfaces/serverStrategy";
import {ISocketStrategy} from "../interfaces/socketStrategy";
import {Socket} from "./socket";


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
     * Socket
     *
     * This is the instance of the socket connection.
     * Designed to be a child of the HTTP server, running
     * off the same port and instance.
     *
     * @type {Socket}
     * @private
     */
    protected _socket: Socket = null;


    /**
     * Constructor
     *
     * Assigns options and the strategy object
     *
     * @param {IServerOptions} _options
     * @param {IServerStrategy} _strategy
     * @param {ISocketStrategy} socket
     */
    public constructor (
        protected _options: IServerOptions,
        protected _strategy: IServerStrategy,
        socket: ISocketStrategy = null
    ) {

        super();

        if (_.isObject(this._strategy) === false) {
            throw new SyntaxError("Server strategy object is required");
        }

        /* Optional - create a socket server */
        if (socket) {
            socket.createSocket(this._strategy);

            this._socket = new Socket(socket);
        }

    }


    /**
     * Add Route
     *
     * Adds the route to the strategy and configures
     * the output ready for use by the output handler
     *
     * @param {string} httpMethod
     * @param {string} route
     * @param {Function[]} routeFn
     * @private
     */
    protected _addRoute (request: any, response: any, routeFn: Function[]) : Promise<any> {

        let tasks: Promise<any>[] = _.map(routeFn, (task: Function) => {

            return new Promise(resolve => {

                /* Invoke the function */
                let result = task(request, response);

                /* Resolve the result */
                resolve(result);

            });

        });

        /* Use the outputHandler method to output */
        return this.outputHandler(request, response, () => {

            return Promise.all(tasks)
                .then((result: any) => {
                    /* Return the last result from the tasks as the output */
                    return _.last(result);
                });

        });

    }


    /**
     * Parse Data
     *
     * Parses the data output
     *
     * @param {*} data
     * @returns {{statusCode: Number, output: any}}
     * @private
     */
    protected _parseData (data: any) {

        let statusCode: Number = 200;
        let output: any;

        /* Some data to display */
        if (data >= 100 && data < 600) {

            /* HTTP status code */
            statusCode = data;

        } else if (_.isObject(data) && _.isFunction(data.getData)) {
            /* Get the data from a function */
            output = data.getData();
        } else {
            /* Just output the data */
            output = data;
        }

        return {
            statusCode,
            output
        };

    }


    /**
     * Parse Error
     *
     * Parses the error output
     *
     * @param {*} err
     * @returns {{statusCode: Number, output: any}}
     * @private
     */
    protected _parseError (err: any) {

        let statusCode: Number = 500;
        let output: any;

        /* Work out the appropriate error message */
        if (err >= 100 && err < 600) {

            /* HTTP status code */
            statusCode = err;

        } else if (_.isFunction(err.hasErrors)) {

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

            /* Convert to a friendly error */
            if (_.isFunction(err.getHttpCode)) {
                statusCode = err.getHttpCode();
            }

            output = _.isFunction(err.getDetail) ? err.getDetail() : err.message;

        }

        return {
            statusCode,
            output
        };

    }


    /**
     * Accept Parser
     *
     * Makes the server use the accept parse. Returns
     * this to make the method chainable.
     *
     * If it's in strict mode then it must match
     * the accept header exactly.
     *
     * @param {*} options
     * @param {boolean} strict
     * @returns {Server}
     */
    public acceptParser (options: any, strict: boolean = false) : Server {
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

        /* This the function that is set to the route */
        let routeFn: Function[];

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

        /* Ensure routeFn is always an array */
        if (_.isArray(fn)) {
            routeFn = (<Function[]> fn);
        } else {
            routeFn = [
                (<Function> fn)
            ];
        }

        this._strategy.addRoute(httpMethod, route, (request: any, response: any) => {
            this._addRoute(request, response, routeFn);
        });

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
                    _.each(methods, (fn: Function | Function[], method: string) => {

                        this.addRoute(method, route, fn);

                    });

                }

            });

        }

        return this;

    }


    /**
     * Add Sockets
     *
     * Adds namespaces and events to the socket
     * instance. If there's no socket server
     * configured, it won't add anything.
     *
     * @param {IAddRoutes} sockets
     * @returns {Server}
     */
    public addSockets (sockets: IAddRoutes) : Server {

        /* Only add if a socket connection */
        if (this._socket !== null) {

            _.each(sockets, (events: IAddSocket, namespace: string) => {

                this._socket.namespace(namespace, events);

                _.each(events, (event: Function, eventName: string) => {
                    this.emit("socketAdded", namespace, eventName);
                });

            });

        }

        return this;

    }


    /**
     * After
     *
     * This function is run at the end of the
     * functional chain.
     *
     * @param {function} fn
     * @returns {Server}
     */
    public after (fn: Function) : Server {
        if (_.isFunction(fn) === false) {
            throw new TypeError("Server.after must receive a function");
        }

        this._strategy.after(fn);
        return this;
    }


    /**
     * Before
     *
     * This function is run at the start of
     * the functional chain.
     *
     * @param {function} fn
     * @returns {Server}
     */
    public before (fn: Function) : Server {
        if (_.isFunction(fn) === false) {
            throw new TypeError("Server.before must receive a function");
        }

        this._strategy.before(fn);
        return this;
    }


    /**
     * Body Parser
     *
     * Allows the server to receive the HTTP body. Returns
     * this to make it chainable.
     *
     * @returns {Server}
     */
    public bodyParser () : Server {
        this._strategy.bodyParser();
        return this;
    }


    /**
     * Close
     *
     * Closes the server
     *
     * @returns {Server}
     */
    public close () : Server {
        this._strategy.close();
        return this;
    }


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
     * @returns {Server}
     */
    public enableCORS (origins: string[] = ["*"], addHeaders: string[] = []) : Server {
        this._strategy.enableCORS(origins, addHeaders);
        return this;
    }


    /**
     * Get Server
     *
     * Gets the server instance
     *
     * @returns {object}
     */
    public getServer () : Object {
        return this._strategy.getServer();
    }


    /**
     * GZIP Response
     *
     * Makes the response GZIP compressed.  Returns
     * this to make it chainable.
     *
     * @returns {exports}
     */
    public gzipResponse () : Server {
        this._strategy.gzipResponse();
        return this;
    }


    /**
     * Output Handler
     *
     * Handles the output, dispatching to the strategy
     * so it displays the output correctly. This invokes
     * the given function as a Promise and then handles
     * what it returns. This is how the router should
     * start going to the application tier and beyond.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} fn
     * @returns {Promise<T>|Promise<U>}
     */
    public outputHandler (req: Object, res: Object, fn: () => any) : Promise<any> {

        let task = (resolve: Function) => {
            resolve(fn());
        };

        return new Promise(task)
            .then((data: any) => {

                return this._parseData(data);

            })
            .catch((err: any) => {

                this.emit("error_log", err);

                return this._parseError(err);

            })
            .then(({statusCode, output}) => {

                /* Is the output empty? */
                if (statusCode === 200 && _.isEmpty(output) && _.isNumber(output) === false) {
                    statusCode = 204;
                    output = void 0;
                }

                return this._strategy.outputHandler(statusCode, output, req, res);

            });

    }


    /**
     * Query Parser
     *
     * Parses the query strings.  The mapParams option
     * allows you to decide if you want to map req.query
     * to req.params - false by default.  Returns this
     * to make it chainable.
     *
     * @param {boolean} mapParams
     * @returns {Server}
     */
    public queryParser (mapParams: boolean = false) : Server {
        this._strategy.queryParser(mapParams);
        return this;

    }


    /**
     * Start
     *
     * Starts up the server, returning a Promise
     *
     * @returns {Promise}
     */
    public start () {

        return this._strategy.start(this._options.port, this._options.hostname, this._options.backlog);

    }


    /**
     * Uncaught Exception
     *
     * Listens for uncaught exceptions
     *
     * @param {function} fn
     * @returns {Server}
     */
    public uncaughtException (fn: Function) : Server {
        if (_.isFunction(fn) === false) {
            throw new TypeError("Server.uncaughtException must receive a function");
        }

        this._strategy.uncaughtException(fn);

        return this;
    }


    /**
     * Use
     *
     * Allows you to apply a function, or array
     * of functions to each call.
     *
     * @param {function|function[]} fn
     * @returns {Server}
     */
    public use (fn: Function | Function[]) : Server {

        if (_.isArray(fn)) {

            _.each(fn, item => {
                this.use(item);
            });

        } else if (_.isFunction(fn)) {

            this._strategy.use(fn);

        } else {

            throw new TypeError("Server.use must receive a function or array of functions");
        }

        return this;

    }


}
