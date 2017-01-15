/**
 * coerce
 */

/* Node modules */

/* Third-party modules */

/* Files */

const IS_NUMBER = /^(\-)?(\d+(\.\d+)?)$/;

export default value => {

  let coercedValue = value;

  if (value.match(IS_NUMBER)) {
    coercedValue = Number(value);
  } else {

    switch (value) {

      case 'true':
        coercedValue = true;
        break;

      case 'false':
        coercedValue = false;
        break;

      case 'null':
        coercedValue = null;
        break;

    }

  }

  return coercedValue;

}
