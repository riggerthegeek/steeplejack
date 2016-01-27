/**
 * steeplejack
 */

/// <reference path="./typings/tsd.d.ts" />

"use strict";


/* Node modules */
import * as path from "path";


/* Third-party modules */
import * as _ from "lodash";
let isAbsolute = require("path-is-absolute");
import * as yargs from "yargs";


/* Files */
import {Base} from "./lib/base";
import {Injector} from "./lib/injector";
import {Router} from "./lib/router";
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


    public injector: Injector;


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


    /**
     * Constructor
     *
     * Instantiates a new instance of steeplejack.  All the
     * parameters are optional, but you'll struggle to make
     * an application without them.  However, it's not Steeplejack's
     * job to tell you how to build your application, merely
     * help you do so.
     *
     * Ordinarily, you'd not activate this directly and should
     * use the Steeplejack.app() static method.  This gives you
     * the ability to configure your config object with command
     * line arguments and environment variables.
     *
     * --------------
     * The Parameters
     * --------------
     *
     * config - this is a JSON object that is treated as the
     * single source of truth for all your config needs.  Stick
     * in here database connection parameters, logging config
     * and anything else you may need.  This will be assigned
     * to $config in the IOC container
     *
     * modules - this is the location of the modules that will
     * be loaded as part of the system.  It is strongly recommended
     * that you used glob values in here, so that the adding
     * and removal of plugins becomes as simple as adding in
     * the files.
     *
     * routes - this is the location of the routes file.  In
     * here, you can configure your routes and this will all
     * be loaded automatically. Like the modules, this should
     * be a glob pattern.
     *
     * @param {object} config
     * @param {any[]} modules
     * @param {string} routesDir
     * @param {string} routesGlob
     */
    public constructor (
        config: Object = {},
        modules: any[] = [],
        routesDir: string = null,
        routesGlob: string = "**/*.js"
    ) {

        super();

        /* Store the config */
        if (_.isObject(config)) {
            this.config = config;
        }

        /* Create the injector */
        this.injector = new Injector();

        /* Store injector instance in injector */
        this.injector.registerSingleton("$injector", this.injector);

        /* Store config */
        this.injector.registerSingleton("$config", this.config);

        /* Add in the modules */
        _.each(modules, module => {
            this.addModule(module);
        });

        /* Configure the routes - pass in the absolute path */
        if (routesDir) {
            if (isAbsolute(routesDir) === false) {
                routesDir = path.join(process.cwd(), routesDir);
            }

            /* Get the route files */
            let routeFiles = Router.getFileList(routesDir, routesGlob);

            this.routes = Router.discoverRoutes(routeFiles);
        }

    }


    public addModule (module: any) : Steeplejack {

        return this;

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
        modules = [],
        routesDir = null,
        routesGlob = void 0
    } : IAppFactory = {}) : Steeplejack {

        /* Pull in the parameters from the command line */
        let cliArgs = cliParameters(...yargs.argv._);

        /* Merge config and envvars */
        config = _.merge(config, replaceEnvVars(env));

        /* Merge config and command line arguments */
        config = _.merge(config, cliArgs);

        return new Steeplejack(config, modules, routesDir, routesGlob);

    }


}
