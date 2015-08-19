/**
 * Error
 *
 * This is the main error object for the framework. It
 * is an extension of the global Error object and can
 * be further extended
 *
 * @package steeplejack
 */

"use strict";


/* Node modules */
var util = require("util");


/* Third-party modules */
var _ = require("lodash");


/* Files */
var Base = require("../library/Base");
var extender = require("../helper/extender");

var datatypes = Base.datatypes;


function Exception (message) {

    Error.call(this);

    /* Search for and run the constructor function */
    if (_.isFunction(this._construct) === false) {
        this._construct = function () { };
    }

    /* Activate the constructor */
    this._construct.apply(this, arguments);

    var stack;
    if (message instanceof Error) {
        var err = message;
        message = err.message;
        stack = err.stack;
    } else {
        stack = (new Error()).stack;
    }

    this.message = datatypes.setString(message, "UNKNOWN_ERROR");

    this.stack = stack;

    if (_.isUndefined(this.type)) {
        throw new SyntaxError("Exception type must be set");
    }

    return this;

}


util.inherits(Exception, Error);


/**
 * Prototype methods
 */
_.extend(Exception.prototype, {

});


/**
 * Static methods
 */
_.extend(Exception, {


    /**
     * Extend
     *
     * Allows us to extend this object
     */
    extend: extender


});


module.exports = Exception;
