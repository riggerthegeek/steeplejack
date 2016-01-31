/**
 * steeplejack
 */

/// <reference path="./typings/main.d.ts" />

"use strict";


/* Node modules */
import * as path from "path";


/* Third-party modules */
let _ = require("lodash");
let isAbsolute = require("path-is-absolute");
import {sync as glob} from "glob";
import * as yargs from "yargs";


/* Files */
import {Base} from "./lib/base";
import {Injector} from "./lib/injector";
import {Router} from "./lib/router";
import {Server} from "./lib/server";
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
    public modules: string[] | IPlugin[] = [];


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
        modules: string[] | IPlugin[] = [],
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
        _.each(modules, (module: string | IPlugin) => {
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


    /**
     * Process Routes
     *
     * Processes the routes and puts them into
     * the Routes library
     *
     * @returns {Router}
     * @private
     */
    protected _processRoutes () {

        let routes = _.reduce(this.routes, (result: any, fn: Function, name: string) => {

            result[name] = this.injector.process(fn);

            return result;

        }, {});

        /* Put into a Router object and return */
        return new Router(routes);

    }


    protected _registerFactory (module: IFactory, modulePath: any) : Steeplejack {

        this.injector.registerFactory(module.name, module.factory);

        return this;

    }


    protected _registerModule (modulePath: any) : Steeplejack {

        let module: any = modulePath;

        /* Is the module a file path? */
        if (_.isString(module)) {
            /* Yup - load the file */
            module = require(module);
        }

        _.each(module, (value: any, key: any) => {

            let method = '_' + _.camelCase(`register_${key}`);

            (<any>this)[method](module, modulePath);

        });

        return this;

    }


    protected _registerSingleton (module: ISingleton, modulePath: any) : Steeplejack {

        this.injector.registerSingleton(module.name, module.singleton);

        return this;

    }


    /**
     * Add Modules
     *
     * Takes a new module and loads it into the
     * application. The modules can be relative
     * to the application, an absolute path or
     * an instance of Plugin.
     *
     * For paths, globbed paths are recommended.
     *
     * @param {string|IPlugin} module
     * @returns {Steeplejack}
     */
    public addModule (module: string | IPlugin) : Steeplejack {

        /* Check if it's a module */
        if (_.isArray((<IPlugin>module).modules)) {
            /* Yes - just pull in from there */
            this.modules = _.concat(this.modules, (<IPlugin>module).modules);
            return this;
        }

        /* Ensure path is a string */
        if (_.isString(module) === false) {
            throw new TypeError("Steeplejack.addModule can only accept a string or a Plugin instance");
        }

        /* Ensure an absolute path */
        let modulePath: string;
        if (isAbsolute(module)) {
            modulePath = <string>module;
        } else {
            modulePath = path.join(process.cwd(), module);
        }

        /* Store in the array */
        this.modules = _.concat(this.modules, glob(modulePath));

        return this;

    }


    /**
     * Create Output Handler
     *
     * Creates the output handler.  This is registered
     * in the IOC as $output.  It returns the handler
     * so it can be used during the run phase.
     *
     * @param {Server} server
     * @returns {function(Function, Object, Object): (Thenable<U>|Promise<U>|Promise<T>)}
     */
    public createOutputHandler (server: Server) : (fn: Function, req: Object, res: Object) => any {

        /* Get the server output handler */
        let outputHandler = (fn: Function, req: Object, res: Object) : any => {
            return server.outputHandler(fn, req, res);
        };

        /* Store in the injector */
        this.injector.registerSingleton("$output", outputHandler);

        /* Return so can be used elsewhere */
        return outputHandler;

    }


    /**
     * Run
     *
     * Sets up the server and runs the application. Must
     * receive a function which configures the server
     * instance.
     *
     * @returns {Steeplejack}
     */
    public run (factory: Function) : Steeplejack {

        /* Register the modules */
        _.each(this.modules, (module: any) => {
            this._registerModule(module);
        });

        /* Run the server factory through the injector */
        let server = this.injector.process(factory);

        /* Register the server to the injector */
        this.injector.registerSingleton("$server", server);

        /* Create the outputHandler and register to injector if not already done */
        if (this.injector.getComponent("$output") === null) {
            this.createOutputHandler(server);
        }

        /* Process the routes */
        let routes = this._processRoutes();

        /* Add in the routes to the server */
        server.addRoutes(routes.getRoutes());

        /* Listen for close events */
        this.on("close", () => {
            server.close();
        });

        /* Start the server */
        server.start()
            .then(() => {
                this.emit("start", this);
            });

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
