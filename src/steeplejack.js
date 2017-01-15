/**
 * steeplejack
 */

/* Node modules */

/* Third-party modules */
import { Base } from '@steeplejack/core';
import { _ } from 'lodash';
import yargs from 'yargs';

/* Files */
import cliParameters from './helpers/cliParameters';
import replaceEnvVars from './helpers/replaceEnvVars';

export default class Steeplejack extends Base {

  get config () {
    return this._config || {};
  }

  set config (config) {
    if (_.isObject) {
      this._config = config;
    }
  }

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
   * @param {string[]|plugin[]} modules
   * @param {string} routesDir
   * @param {string} routesGlob
   */
  constructor (config = {}, modules = [], routesDir = null, routesGlob = '**/*.js') {

    super();

    /* Store the config object */
    this.config = config;

  }

  /**
   * Run
   *
   * Sets up the server and runs the application. Must
   * receive a function which configures the server
   * instance.
   *
   * @param {function} factory
   * @return {Steeplejack}
   */
  run (factory) {

    if (_.isFunction(factory) === false) {
      throw new TypeError("Steeplejack.run must receive a factory to create the server");
    }

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
   * @param {Array} modules
   * @param {string} routesDir
   * @param {string} routesGlob
   * @return {Steeplejack}
   */
  static app ({config = {}, env = {}, modules = undefined, routesDir = undefined, routesGlob = undefined }) {

    /* Pull in the parameters from the command line */
    let cliArgs = cliParameters(...yargs.argv._);

    /* Merge config and envvars */
    config = _.merge(config, replaceEnvVars(env));

    /* Merge config and command line arguments */
    config = _.merge(config, cliArgs);

    return new Steeplejack(config, modules, routesDir, routesGlob);

  }

}
