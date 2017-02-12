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
import Injector from '@steeplejack/injector';
import { _ } from 'lodash';
import { sync as glob } from 'glob';
import yargs from 'yargs';

/* Files */
import cliParameters from './helpers/cliParameters';
import processRoutes from './helpers/processRoutes';
import replaceEnvVars from './helpers/replaceEnvVars';
import Router from './lib/router';

class Steeplejack extends Base {

  /**
   * Constructor
   *
   * Instantiates a new instance of Steeplejack.  All the
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
   * to $config in the IoC container.
   *
   * logger - name of the logger in the IoC container.
   *
   * modules - this is the location of the modules that will
   * be loaded as part of the system.  It is strongly recommended
   * that you used glob values in here, so that the adding
   * and removal of plugins becomes as simple as adding in
   * the files.
   *
   * routesDir - this is the location of the routes files.  In
   * here, you can configure your routes and this will all
   * be loaded automatically. Like the modules, this should
   * be a glob pattern.
   *
   * routesGlob - this is the glob to match route files. This
   * should only be used if your files do not match '.js'.
   *
   * @param {object} config
   * @param {string|null} logger
   * @param {*[]} modules
   * @param {string|null} routesDir
   * @param {string} routesGlob
   */
  constructor ({
    config = {},
    logger = null,
    modules = [],
    routesDir = null,
    routesGlob = '**/*.js',
  } = {}) {
    super();

    /* Routing paths */
    this.routing = {
      routes: [],
      sockets: [],
    };

    /* Array of injected modules */
    this.modules = [];

    /* Store the config object */
    this.config = config;

    this.injector = new Injector();

    /* Register system components */
    this.injector.registerComponent({
      name: '$injector',
      instance: this.injector,
    }).registerComponent({
      name: '$config',
      instance: this.config,
    });

    /* Add the plugins and modules */
    modules.forEach(module => this.addModule(module));

    /* Register all the modules to the injector */
    this.modules.forEach(module => this.injector.register(module));

    /* Is there a logger set? */
    if (logger) {
      /* Yes - get the logger and set to here */
      this.injector.process((log) => {
        /* Create as a closure */
        this.logger = (...args) => log.trigger(...args);
      }, [
        logger,
      ]);
    } else {
      /* No logger - use a noop */
      this.logger = _.noop;
    }

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
   * in the IoC as value of Steeplejack.outputHandlerName.
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

    /* Run the server factory through the injector */
    this.server = this.injector.process(factory, deps);

    /* Add in the logger to the server class */
    this.server.log = this.logger;

    /* Create the outputHandler and register to injector if not already done */
    if (!this.injector.getComponent(Steeplejack.outputHandlerName)) {
      this.createOutputHandler(this.server);
    }

    /* Process the routes through the injector */
    const processedRoutes = processRoutes(this.injector, this.routeFactories);

    /* Get list of routes */
    this.server
      .on('routeAdded', (httpMethod, route) => {
        this.routing.routes.push(`${httpMethod}:${route}`);
      })
      .on('socketAdded', (socketName, event) => {
        this.routing.sockets.push(`${socketName}:${event}`);
      });

    /* Add in the routes to the server */
    this.server
      .addRoutes(processedRoutes.routes.routes)
      .addSockets(processedRoutes.sockets.routes)
      /* Add in the post route middleware */
      .middleware
      .afterUse
      .forEach(fn => this.server.use(...fn()));

    /* Listen for close events */
    this.on('close', () => {
      this.server.close();
    });

    /* Start the server */
    this.server.start()
      .then(() => {
        /* Output current config */
        this.logger('info', 'Config', JSON.stringify(this.config, null, 2));
        this.logger('info', 'Routes', JSON.stringify(this.routing.routes, null, 2));
        this.logger('info', 'Sockets', JSON.stringify(this.routing.sockets, null, 2));

        /* Notify that we've started */
        this.emit('start', this);
      });

    return this;
  }

  /**
   * Output Handler Name
   *
   * This is the name of the output in the
   * IoC container
   *
   * @returns {string}
   */
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
   * @param {string} logger
   * @param {Array} modules
   * @param {string} routesDir
   * @param {string} routesGlob
   * @return {Steeplejack}
   */
  static app ({
    config = {},
    env = {},
    logger = undefined,
    modules = undefined,
    routesDir = undefined,
    routesGlob = undefined,
  } = {}) {
    /* Pull in the parameters from the command line */
    const cliArgs = cliParameters(...yargs.argv._);

    /* Merge config and envvars */
    config = _.merge(config, replaceEnvVars(env));

    /* Merge config and command line arguments */
    config = _.merge(config, cliArgs);

    return new Steeplejack({
      config,
      logger,
      modules,
      routesDir,
      routesGlob,
    });
  }

}

module.exports = Steeplejack;
