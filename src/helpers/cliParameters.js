/**
 * cliParameters
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';

/* Files */
import decodeParams from './decodeParams';

export default (...input) => {

  if (_.isEmpty(input)) {
    return {};
  }

  const obj = {};

  _.each(input, param => {

    const decoded = decodeParams(param);

    if (_.isUndefined(decoded) === false) {

      if (_.has(obj, decoded.param)) {
        _.merge(obj[decoded.param], decoded.value);
      } else {
        obj[decoded.param] = decoded.value;
      }

    }

  });

  return obj;

}
