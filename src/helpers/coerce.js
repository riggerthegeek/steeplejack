/**
 * coerce
 */

/* Node modules */

/* Third-party modules */

/* Files */

const IS_NUMBER = /^(-)?(\d+(\.\d+)?)$/;

export default (value) => {
  let coercedValue = value;

  if (value.match(IS_NUMBER)) {
    coercedValue = Number(value);
  } else {
    if (value === 'true') {
      coercedValue = true;
    }

    if (value === 'false') {
      coercedValue = false;
    }

    if (value === 'null') {
      coercedValue = null;
    }
  }

  return coercedValue;
};
