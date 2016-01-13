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
 * Get Fn Name
 *
 * Gets the internal function name for extending
 * a setter/getter.
 *
 * @param {string} prefix
 * @param {string} keyName
 * @returns {string}
 */
export function getFnName (prefix: string, keyName: string) {
    return _.camelCase(`${prefix}_${keyName}`);
}


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
