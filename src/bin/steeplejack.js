/**
 * steeplejack
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import { _ } from 'lodash';
import yargs from 'yargs';

/* Files */
import cliParameters from '../helpers/cliParameters';
import replaceEnvVars from '../helpers/replaceEnvVars';

let version;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  version = require('../package').version;
} catch (err) {
  // eslint-disable-next-line global-require
  version = require('../../package').version;
}

/**
 * Display Config
 *
 * This displays the config object, mixing the config file,
 * the envvars and the command line arguments.
 *
 * @param {object} argv
 */
function displayConfig (argv) {
  if (!argv.config) {
    throw new Error('config file location is a required argument');
  }

  /* Resolve the full path */
  const config = path.join(process.cwd(), argv.config);
  let env;
  if (argv.env) {
    env = path.join(process.cwd(), argv.env);
  }

  /* Get the files we're after */
  const obj = {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    config: require(config),
    env: undefined,
  };

  if (env) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    obj.env = require(env);
  }

  const args = _.tail(argv._);

  /* Pull in the parameters from the command line */
  const cliArgs = cliParameters(...args);

  let output = obj.config;

  /* Merge config and envvars */
  if (obj.env) {
    output = _.merge(output, replaceEnvVars(obj.env));
  }

  /* Get any command line args */
  output = _.merge(output, cliArgs);

  /* Output the resolved config */
  console.log(JSON.stringify(output, null, argv.format ? 2 : 0)); // eslint-disable-line no-console
}

export default yargs
  .usage('$0 <cmd> [args]')
  .command('config <config> [env] [format]', 'Display the config JSON for the current environment', {
    format: {
      default: true,
      type: 'boolean',
    },
  }, displayConfig)
  .version(() => version)
  .help()
  .argv;
