/**
 * Main
 *
 * This is the main application file.  This is an
 * object that receives all the config parameters
 * and then loads up the server
 *
 * @license MIT License
 */

"use strict";


/* Node modules */
var path = require("path");


/* Third-party modules */
var _ = require("lodash");
var glob = require("glob");
var pathIsAbsolute = require("path-is-absolute");


/* Files */
var Base = require("./library/Base");
var Collection = require("./library/Collection");
var Exception = require("./error/Exception");
var Fatal = require("./error/Fatal");
var Injector = require("./library/Injector");
var Logger = require("./library/Logger");
var Model = require("./library/DomainModel");
var Plugin = require("./library/Plugin");
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
     * @param {object} config
     * @param {array} modules
     * @param {string} routeDir
     * @private
     */
    _construct: function _construct (config, modules, routeDir) {

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

            if (pathIsAbsolute(routeDir) === false) {
                routeDir = path.join(process.cwd(), routeDir);
            }

            this.setRoutes(Router.discoverRoutes(routeDir));
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
     * @param {object} obj
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
     * Process Routes
     *
     * Processes the routes and puts them into
     * the Routes library
     *
     * @returns {Object}
     * @private
     */
    _processRoutes: function _processRoutes () {

        var routes = _.reduce(this._routes, function (result, fn, name) {
            result[name] = this.getInjector().process(fn);
            return result;
        }, {}, this);

        /* Put to the router and return */
        return new Router(routes);

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

        /* Get the module */
        var module;
        if (_.isString(modulePath)) {
            /* It's a string - load the module path */
            module = require(modulePath);
        } else {
            /* It's a plugin - no need to load again */
            module = modulePath;
        }

        if (datatypes.setObject(module, null) === null) {
            /* Module isn't an object */
            throw new SyntaxError("Module must be an object: " + modulePath);
        }

        if (_.size(module) !== 1) {
            /* There isn't one element registered */
            throw new SyntaxError("Module must be an object with exactly 1 element: " + modulePath);
        }

        /* Looks like we're trying to register something to the container */
        var key = _.keys(module)[0];

        /* Our register methods begin __ */
        if (key.match(/^__[a-z]/i) === null) {
            throw new SyntaxError("No known modules: " + modulePath);
        }

        /* Remove the __ at the start */
        key = key.replace(/^__/, "");

        var registerFn = "register" + _.capitalize(key);

        if (_.has(this, registerFn) === false) {
            throw new SyntaxError("Unknown module type: __" + key);
        }

        /* Run the registration function */
        this[registerFn](module, modulePath);

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
     * @param {string|array} module
     */
    addModule: function addModule (module) {

        if (_.isArray(module)) {
            _.each(module, function (mod) {
                this.addModule(mod);
            }, this);

            return;
        }

        if (_.has(module, "getModules") && _.isFunction(module.getModules)) {
            /* Plugin - add in the plugin */
            this._modules = this._modules.concat(module.getModules());
            return;
        }

        if (_.isString(module) === false) {
            throw new TypeError("steeplejack.addModule can only accept a string[] or an instance of Plugin");
        }

        /* Make relative path */
        var modulePath = pathIsAbsolute(module) ? module : path.join(process.cwd(), module);

        /* Store it in array */
        this._modules = this._modules.concat(glob.sync(modulePath));

    },


    /**
     * Create Output Handler
     *
     * Creates the output handler.  This is available
     * publicly in case a user wishes to register it
     * at a different point during the run phase.
     *
     * @param {object} server
     * @returns {Function}
     */
    createOutputHandler: function createOutputHandler (server) {

        var $outputHandler = function $outputHandler () {
            return server.outputHandler.apply(server, arguments);
        };

        this.getInjector().registerSingleton("$outputHandler", $outputHandler);

        /* Return it so it can be used elsewhere */
        return $outputHandler;

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
     * Get Modules
     *
     * Get the modules registered
     *
     * @returns {Array}
     */
    getModules: function getModules () {
        return this._modules;
    },


    /**
     * Register Config
     *
     * This is to register config modules
     *
     * @param {string} module
     * @param {string} modulePath
     * @returns {*}
     */
    registerConfig: function registerConfig (module, modulePath) {

        var fn = module.__config;

        if (_.isFunction(fn) === false) {
            throw new TypeError("steeplejack.registerConfig can only accept functions: " + modulePath);
        }

        var name = fn.name;

        if (name === "") {
            throw new SyntaxError("steeplejack.registerConfig function cannot be anonymous: " + modulePath);
        }

        /* Run the function, returning the config object as the argument */
        var inst = fn(this._config);

        var singleton = {
            __singleton: {}
        };

        singleton.__singleton[name] = inst;

        /* Use the register singleton method to register it */
        return this.registerSingleton(singleton, modulePath);

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
     * @param {*} module
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
     * @param {string} module
     * @param {function} modulePath
     * @returns {steeplejack}
     */
    registerFactory: function registerFactory (module, modulePath) {

        var fn = module.__factory;
        var name = fn.name;

        if (name === "") {
            throw new SyntaxError("steeplejack.registerFactory function cannot be anonymous: " + modulePath);
        }

        this.getInjector().register(name, fn);

        return this;
    },


    /**
     * Register Modules
     *
     * Takes the modules registered to the application and
     * calls the register module function on each.
     *
     * @returns {steeplejack}
     */
    registerModules: function () {

        _.each(this._modules, function (module) {
            this._registerModule(module);
        }, this);

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
     * @param {string} module
     * @param {object} modulePath
     * @returns {steeplejack}
     */
    registerSingleton: function registerSingleton (module, modulePath) {

        var singleton = this._getNameInstance(module.__singleton);

        var name = singleton.name;
        var inst = singleton.inst;

        if (_.isFunction(inst)) {
            throw new TypeError("steeplejack.registerSingleton cannot accept a function: " + modulePath);
        }

        this.getInjector().registerSingleton(name, inst);

        return this;
    },


    /**
     * Run
     *
     * Sets up the server and runs the application
     *
     * @param {function} createServer
     * @returns {steeplejack}
     */
    run: function run (createServer) {

        /* Register the modules */
        this.registerModules();

        /* Run the create server function */
        var server = this.getInjector().process(createServer, this);

        /* Register the server */
        this.getInjector().registerSingleton("$server", server);

        /* Create a closure for the outputHandler and register it to the injector */
        if (this.getInjector().getComponent("$outputHandler") === null) {
            this.createOutputHandler(server);
        }

        /* Process the routes */
        var routes = this._processRoutes();

        /* Add in the routes to the server */
        server.addRoutes(routes.getRoutes());

        /* Start the server */
        server.start(function (err) {

            if (err) {
                /* Error */
                throw err;
            }

            /* Emit the config */
            this.emit("start", this._config);

        }.bind(this));

        /* Listen for close events */
        this.on("close", function () {
            server.close();
        });

        return this;
    },


    /**
     * Set Routes
     *
     * Sets the routes to use
     *
     * @param {object} routes
     * @returns {steeplejack}
     */
    setRoutes: function setRoutes (routes) {
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
     * This is a singleton that creates an application
     * instance.  This is designed to be where we start
     * everything from.
     *
     * @param {object} options
     */
    app: function app (options) {

        /* Declare optimist here - it breaks Browserified packages in PhantomJS */
        var optimist = require("optimist");

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
        return new this(config, options.modules, options.routeDir);

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
     * Logger
     *
     * A strategy we can use to make use of
     * different logging modules, such as Bunyan
     * or Log4JS.
     */
    Logger: Logger,


    /**
     * Model
     *
     * This is what we use to manage our data.  These
     * are all designed to be extended and defined with
     * the schema.
     */
    Model: Model,


    /**
     * Plugin
     *
     * A plugin is an entire module that is exported
     * to be reused again.  This would be for something
     * that you wouldn't ordinarily want to change,
     * except for config parameters.
     */
    Plugin: Plugin,


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
    Server: Server,


    /**
     * Test
     *
     * A method to build a testable instance of the
     * application.  It needs to receive a config
     * object and also the module array to define the
     * modules to load.
     *
     * It returns a closure function.
     *
     * @param {object} options
     * @returns {function}
     */
    test: function test (options) {

        options = datatypes.setObject(options, {});

        var config = datatypes.setObject(options.config, {}); /* Config JSON */

        /**
         * Creates a test.  Receives three parameters.
         *  - moduleFn: this is a function that is parsed by the
         *    dependency injector to get modules.  It's loaded with
         *    the test options, so we can wrap the dependencies in
         *   underscores.
         *  - mocks: this is an object of mocks. This replaces
         *    components registered to the dependency injector
         *    with whatever is sent in.
         *  - configOverride: an object of params that override
         *    the config object.
         *
         * @param {function} moduleFn
         * @param {object} mocks
         * @param {object} configOverride
         * @returns {Object}
         */
        return function (moduleFn, mocks, configOverride) {

            if (_.isFunction(moduleFn) === false) {
                throw new SyntaxError("A function declaring what modules to be tested must be specified");
            }

            /* Ensure config is an object */
            configOverride = datatypes.setObject(configOverride, {});

            /* Merge together the config and override */
            config = _.merge(config, configOverride);

            /* Create and configure the application */
            var app = new this(config, options.modules)
                .registerModules();

            var injector = app.getInjector();

            /* Override any modules passed in */
            _.each(mocks, function (mock, name) {
                this.replace(name, mock);
            }, injector);

            /* Process it's dependencies and return */
            return injector.process(moduleFn, null, true);

        }.bind(this);

    }


});
