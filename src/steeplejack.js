/**
 * Main
 *
 * This is the main application file.  This is an
 * object that receives all the config parameters
 * and then loads up the server
 *
 * @package steeplejack
 */

"use strict";


/* Node modules */
var path = require("path");


/* Third-party modules */
var _ = require("lodash");
var glob = require("glob");
var optimist = require("optimist");


/* Files */
var Base = require("./library/Base");
var Collection = require("./library/Collection");
var Exception = require("./error/Exception");
var Fatal = require("./error/Fatal");
var Injector = require("./library/Injector");
var Model = require("./library/DomainModel");
var Router = require("./library/Router");
var Server = require("./library/Server");
var Validation = require("./error/Validation");
var cliParameters = require("./helper/cliParameters");
var replaceEnvVars = require("./helper/replaceEnvVars");

var datatypes = Base.datatypes;


var steeplejack = Base.extend({


    /**
     * Global config object. Gets set to $config
     * in IOC container
     */
    _config: {},


    /**
     * Instance of the injector
     */
    _injector: null,


    _modules: [],


    _routes: {},


    /**
     * Construct
     *
     * Instantiates a new instance of steeplejack.  All the
     * parameters are optional, but you'll struggle to make
     * an application without them.  However, it's not steeplejack's
     * job to tell you how to build your application, merely
     * help you do so.
     *
     * Ordinarily, you'd not activate this directly and should
     * use the steeplejack.app() static method.  This gives you
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
     * routeDir - this is the location of the routes file.  In
     * here, you can configure your routes and this will all
     * be loaded automatically.
     *
     * @param config
     * @param modules
     * @param routeDir
     * @private
     */
    _construct: function (config, modules, routeDir) {

        /* Config is optional */
        this._config = datatypes.setObject(config, {});

        this._injector = new Injector();

        /* Store config */
        this.getInjector().registerSingleton("$config", config);

        /* Add in the modules */
        if (datatypes.setArray(modules, null) !== null) {
            this.addModule(modules);
        }

        /* Configure the routes - pass the absolute path */
        if (routeDir) {
            this.setRoutes(Router.discoverRoutes(path.join(process.cwd(), routeDir)));
        }

    },


    /**
     * Get Name From Path
     *
     * Returns the name of the file, without the extensions.
     * If you have a file with two .s (eg, filename.test.js),
     * it just returns filename.
     *
     * @param filePath
     * @returns {*}
     * @private
     */
    _getNameFromPath: function _getNameFromPath (filePath) {

        var fileName;
        if (_.has(path, "parse")) {
            /* Introduced in 0.12 */
            fileName = path.parse(filePath).name;
        } else {
            /* Older way of doing it */
            fileName = path.basename(filePath);
        }

        fileName = fileName.split(".");

        return fileName[0];

    },


    /**
     * Register Module
     *
     * Registers a module to the IOC container.
     *
     * @param {string} modulePath
     * @private
     */
    _registerModule: function _registerModule (modulePath) {

        /* Get the file */
        var module = require(modulePath);

        if (_.isObject(module) && _.size(module) === 1) {
            /* Looks like we're trying to register something to the container */
            var key = _.keys(module)[0];

            /* Our register methods begin __ */
            if (key.match(/^__[a-z]/i) !== null) {

                /* Remove the __ */
                key = key.replace(/^__/, "");

                var registerFn = "register" + _.capitalize(key);

                if (_.has(this, registerFn)) {
                    this[registerFn](module, modulePath);
                } else {
                    throw new SyntaxError("Unknown module type: __" + key);
                }

            }
        }

    },


    /**
     * Add Module
     *
     * Takes an array of modules (or a single module)
     * and loads it to the application.  The modules
     * should be in a relative path to the application.
     *
     * It also accepts globbed paths.
     *
     * @param module
     */
    addModule: function addModule (module) {

        if (_.isArray(module)) {
            _.each(module, function (mod) {
                this.addModule(mod);
            }, this);

            return;
        }

        if (_.isString(module) === false) {
            throw new TypeError("steeplejack.addModule can only accept a string[]");
        }

        /* Make relative path */
        var modulePath = path.join(process.cwd(), module);

        /* Store it in array */
        this._modules = this._modules.concat(glob.sync(modulePath));

    },


    /**
     * Get Injector
     *
     * Returns the instance of the injector
     *
     * @returns {Injector}
     */
    getInjector: function getInjector () {
        return this._injector;
    },


    /**
     * Register Config
     *
     * This is to register config modules
     *
     * @param module
     * @param modulePath
     * @returns {*}
     */
    registerConfig: function registerConfig (module, modulePath) {

        var fn = module.__config;

        var name = fn.name;

        if (name === "") {
            name = this._getNameFromPath(modulePath);
        }

        if (_.isFunction(fn) === false) {
            throw new TypeError("steeplejack.config can only accept functions");
        }

        /* Run the function, returning the config object as the argument */
        var inst = fn(this._config);

        /* Use the register singleton method to register it */
        return this.registerSingleton({
            __singleton: inst
        }, name);

    },


    /**
     * Register Constant
     *
     * This registers whatever is sent as to the IOC
     * controller.  Although it can be used for any
     * data type, it is designed to be used for app-wide
     * configuration parameters.
     *
     * It is certainly not designed with using to store
     * functions (although it will work, you should use
     * either the factory or the singleton for that).
     *
     * @param name
     * @param modulePath
     * @returns {steeplejack}
     */
    registerConstant: function registerConstant (module, modulePath) {

        var value = module.__constant;
        var name = this._getNameFromPath(modulePath);

        this._injector.registerSingleton(name, value);

        return this;

    },


    /**
     * Register Factory
     *
     * Registers a factory method to the application. A
     * factory is a function.  This is where you would
     * store a "class" that is instantiated later on.
     *
     * Models and collections would typically be stored
     * inside a factory as they create something (an
     * instance of the class) when they are called.
     *
     * @param module
     * @param modulePath
     * @returns {steeplejack}
     */
    registerFactory: function registerFactory (module, modulePath) {

        var fn = module.__factory;
        var name = fn.name;

        if (name === "") {
            name = this._getNameFromPath(modulePath);
        }

        this._injector.register(name, fn);

        return this;
    },


    /**
     * Singleton
     *
     * Registers a singleton method to the application. A
     * singleton will typically be something that has
     * already been instantiated or it may be just a JSON
     * object.
     *
     * @param module
     * @param modulePath
     * @returns {steeplejack}
     */
    registerSingleton: function registerSingleton (module, modulePath) {

        var inst = module.__singleton;
        var name = this._getNameFromPath(modulePath);

        if (_.isFunction(inst)) {
            throw new TypeError("steeplejack.singleton cannot accept a function");
        }

        this._injector.registerSingleton(name, inst);

        return this;
    },


    /**
     * Run
     *
     * Sets up the server and runs the application
     *
     * @param createServer
     * @param fn
     * @returns {steeplejack}
     */
    run: function run (createServer, fn) {

        var self = this;

        if (_.isFunction(fn) === false) {
            fn = _.noop;
        }

        /* Register the modules */
        _.each(self._modules, function (module) {
            this._registerModule(module);
        }, self);

        /* Run the create server function */
        var server = createServer(self._config);

        this._injector.registerSingleton("$server", server);

        /* Create a closure for the outputHandler and register it to the injector */
        if (self._injector.getComponent("$outputHandler") === null) {
            self._injector.registerSingleton("$outputHandler", function () {
                return server.outputHandler.apply(server, arguments);
            });
        }

        /* Process the routes */
        var routes = _.reduce(self._routes, function (result, fn, name) {
            result[name] = this._injector.process(fn);
            return result;
        }, {}, self);


        /* Get the all routes */
        routes = steeplejack
            .Router.create(routes)
            .getRoutes();

        /* Add in the routes to the server */
        server.addRoutes(routes);

        /* Start the server */
        server.start(function (err) {

            if (err) {
                /* Error */
                throw err;
            }

            /* Emit the config */
            self.emit("server_start", self._config);

        });

        /* Listen for close events */
        self.on("server_close", function () {
            server.close();
        });

        /* Finally, run the function passed in with this */
        self._injector.process(fn);

        return self;
    },


    /**
     * Set Routes
     *
     * Sets the routes to use
     *
     * @param routes
     * @returns {steeplejack}
     */
    setRoutes: function (routes) {
        this._routes = datatypes.setObject(routes, {});

        return this;
    }


}, {

    /**
     * Static Methods
     *
     * These are methods that we want to expose publicly
     * to the API.
     */


    /**
     * App
     *
     * This is a singleton that either creates an application
     * instance or retrieves the application instance created
     * previously.  This is designed to be where we start
     * everything from. The options is required the first it's
     * called and then not allowed to be passed in at a later
     * date.
     *
     * @param options
     */
    app: function app (options) {

        options = datatypes.setObject(options, {});

        var config = datatypes.setObject(options.config, {}); /* Config JSON - set to $config */
        var env = datatypes.setObject(options.env, null); /* Environment variables - overrides $config */
        var args = cliParameters.apply(this, optimist.argv._); /* Arguments passed into command line */

        if (env !== null) {
            /* Merge config and env */
            config = _.merge(config, replaceEnvVars(env));
        }

        /* Merge config and arguments */
        config = _.merge(config, args);

        /* Create and return the application */
        return steeplejack.create(config, options.modules, options.routeDir);

    },


    /**
     * Base
     *
     * This is our Base object.  It is intended that everything
     * useful is extended from here.
     */
    Base: Base,


    /**
     * Collection
     *
     * A Collection is a series of Models and allows you to perform
     * various functions on groups of data.  These are designed to
     * be extended.
     */
    Collection: Collection,


    /**
     * Exceptions
     *
     * This is for when it all goes wrong.  You can extend these or
     * use them as-is (the Exception class must be extended).
     */
    Exceptions: {
        Exception: Exception,
        Fatal: Fatal,
        Validation: Validation
    },


    /**
     * Injector
     *
     * This is a simple but effective Inversion of Control
     * system
     */
    Injector: Injector,


    /**
     * Model
     *
     * This is what we use to manage our data.  These
     * are all designed to be extended and defined with
     * the schema.
     */
    Model: Model,


    /**
     * Router
     *
     * This allows us to route our application
     */
    Router: Router,


    /**
     * Server
     *
     * A strategy we can use to create server
     * implementations using, for example, Express,
     * Restify or the Node HTTP module.
     */
    Server: Server


});


module.exports = steeplejack;
