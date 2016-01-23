/**
 * server
 */

/// <reference path="../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {Base} from "./base";


export class Server extends Base {


    protected _options: {
        port?: number;
        hostname?: string;
        backlog?: number;
    } = {};


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
