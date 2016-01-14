/**
 * helpers
 */

/// <reference path="../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */


/**
 * Data Casting
 *
 * The functions to use when casting the
 * data types
 *
 * @type {{
 *     array: string,
 *     boolean: string,
 *     date: string,
 *     float: string,
 *     integer: string,
 *     object: string,
 *     string: string
 * }}
 */
export const dataCasting = {
    array: "setArray",
    boolean: "setBool",
    date: "setDate",
    float: "setFloat",
    integer: "setInt",
    object: "setObject",
    string: "setString"
};


/**
 * Get Fn Name
 *
 * Gets the internal function name for extending
 * a setter/getter.
 *
 * Allows for setting of protected names with a
 * preceding underscore.
 *
 * @param {string} prefix
 * @param {string} keyName
 * @returns {string}
 */
export function getFnName (prefix: string, keyName: string) {
    keyName = _.capitalize(keyName);
    return prefix + keyName;
}


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
