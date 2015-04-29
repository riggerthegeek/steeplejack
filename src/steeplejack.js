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
var cliParameters = require("./helper/cliParameters");
var Injector = require("./library/Injector");
var replaceEnvVars = require("./helper/replaceEnvVars");


/**
 * Applications
 *
 * Stores the instances of the applications we've
 * created for later use
 *
 * @type {object}
 * @private
 */
var applications = {};


/**
 * Create Injector
 *
 * This creates an instance of the injector that allows
 * us to inject in dependencies.
 *
 * @param {object} config
 * @returns {object}
 * @private
 */
function createInjector (config) {

    var injector = new Injector();

    injector.registerSingleton("$config", config);

    return injector;

}


var steeplejack = Base.extend({


    _construct: function (config, modules, env, cliParams) {

        if (_.isObject(config) === false || _.isArray(config)) {
            throw new TypeError("Instantiation error: config must be an object");
        }

        /* Store the modules for runtime */
        this._modules = _.reduce(modules, function (result, module) {

            var modulePath = path.join(process.cwd(), module);

            /* Glob the modules */
            result = result.concat(glob.sync(modulePath));

            return result;

        }, []);

        /* Marge config and parameters */
        config = _.merge(config, cliParams);

        /* Marge config and env */
        config = _.merge(config, env);

        /* Store config to this object */
        this._config = config;

        /* Create the injector */
        this._injector = createInjector(this._config);

        /* Store the routes */
        this._routes = {};

    },


    /**
     * Factory
     *
     * Registers a factory method to the application. A
     * factory is a function.
     *
     * @param name
     * @param fn
     * @returns {steeplejack}
     */
    factory: function (name, fn) {
        this._injector.register(name, fn);

        return this;
    },


    /**
     * Route
     *
     * Registers a route to the application.  A route
     * is how the web layer accesses the application.
     *
     * @param route
     * @param fn
     * @returns {steeplejack}
     */
    route: function (route, fn) {

        if (_.has(this._routes, route)) {
            throw new SyntaxError("Route has already been configured: " + route);
        }

        this._routes[route] = fn;

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
    run: function (createServer, fn) {

        var self = this;

        if (_.isFunction(fn) === false) {
            fn = _.noop;
        }

        /* Include the modules */
        _.each(this._modules, function (module) {
            require(module);
        });

        /* Run the create server function */
        var server = createServer(self._config);

        /* Create a closure for the outputHandler and register it to the injector */
        self._injector.registerSingleton("$outputHandler", function () {
            return server.outputHandler.apply(server, arguments);
        });

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
     * Singleton
     *
     * Registers a singleton method to the application. A
     * singleton will typically be something that have
     * already been instantiated or it may be just a JSON
     * object.
     *
     * @param name
     * @param inst
     * @returns {steeplejack}
     */
    singleton: function (name, inst) {

        if (_.isFunction(inst)) {
            inst = inst(this._config);
        }

        this._injector.registerSingleton(name, inst);

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
     * @param appName
     * @param config
     */
    app: function (appName, options) {

        options = Base.datatypes.setObject(options, {});

        if (_.has(applications, appName) === false) {

            /* Create the application */
            applications[appName] = steeplejack.create(
                options.config,
                options.modules,
                replaceEnvVars(options.env),
                cliParameters.apply(this, optimist.argv._)
            );

        } else if (_.isEmpty(options) === false) {
            /* Cannot redeclare options */
            throw new TypeError("steeplejack.app error: Cannot redeclare options");
        }

        return applications[appName];

    },


    /**
     * Base
     *
     * This is our Base object.  It is intended that everything
     * useful is extended from here.
     */
    Base: require("./library/Base"),


    /**
     * Collection
     *
     * A Collection is a series of Models and allows you to perform
     * various functions on groups of data.  These are designed to
     * be extended.
     */
    Collection: require("./library/Collection"),


    /**
     * Exceptions
     *
     * This is for when it all goes wrong.  You can extend these or
     * use them as-is (the Exception class must be extended).
     */
    Exceptions: {
        Exception: require("./error/Exception"),
        Fatal: require("./error/Fatal"),
        Validation: require("./error/Validation")
    },


    /**
     * Injector
     *
     * This is a simple but effective Inversion of Control system
     */
    Injector: Injector,


    /**
     * Model
     *
     * This is what we use to manage our data.  These
     * are all designed to be extended and defined with
     * the schema.
     */
    Model: require("./library/DomainModel"),


    /**
     * Router
     *
     * This allows us to route our application
     */
    Router: require("./library/Router"),


    /**
     * Server
     *
     * A parent method that we can extend to create
     * server implementations using, for example,
     * Express, Restify or the Node HTTP module.
     */
    Server: require("./library/Server")


});


module.exports = steeplejack;
