/**
 * decodeParams
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';

/* Files */
import coerce from './coerce';

const decodeParams = (input) => {
  if (_.isString(input) === false) {
    return undefined;
  }

  let param;
  let value;

  /* Check for object notation */
  if (input.match(/\.([\s\w]+)(=)/) !== null) {
    let elements = input.split('.');

    _.each(elements, (element, key) => {
      if (key > 1) {
        elements[1] += `.${element}`;
      }
    });

    elements = elements.splice(0, 2);

    /* Set the parameter name */
    param = elements[0];

    /* Decode further parameters */
    const parsedParams = decodeParams(elements[1]);

    value = {};

    value[parsedParams.param] = parsedParams.value;
  } else if (input.match(/=/) === null) {
    /* No equals sign - default value to true */
    param = input;
    value = true;
  } else {
    /* Equals sign present - treat as key/value pair */
    const tmp = input.split('=', 2);

    param = tmp[0];
    value = coerce(tmp[1].trim());
  }

  /* Clean up any whitespace in the param */
  param = param.trim();

  /* Return the pairs */
  return {
    param,
    value,
  };
};

export default decodeParams;
