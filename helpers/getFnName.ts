/**
 * getFnName
 */

/// <reference path="../typings/main.d.ts" />

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
