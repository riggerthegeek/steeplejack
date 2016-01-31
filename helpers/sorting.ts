/**
 * sorting
 */

/// <reference path="../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


/**
 * Sort ASC
 *
 * Allows sorting in ascending order
 *
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */
export function sortAsc (a: any, b: any) : number {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}


/**
 * Sort DESC
 *
 * Allows sorting in descending order
 *
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */
export function sortDesc (a: any, b: any) : number {
    if (a < b) {
        return 1;
    } else if (a > b) {
        return -1;
    } else {
        return 0;
    }
}
