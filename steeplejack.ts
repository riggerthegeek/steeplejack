/**
 * steeplejack
 */

/// <reference path="./typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import * as yargs from "yargs";


/* Files */
import {Base} from "./lib/base";
import {cliParameters} from "./helpers/cliParameters";
import {replaceEnvVars} from "./helpers/replaceEnvVars";


export class Steeplejack extends Base {


    /**
     * Config
     *
     * The main config object
     *
     * @type {{}}
     */
    public config: Object = {};


    /**
     * Modules
     *
     * The modules array
     *
     * @type {Array}
     */
    public modules: any[] = [];


    /**
     * Routes
     *
     * The routes available
     *
     * @type {{}}
     */
    public routes: Object = {};


    public constructor (config: Object, modules: Object, routes: string) {

        super();

        this.config = config;

    }


    /**
     * App
     *
     * This is a factory that creates an instance of
     * the application. Although you can create without
     * this, this method is the preferred starting
     * point.
     *
     * @param {object} config
     * @param {object} env
     * @param {object} modules
     * @param {string} routes
     * @returns {Steeplejack}
     */
    public static app ({
        config = {},
        env = {},
        modules = {},
        routes = null
    } : IAppFactory = {
        config: {},
        env: {},
        modules: {},
        routes: null
    }) : Steeplejack {

        /* Pull in the parameters from the command line */
        let cliArgs = cliParameters(...yargs.argv._);

        /* Merge config and envvars */
        config = _.merge(config, replaceEnvVars(env));

        /* Merge config and command line arguments */
        config = _.merge(config, cliArgs);

        return new Steeplejack(config, modules, routes);

    }


}
