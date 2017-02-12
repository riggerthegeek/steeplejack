/**
 * replaceEnvVars
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';

/* Files */
import coerce from './coerce';

const replaceEnvVars = (obj) => {
  _.each(obj, (envVar, key) => {
    if (_.isPlainObject(envVar)) {
      replaceEnvVars(envVar);
    } else {
      /* Check if envvar passed in - begins "$" recursive */
      while (/^\$/.test(process.env[envVar])) {
        envVar = process.env[envVar]
          .replace(/^\$/, '');
      }

      if (_.has(process.env, envVar)) {
        /* Replace the value with the envVar */
        const tmp = process.env[envVar];

        obj[key] = coerce(tmp);
      } else {
        /* No known envvar - delete it */
        delete obj[key];
      }
    }
  });

  return obj;
};

export default replaceEnvVars;
