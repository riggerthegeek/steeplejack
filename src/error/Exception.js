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
var stackTrace = require("stack-trace");


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

    var tmpStack;
    var reduceTrace = true;
    if (message instanceof Error) {
        var err = message;
        message = err.message;
        tmpStack = err.stack;
        reduceTrace = false;
    } else {
        tmpStack = (new Error()).stack;
    }

    this.message = Base.datatypes.setString(message, "UNKNOWN_ERROR");

    var trace = stackTrace.parse({
        stack: tmpStack
    });

    if (reduceTrace) {
        /* Ignore first two as they're in this file */
        trace.shift();
        trace.shift();
    }

    this.stackTrace = trace;

    this.fileName = this.getStackTrace(0).getFileName();
    this.lineNumber = this.getStackTrace(0).getLineNumber();
    this.stack = this._buildStackTrace();

    if (this.type === undefined) {
        throw new SyntaxError("Exception type must be set");
    }

    return this;

}


util.inherits(Exception, Error);


_.extend(Exception.prototype, {


    /**
     * Build Stack Trace
     *
     * Builds the stack trace string.  It mimics the
     * one in the Error class.
     *
     * @returns {string}
     * @private
     */
    _buildStackTrace: function () {

        var stack = ["Error"];
        for (var i = 0; i < this.stackTrace.length; i++) {
            var objTrace = this.getStackTrace(i);

            var tmp = "";
            for (var x = 0; x < 4; x++) {
                tmp += " ";
            }
            tmp += "at ";

            /* Build the error string */
            var hasFunction = false;
            if (objTrace.functionName !== null && objTrace.functionName !== "") {
                hasFunction = true;
                tmp += objTrace.functionName;
            } else if (objTrace.typeName !== null) {
                hasFunction = true;
                tmp += objTrace.typeName;
                tmp += ".";
                tmp += objTrace.methodName || "<anonymous>";
            }


            if (hasFunction) {
                tmp += " (";
            }
            tmp += objTrace.fileName;
            tmp += ":";
            tmp += objTrace.lineNumber;
            tmp += ":";
            tmp += objTrace.columnNumber;
            if (hasFunction) {
                tmp += ")";
            }

            stack.push(tmp);

        }

        return stack.join("\n");

    },


    /**
     * Get File Name
     *
     * Returns the file name and path of the file
     * that caused the error
     *
     * @returns {string}
     */
    getFileName: function () {
        return this.fileName;
    },


    /**
     * Get Line Number
     *
     * Returns the line number of the file that
     * caused the error
     *
     * @returns {integer}
     */
    getLineNumber: function () {
        return this.lineNumber;
    },


    /**
     * Get Message
     *
     * Returns the message set at instantiation
     *
     * @returns {string}
     */
    getMessage: function () {
        return this.message;
    },


    /**
     * Get Stack
     *
     * Returns the stack trace
     *
     * @returns {sting}
     */
    getStack: function () {
        return this.stack;
    },


    /**
     * Get Stack Trace
     *
     * Returns array of stack trace objects or a
     * specific array if param int is given
     *
     * @param {integer} int
     * @returns {array/object}
     */
    getStackTrace: function (int) {
        int = Base.datatypes.setInt(int, null);

        if (int === null) {
            /* Return everything */
            return this.stackTrace;
        } else {
            return this.stackTrace[int] || null;
        }
    },


    /**
     * Get Type
     *
     * Returns the type. This must be set by the developer
     * when extending this object
     *
     * @returns {string}
     */
    getType: function () {
        return this.type;
    }


});


_.extend(Exception, {


    /**
     * Extend
     *
     * Allows us to extend this object
     */
    extend: extender


});


module.exports = Exception;
