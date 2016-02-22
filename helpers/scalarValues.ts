/**
 * Scalar Values
 *
 * Converts objects to scalar values
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */


/**
 * Scalar Values
 *
 * Converts the objects to scalar values for
 * matching purposes
 *
 * @param {*} value
 * @returns {*}
 */
export function scalarValues (value: any) : any {

    if (_.isObject(value)) {
        /* Set objects to strings */
        if (_.isDate(value)) {
            value = value.toISOString();
        } else {
            value = JSON.stringify(value);
        }
    }

    return value;

}
