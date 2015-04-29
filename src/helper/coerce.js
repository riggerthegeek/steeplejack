/**
 * Coerce
 *
 * Coerces the value into it's datatype
 *
 * @param {string} value
 * @returns {*}
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


module.exports = function (value) {

    if (value.match(/^(\-)?(\d+(\.\d+)?)$/)) {
        value = Number(value);
    } else {
        switch (value) {

            case "true":
            {
                value = true;
                break;
            }

            case "false":
            {
                value = false;
                break;
            }

            case "null":
            {
                value = null;
                break;
            }

        }
    }

    return value;

};
