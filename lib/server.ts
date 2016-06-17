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
     * After Use
     *
     * These will be added to the use stack
     * after the routes have been added
     *
     * @type {Array}
     * @private
     */
    public afterUse: any[] = [];


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
     * the output ready for use by the output handler.
     * The tasks are run in order, not resolving any
     * future ones if a previous one has failed.
     *
     * @param {any} request
     * @param {any} response
     * @param {function[]} tasks
     * @returns {Promise<any>}
     * @private
     */
    protected _addRoute (request: any, response: any, tasks: Function[]) : Promise<any> {

        /* Use the outputHandler method to output */
        return this.outputHandler(request, response, () => {

            /* Run the tasks in order */
            return tasks.reduce((thenable: Promise<any>, task: Function) => {

                return thenable.then(() => {

                    return new Promise(resolve => {

                        /* Invoke the function */
                        let result = task(request, response);

                        /* Resolve the result */
                        resolve(result);

                    });

                });

            }, Promise.resolve());

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

        } else if (_.isFunction(err.getHttpCode) && _.isFunction(err.getDetail)) {

            /* It's a Steeplejack error - output as normal */
            statusCode = err.getHttpCode();
            output = err.getDetail();

        } else {

            /* Could be anything - treat as uncaught exception */
            throw err;

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
            return this._addRoute(request, response, routeFn);
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
     * This function is run after the routes/sockets
     * are added.
     *
     * @param {*} args
     * @returns {Server}
     */
    public after (...args: any[]) : Server {

        const closure = () => {
            return args;
        };

        this.afterUse.push(closure);

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
     * @param {boolean} logError
     * @returns {Promise<T>|Promise<U>}
     */
    public outputHandler (req: Object, res: Object, fn: () => any, logError: boolean = true) : Promise<any> {

        let task = (resolve: Function) => {
            resolve(fn());
        };

        return new Promise(task)
            .then((data: any) => {

                return this._parseData(data);

            })
            .catch((err: any) => {

                /* This may throw an error */
                const parsedError = this._parseError(err);

                /* A thrown error is an uncaught exception */
                if (logError) {
                    this.emit("error_log", err);
                }

                return parsedError;

            })
            .then(({statusCode, output}) => {

                /* Is the output empty? */
                if (statusCode === 200 && _.isEmpty(output) && _.isNumber(output) === false) {
                    statusCode = 204;
                    output = void 0;
                }

                return this._strategy.outputHandler(statusCode, output, req, res);

            })
            .catch((err: Error) => {

                if (this.listenerCount("uncaughtException") === 0) {
                    console.error("--- UNCAUGHT EXCEPTION ---");
                    if (err.stack) {
                        console.error(err.stack);
                    } else {
                        console.error(err);
                    }

                    /* Throw the error for the outputHandler to show */
                    throw err;
                }

                /* Emit an uncaught exception */
                this.emit("uncaughtException", req, res, err);

                /* No throwing as uncaught exception handler will deal with the outputting */

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
     * Static Dir
     *
     * Sets the static directory for the project
     *
     * @param {string} dir
     * @param {string} virtualPath
     * @returns {*}
     */
    public staticDir (dir: string, virtualPath: string = null) {
        this._strategy.staticDir(dir, virtualPath);
        return this;
    }


    /**
     * Uncaught Exception
     *
     * Listens for uncaught exceptions. The listener
     * receives three parameters, request, response
     * and the error itself.
     *
     * @param {function} fn
     * @returns {Server}
     */
    public uncaughtException (fn: (req: any, res: any, err: Error) => void) : Server {

        if (_.isFunction(fn) === false) {
            throw new TypeError("Server.uncaughtException must receive a function");
        }

        /* Listen for uncaught exceptions in the application */
        this.on("uncaughtException", fn);

        /* Listen for uncaught exceptions in the strategy */
        this._strategy.uncaughtException(fn);

        return this;

    }


    /**
     * Use
     *
     * Allows you to apply anything to the call. Although
     * this will usually be a function or array of functions,
     * it doesn't have to be.
     *
     * @param {*} args
     * @returns {Server}
     */
    public use (...args: any[]) : Server {

        this._strategy.use(...args);

        return this;

    }


}
