/**
 * Steeplejack
 *
 * An easy way of making a Twelve Factor App in NodeJS
 *
 * @license MIT
 * @link http://www.steeplejack.info
 */

"use strict";


/* Node modules */
import * as path from "path";


/* Third-party modules */
import * as _ from "lodash";
const isAbsolute = require("path-is-absolute");
import {Promise} from "es6-promise";
import {sync as glob} from "glob";
import * as yargs from "yargs";


/* Files */
import {injectFlag} from "./decorators/inject";
import {Base} from "./lib/base";
import {Injector} from "./lib/injector";
import {Router} from "./lib/router";
import {Server} from "./lib/server";
import {cliParameters} from "./helpers/cliParameters";
import {replaceEnvVars} from "./helpers/replaceEnvVars";
import {IAppFactory} from "./interfaces/appFactory";
import {IConfig} from "./interfaces/config";
import {IFactory} from "./interfaces/factory";
import {IOutput} from "./interfaces/output";
import {IPlugin} from "./interfaces/plugin";
import {IProcessedRoutes} from "./interfaces/processedRoutes";
import {ISingleton} from "./interfaces/singleton";


export class Steeplejack extends Base {


    /**
     * Output Handler Name
     *
     * @type {string}
     * @private
     */
    private _outputHandlerName: string = "$output";


    /**
     * Config
     *
     * The main config object
     *
     * @type {{}}
     */
    public config: Object = {};


    /**
     * Injector
     *
     * The instance of the IOC container
     *
     * @type {{}}
     */
    public injector: Injector;


    /**
     * Modules
     *
     * The modules array
     *
     * @type {Array}
     */
    public modules: string[] = [];


    /**
     * Routes
     *
     * The routes available. These are unprocessed
     * by the dependency injector.
     *
     * @type {{}}
     */
    protected _routes: Object = {};


    /**
     * Routes
     *
     * The processed routes.
     *
     * @type {Array}
     */
    public routes: string[] = [];


    /**
     * Server
     *
     * The server object
     */
    public server: any;


    /**
     * Sockets
     *
     * The processed sockets.
     *
     * @type {Array}
     */
    public sockets: string[] = [];


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
     * @param {IPlugin[]} modules
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

            this._routes = Router.discoverRoutes(routeFiles);
        }

    }


    /**
     * Process Routes
     *
     * Processes the routes and puts them into
     * the Routes library
     *
     * @returns {IProcessedRoutes}
     * @private
     */
    protected _processRoutes () : IProcessedRoutes {

        let types = [
            "route",
            "socket"
        ];

        let data = _.reduce(this._routes, (result: any, value: any, name: string) => {

            _.each(types, (type: string) => {
                if (value[type]) {
                    result[type][name] = this.injector.process(value[type]);
                }
            });

            return result;

        }, {
            route: {},
            socket: {}
        });

        /* Put into a Router object and return */
        return {
            routes: new Router(data.route),
            sockets: new Router(data.socket)
        };

    }


    /**
     * Register Class
     *
     * Registers a new class and adds any dependencies
     * to the class.
     *
     * If you specify the class as a factory, it does
     * not create a new instance of the class and any
     * dependencies are available as static methods. If
     * not a factory, an instance of the class is created
     * with the dependencies sent through to the
     * constructor method.
     *
     * @param {*} module
     * @returns {Steeplejack}
     * @private
     */
    protected _registerClass (module: any) : Steeplejack {

        let config = module[injectFlag];

        let deps = _.clone(config.deps);
        if (_.isArray(deps) === false) { deps = []; }

        let fn = (...args: any[]) => {

            if (config.factory) {
                /* Factory - set dependencies to class */
                _.each(_.initial(deps), (name: any, id: number) => {
                    module[name] = args[id];
                });

                return module;
            } else {
                /* Create instance */
                return new module(...args);
            }

        };

        deps.push(fn);

        this.injector.registerFactory(config.name, deps);

        return this;

    }


    /**
     * Register Config
     *
     * A config is something that receive the config
     * object as a single argument.  It must return
     * the instance that is then set as a singleton
     * to the IOC container.
     *
     * @param {IConfig} module
     * @returns {Steeplejack}
     * @private
     */
    protected _registerConfig (module: IConfig) : Steeplejack {

        let fn = module.config;

        /* Run the function, returning the config object as the argument */
        let inst = fn(this.config);

        /* Register as a singleton */
        return this._registerSingleton({
            name: module.name,
            singleton: inst
        });

    }


    /**
     * Register Factory
     *
     * Registers a function to the container. Any
     * arguments are resolved as dependencies. Anything
     * that is returned from that function then becomes
     * a useable dependency.
     *
     * @param {IFactory} module
     * @returns {Steeplejack}
     * @private
     */
    protected _registerFactory (module: IFactory) : Steeplejack {

        this.injector.registerFactory(module.name, module.factory);

        return this;

    }


    /**
     * Register Module
     *
     * This is the initial registration of the
     * modules. The looks at the registration
     * keys available and runs those registration
     * methods.
     *
     * @param {*} modulePath
     * @returns {Steeplejack}
     * @private
     */
    protected _registerModule (modulePath: any) : Steeplejack {

        let module: any = modulePath;

        let requireable : boolean = _.isString(module);

        /* Is the module a file path? */
        if (requireable) {
            /* Yup - load the file */
            module = require(module);
        }

        _.each(module, (value: any, key: any) => {

            if (_.has(value, injectFlag)) {
                this._registerClass(value);
            } else {

                switch (key) {

                    case "__config":
                        this._registerConfig(value);
                        break;

                    case "__factory":
                        this._registerFactory(value);
                        break;

                    case "__singleton":
                        this._registerSingleton(value);
                        break;

                }

            }

        });

        return this;

    }


    /**
     * Register Singleton
     *
     * Registers a singleton method to the application. A
     * singleton will typically be something that has
     * already been instantiated or it may be just a JSON
     * object.
     *
     * @param {ISingleton} module
     * @returns {Steeplejack}
     * @private
     */
    protected _registerSingleton (module: ISingleton) : Steeplejack {

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
        if (_.isArray((<IPlugin> module).modules)) {
            /* Yes - just pull in from there */
            this.modules = _.concat(this.modules, (<IPlugin> module).modules);
            return this;
        }

        /* Ensure path is a string */
        if (_.isString(module) === false) {
            throw new TypeError("Steeplejack.addModule can only accept a string or a Plugin instance");
        }

        /* Ensure an absolute path */
        let modulePath: string;
        if (isAbsolute(<string> module)) {
            modulePath = <string> module;
        } else {
            modulePath = path.join(process.cwd(), module);
        }

        let paths: string[] = glob(modulePath);

        /* Store in the array */
        this.modules = _.concat(this.modules, paths);

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
     * @returns {IOutput}
     */
    public createOutputHandler (server: Server) : IOutput {

        /* Get the server output handler */
        let outputHandler = (request: Object, response: Object, fn: () => void) : Promise<any> => {
            return server.outputHandler(request, response, fn);
        };

        /* Store in the injector */
        this.injector.registerSingleton(this._outputHandlerName, outputHandler);

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

        if (_.isFunction(factory) === false) {
            throw new TypeError("Steeplejack.run must receive a factory to create the server");
        }

        /* Register the modules */
        _.each(this.modules, (module: any) => {
            this._registerModule(module);
        });

        /* Run the server factory through the injector */
        this.server = this.injector.process(factory);

        /* Create the outputHandler and register to injector if not already done */
        if (this.injector.getComponent(this._outputHandlerName) === null) {
            this.createOutputHandler(this.server);
        }

        /* Process the routes */
        let processedRoutes: IProcessedRoutes = this._processRoutes();

        /* Get list of routes */
        this.server
            .on("routeAdded", (httpMethod: string, route: string) => {
                this.routes.push(`${httpMethod}:${route}`);
            })
            .on("socketAdded", (socketName: string, event: string) => {
                this.sockets.push(`${socketName}:${event}`);
            });

        /* Add in the routes to the server */
        this.server
            .addRoutes(processedRoutes.routes.getRoutes())
            .addSockets(processedRoutes.sockets.getRoutes());

        /* Listen for close events */
        this.on("close", () => {
            this.server.close();
        });

        /* Start the server */
        this.server.start()
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
