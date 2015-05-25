/**
 * Logger
 *
 * Presents a consistent interface for the Logger
 * class.  Individual logger types (bunyan, log4js)
 * should extend this.  This can be thought of in
 * the same way as an abstracted class.
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var Base = require("./Base");
var datatypes = Base.datatypes;


module.exports = Base.extend({


    /**
     * Get Log Levels
     *
     * Gets the available logging levels
     *
     * @returns {string[]}
     */
    getLogLevels: function () {
        return [
            "fatal",
            "error",
            "warn",
            "info",
            "debug",
            "trace"
        ];
    },


    /**
     * Set Level
     *
     * Sets the log level. Defaults to "error"
     *
     * @param {string} level
     */
    setLevel: function (level) {

        /* Set the log level - default to error */
        level = datatypes.setEnum(level, this.getLogLevels(), "error");

        this._setLevel(level);

    },


    /**
     * Triggers
     *
     * This is in order, from most to least severe
     */


    /**
     * Fatal
     *
     * The most severe form of error
     *
     * @param {string} message
     * @returns {*}
     */
    fatal: function (message) {
        return this._trigger(6, message);
    },


    /**
     * Error
     *
     * @param {string} message
     * @returns {*}
     */
    error: function (message) {
        return this._trigger(5, message);
    },


    /**
     * Warn
     *
     * @param {string} message
     * @returns {*}
     */
    warn: function (message) {
        return this._trigger(4, message);
    },


    /**
     * Info
     *
     * @param {string} message
     * @returns {*}
     */
    info: function (message) {
        return this._trigger(3, message);
    },


    /**
     * Debug
     *
     * @param {string} message
     * @returns {*}
     */
    debug: function (message) {
        return this._trigger(2, message);
    },


    /**
     * Trace
     *
     * The least severe form of error
     *
     * @param {string} message
     * @returns {*}
     */
    trace: function (message) {
        return this._trigger(1, message);
    }


});
