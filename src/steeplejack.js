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


module.exports = Base.extend({


    /**
     * Global config object. Gets set to $config
     * in IOC container
     */
    _config: {},


    /**
     * Instance of the injector
     */
    _injector: null,


    /**
     * Store the loaded modules
     */
    _modules: [],


    /**
     * The route functions
     */
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

        /* Create an injector */
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
     * Get Name Instance
     *
     * Splits out the name and the instance. It
     * expects the input to be an object with one
     * key.  That key is the name of the module and
     * whatever is set to that value is the instance.
     *
     * @param obj
     * @returns {{name: *, inst: *}}
     * @private
     */
    _getNameInstance: function _getNameInstance (obj) {

        if (_.isObject(obj) && _.isArray(obj) === false && _.size(obj) === 1) {

            var name = _.keys(obj)[0];

            return {
                name: name,
                inst: obj[name]
            };

        } else {
            var err = new SyntaxError("Invalid module formatting");
            err.obj = obj;
            throw err;
        }

    },


    /**
     * Register Module
     *
     * Registers a module to the IOC container. This
     * goes through all the modules and uses the
     * relevant method to register in the appropriate
     * way.
     *
     * @param {string} modulePath
     * @private
     */
    _registerModule: function _registerModule (modulePath) {

        /* Get the file */
        var module = require(modulePath);

        if (datatypes.setObject(module, null) === null) {
            /* Module isn't an object */
            throw new SyntaxError("Module must be an object");
        }

        if (_.size(module) !== 1) {
            /* There isn't one element registered */
            throw new SyntaxError("Module must be an object with exactly 1 element");
        }

        /* Looks like we're trying to register something to the container */
        var key = _.keys(module)[0];

        /* Our register methods begin __ */
        if (key.match(/^__[a-z]/i) === null) {
            throw new SyntaxError("No known modules");
        }

        /* Remove the __ at the start */
        key = key.replace(/^__/, "");

        var registerFn = "register" + _.capitalize(key);

        if (_.has(this, registerFn) === false) {
            throw new SyntaxError("Unknown module type: __" + key);
        }

        /* Run the registration function */
        this[registerFn](module);

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
     * @returns {*}
     */
    registerConfig: function registerConfig (module) {

        var fn = module.__config;

        var name = fn.name;

        if (name === "") {
            throw new SyntaxError("steeplejack.config function cannot be anonymous");
        }

        if (_.isFunction(fn) === false) {
            throw new TypeError("steeplejack.config can only accept functions");
        }

        /* Run the function, returning the config object as the argument */
        var inst = fn(this._config);

        var singleton = {
            __singleton: {}
        };

        singleton.__singleton[name] = inst;

        /* Use the register singleton method to register it */
        return this.registerSingleton(singleton);

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
     * @param module
     * @returns {steeplejack}
     */
    registerConstant: function registerConstant (module) {

        var constant = this._getNameInstance(module.__constant);

        this.getInjector().registerSingleton(constant.name, constant.inst);

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
     * @returns {steeplejack}
     */
    registerFactory: function registerFactory (module) {

        var fn = module.__factory;
        var name = fn.name;

        if (name === "") {
            throw new SyntaxError("steeplejack.registerFactory function cannot be anonymous");
        }

        this.getInjector().register(name, fn);

        return this;
    },


    /**
     * Register Singleton
     *
     * Registers a singleton method to the application. A
     * singleton will typically be something that has
     * already been instantiated or it may be just a JSON
     * object.
     *
     * @param module
     * @returns {steeplejack}
     */
    registerSingleton: function registerSingleton (module) {

        var singleton = this._getNameInstance(module.__singleton);

        var name = singleton.name;
        var inst = singleton.inst;

        if (_.isFunction(inst)) {
            throw new TypeError("steeplejack.singleton cannot accept a function");
        }

        this.getInjector().registerSingleton(name, inst);

        return this;
    },


    /**
     * Run
     *
     * Sets up the server and runs the application
     *
     * @param createServer
     * @returns {steeplejack}
     */
    run: function run (createServer) {

        var self = this;

        /* Register the modules */
        _.each(self._modules, function (module) {
            this._registerModule(module);
        }, self);

        /* Run the create server function */
        var server = self.getInjector().process(createServer, self);

        /* Register the server */
        self.getInjector().registerSingleton("$server", server);

        /* Create a closure for the outputHandler and register it to the injector */
        if (self.getInjector().getComponent("$outputHandler") === null) {
            self.getInjector().registerSingleton("$outputHandler", function () {
                return server.outputHandler.apply(server, arguments);
            });
        }

        /* Process the routes */
        var routes = _.reduce(self._routes, function (result, fn, name) {
            result[name] = this.getInjector().process(fn);
            return result;
        }, {}, self);

        /* Add in the routes to the server */
        server.addRoutes(Router.create(routes)
            .getRoutes());

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
        return this.create(config, options.modules, options.routeDir);

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
