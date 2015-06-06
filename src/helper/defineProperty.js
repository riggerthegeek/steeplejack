/**
 * defineProperty
 */

"use strict";


/* Node modules */


/* Third-party modules */
var datatypes = require("datautils").data;


/* Files */


/**
 * Define Property
 *
 * @param {object} obj
 * @param {string} name
 * @param {*} value
 */
module.exports = function defineProperty (obj, name, value) {

    obj = datatypes.setObject(obj, null);
    name = datatypes.setString(name, null);

    Object.defineProperty(obj, name, {
        value: value,
        writable: true,
        enumerable: name.match(/^\_/) === null,
        configurable: true
    });

};
