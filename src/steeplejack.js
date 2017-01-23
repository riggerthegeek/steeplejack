/**
 * Steeplejack
 *
 * An easy way of making a Twelve Factor App in NodeJS
 *
 * @license MIT
 * @link http://www.steeplejack.info
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import { Base } from '@steeplejack/core';
import { _ } from 'lodash';
import { sync as glob } from 'glob';
import yargs from 'yargs';
import Injector from './lib/injector';

/* Files */
import cliParameters from './helpers/cliParameters';
import processRoutes from './helpers/processRoutes';
import replaceEnvVars from './helpers/replaceEnvVars';
import Router from './lib/router';

class Steeplejack extends Base {

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
   * @param {*[]} modules
   * @param {string} routesDir
   * @param {string} routesGlob
   */
  constructor (config = {}, modules = [], routesDir = null, routesGlob = '**/*.js') {
    super();

    /* Routing paths */
    this.routing = {
      routes: [],
      sockets: [],
    };

    /* Array of injected modules */
    this.modules = [];

    /* Store the config object */
    if (_.isObject) {
      this.config = config;
    }

    this.injector = new Injector();

    /* Register system components */
    this.injector.registerComponent({
      name: '$injector',
      instance: this.injector,
    }).registerComponent({
      name: '$config',
      instance: this.config,
    });

    modules.forEach(module => this.addModule(module));

    /* Configure the routes - pass in the absolute path */
    if (routesDir) {
      if (path.isAbsolute(routesDir) === false) {
        routesDir = path.join(process.cwd(), routesDir);
      }

      /* Get the route files */
      const routeFiles = Router.getFileList(routesDir, routesGlob);

      this.routeFactories = Router.discoverRoutes(routeFiles);
    }
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
   * @param {string|{modules: string[]}} module
   * @return {Steeplejack}
   */
  addModule (module) {
    /* Check if it's a plugin */
    if (_.isArray(module.modules)) {
      /* Yes - get the modules */
      module.modules.forEach(mod => this.modules.push(mod));
      return this;
    }

    /* Ensure path is a string */
    if (_.isString(module) === false) {
      throw new TypeError('Steeplejack.addModule can only accept a string or a Plugin instance');
    }

    /* Ensure an absolute path */
    let modulePath;
    if (path.isAbsolute(module)) {
      modulePath = module;
    } else {
      modulePath = path.join(process.cwd(), module);
    }

    /* Get the modules and add to the modules array */
    glob(modulePath)
      .forEach(file => this.modules.push(file));

    return this;
  }

  /**
   * Create Output Handler
   *
   * Creates the output handler.  This is registered
   * in the IOC as value of Steeplejack.outputHandlerName.
   * It returns the handler so it can be used during
   * the run phase.
   *
   * @param {{ outputHandler: Function }} server
   * @return {Function}
   */
  createOutputHandler (server) {
    /* Get the server output handler */
    const instance = (request, response, fn, logError) => server
      .outputHandler(request, response, fn, logError);

    /* Store in the injector */
    this.injector.registerComponent({
      name: Steeplejack.outputHandlerName,
      instance,
    });

    /* Return so can be used elsewhere */
    return instance;
  }

  /**
   * Run
   *
   * Sets up the server and runs the application. Must
   * receive a function which configures the server
   * instance.
   *
   * @param {string[]} deps
   * @param {function} factory
   * @return {Steeplejack}
   */
  run (deps, factory) {
    if (_.isFunction(factory) === false) {
      throw new TypeError('Steeplejack.run must receive a factory to create the server');
    }

    this.modules.forEach(module => this.injector.register(module));

    /* Run the server factory through the injector */
    this.server = this.injector.process(factory, deps);

    /* Create the outputHandler and register to injector if not already done */
    if (this.injector.getComponent(Steeplejack.outputHandlerName) === null) {
      this.createOutputHandler(this.server);
    }

    /* Process the routes through the injector */
    const processedRoutes = processRoutes(this.injector, this.routeFactories);

    /* Get list of routes */
    this.server
      .on("routeAdded", (httpMethod, route) => {
        this.routing.routes.push(`${httpMethod}:${route}`);
      })
      .on("socketAdded", (socketName, event) => {
        this.routing.sockets.push(`${socketName}:${event}`);
      });

    /* Add in the routes to the server */
    this.server
      .addRoutes(processedRoutes.routes.routes)
      .addSockets(processedRoutes.sockets.routes);

    /* Add in the post route middleware */
    this.server
      .afterUse
      .forEach(fn => this.server.use(...fn()));

    /* Listen for close events */
    this.on("close", () => {
      this.server.close();
    });

    /* Start the server */
    this.server.start()
      .then(() => {
        const log = console.log;

        /* Output current config */
        log("--- Config  ---");
        log(JSON.stringify(this.config, null, 4));

        /* Output routes */
        log("--- Routes  ---");
        log(this.routing.routes.join("\n"));

        /* Output sockets */
        log("--- Sockets ---");
        log(this.routing.sockets.join("\n"));
        log("---------------");

        /* Notify that we've started */
        this.emit("start", this);
      });

    return this;
  }

  static get outputHandlerName () {
    return '$output';
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
   * @param {Array} modules
   * @param {string} routesDir
   * @param {string} routesGlob
   * @return {Steeplejack}
   */
  static app ({
    config = {},
    env = {},
    modules = undefined,
    routesDir = undefined,
    routesGlob = undefined,
  }) {
    /* Pull in the parameters from the command line */
    const cliArgs = cliParameters(...yargs.argv._);

    /* Merge config and envvars */
    config = _.merge(config, replaceEnvVars(env));

    /* Merge config and command line arguments */
    config = _.merge(config, cliArgs);

    return new Steeplejack(config, modules, routesDir, routesGlob);
  }


}

module.exports = Steeplejack;
