/**
 * Validation
 *
 * This handles the validation for the Definition
 * object
 *
 * @package DomainModel
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var validationutils = require("datautils").validation;


/* Files */
var Base = require("../Base");
var datatypes = Base.datatypes;


var Validation = Base.extend(null, {


    /**
     * Create Closure
     *
     * Creates a closure of the function.  This returns
     * another function with the parameters sets as an
     * array and pushes through to validation function.
     *
     * @param {function} rule
     * @param {*} params
     * @param {*} defaultValue
     * @param {boolean} isRequired
     * @returns {function}
     */
    createClosure: function (rule, params, defaultValue, isRequired) {

        /* Create closure with params */
        return function (objModel, value) {

            if (value === defaultValue && isRequired === false) {
                /* value is not set - don't run the rule */
                return true;
            } else {

                /* Add model as first parameter */
                var input = [objModel];

                /* Add value as second parameter */
                input.push(value);

                if (params !== undefined) {

                    /* Parameters set */
                    if (params instanceof Array) {
                        input = input.concat(params);
                    } else {
                        input.push(params);
                    }

                }

                /* Execute the function with parameters */
                return rule.apply(null, input);

            }

        };

    },


    /**
     * Generate Function
     *
     * Creates the Validation function for the DomainModel
     *
     * @param {object} obj
     * @param {*} defaultValue
     * @returns {function}
     */
    generateFunction: function (obj, defaultValue) {

        obj = datatypes.setObject(obj, {});

        if (_.isEmpty(obj)) {
            return null;
        }

        var rule;
        var ruleFn;

        var ruleType = typeof obj.rule;
        var err = null;

        switch (ruleType) {

            case "function":
            {
                /* We're passing a custom function to validate against */
                ruleFn = obj.rule;
                rule = "custom";
                break;
            }

            case "string":
            {
                /* Check for function in validation object */
                rule = obj.rule;

                if (rule === "match") {
                    /* Use the special match rule */
                    ruleFn = Validation.match;
                } else if (typeof validationutils[rule] !== "function") {
                    /* Developer has specified an invalid rule */
                    err = new SyntaxError(obj.rule + " is not a validation function");
                } else {
                    /* Valid rule in the validation utils package - ignore the model parameter */
                    ruleFn = function () {
                        var args = Array.prototype.slice.call(arguments);

                        /* Remove first element */
                        args.shift();

                        /* Execute the function */
                        return validationutils[rule].apply(null, args);
                    };
                }
                break;
            }

            default:
            {
                /* Not string or function - throw error */
                err = new SyntaxError(obj.rule + " is not a function or string");
                break;
            }

        }

        /* Search for error */
        if (err) {
            throw err;
        }

        /* Return a function */
        return Validation.createClosure(ruleFn, obj.param, defaultValue, rule === "required");

    },


    /**
     * Match
     *
     * A special rule that matches the given value
     * against the value for the given key in the
     * model
     *
     * @param {object} objModel
     * @param {*} value
     * @param {string} key
     * @returns {bool}
     */
    match: function (objModel, value, key) {

        var matchValue = objModel.get(key);

        if (value === matchValue) {
            return true;
        } else {
            var err = new Error("VALUE_DOES_NOT_MATCH");
            err.value = value;
            err.params = [matchValue];

            throw err;
        }

    }


});


module.exports = Validation;
