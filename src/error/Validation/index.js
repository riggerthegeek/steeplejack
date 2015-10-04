/**
 * Validation
 *
 * This is an error that can be recovered from.  Normally, this
 * would be invalid input from the client or similar.  Ultimately,
 * this would return something like an HTTP 400 error.
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var datatypes = require("datautils").data;


/* Files */
var Exception = require("../Exception");
var Detail = require("./Detail");


module.exports = Exception.extend({


    type: "Validation",


    _construct: function () {

        Object.defineProperty(this, "_errors", {
            value: {},
            enumerable: false
        });

    },



    /**
     * Add Error
     *
     * Add in a new error
     *
     * @param {string} key
     * @param {*} value
     * @param {string} message
     * @param {*} additional
     */
    addError: function (key, value, message, additional) {

        key = datatypes.setString(key, null);

        if (key === null) {
            throw new SyntaxError("KEY_MUST_BE_SET");
        }

        var err = Detail.toModel(value, message, additional);

        /* This will throw a SyntaxError if not valid to tell developer */
        err.validate();

        this._errors[key] = datatypes.setArray(this._errors[key], []);

        this._errors[key].push(err);

    },


    /**
     * Get Errors
     *
     * Gets the errors contained in this object.  Coverts
     * the Detail classes to object literals.
     *
     * @returns {array}
     */
    getErrors: function () {
        if (this.hasErrors()) {
            var err = {};
            _.each(this._errors, function (arr, key) {
                err[key] = [];

                for (var i = 0; i < arr.length; i++) {
                    err[key].push(arr[i].toDTO());
                }
            });
            return err;
        }
        return [];
    },


    /**
     * Has Errors
     *
     * Do we have any errors?
     *
     * @returns {boolean}
     */
    hasErrors: function () {
        return _.isEmpty(this._errors) === false;
    }


});
