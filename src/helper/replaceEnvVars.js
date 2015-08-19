/**
 * Replace Env Vars
 *
 * Looks for a matching environment variable and
 * puts it into the object
 *
 * @param {object} obj
 * @returns {object}
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");


/* Files */
var coerce = require("./coerce");



function replaceEnvVars(obj) {

    for (var k in obj) {
        var envvar = obj[k];
        if (_.isPlainObject(envvar)) {
            replaceEnvVars(envvar);
        } else {
            if (_.has(process.env, envvar)) {
                /* Replace the value */
                var tmp = process.env[envvar];

                obj[k] = coerce(tmp);
            } else {
                delete obj[k];
            }
        }
    }

    return obj;

}


module.exports = replaceEnvVars;
