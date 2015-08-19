/**
 * CLI Parameters
 *
 * Bundles the CLI parameters into a single object
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var datatypes = require("datautils").data;


/* Files */
var coerce = require("./coerce");


/**
 * Decode Params
 *
 * Decodes the parameters into a param and
 * value object
 *
 * @param {string} input
 * @returns {object}
 */
function decodeParams (input) {

    var tmp = datatypes.setString(input, null);

    var param;
    var value;

    if (tmp === null) {
        return;
    }

    /* Check for object notation */
    if (tmp.match(/\.([\s\w]+)(\=)/) !== null) {
        tmp = tmp.split(".");

        for (var i = 0; i < tmp.length; i++) {
            if (i > 1) {
                tmp[1] += "." + tmp[i];
            }
        }
        tmp = tmp.splice(0, 2);

        param = tmp[0];

        var parsedParams = decodeParams(tmp[1]);
        value = {};

        value[parsedParams.param] = parsedParams.value;

    } else {

        /* Check for = */
        if (tmp.match(/\=/) === null) {
            param = tmp;
            value = true;
        } else {
            tmp = tmp.split("=", 2);

            param = tmp[0];
            value = coerce(tmp[1].trim());
        }

    }

    param = param.trim();

    /* Store the value */
    return {
        param: param,
        value: value
    };

}


/**
 * Parse Params
 *
 * Parses the parameters into a usable object
 * @param {array} input
 * @returns {object}
 */
function parseParams (input) {

    input = datatypes.setArray(input, []);

    if (_.isEmpty(input)) {
        return {};
    }

    var obj = {};
    for (var i = 0; i < input.length; i++) {

        var tmp = decodeParams(input[i]);

        if (_.isUndefined(tmp)) {
            continue;
        }

        if (obj[tmp.param]) {
            _.merge(obj[tmp.param], tmp.value);
        } else {
            obj[tmp.param] = tmp.value;
        }

    }

    return obj;

}


function cliParameters () {

    /* Convert arguments to an array */
    var input = Array.prototype.slice.call(arguments);

    return parseParams(input);

}


module.exports = cliParameters;
