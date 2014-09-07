/**
 * CLI Output
 *
 * Defines a callback that can be used to present data to the
 * command line interface
 *
 * @param {function} success
 * @returns {callback}
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var datatypes = require("datautils").data;


/* Files */


function cliOutput (success) {

    /* Create the callback using ReportBack */
    var cb = cliOutput.reportback();

    success = datatypes.setFunction(success, function (message) {
        /* Default success function - return a string */
        return datatypes.setString(message, "Task successfully executed");
    });

    /* Set the "invalid" exit to forward to "error" */
    cb.error = function (err) {

        var objError = datatypes.setInstanceOf(err, Error, null);

        /* Force instanceof Error */
        if (objError === null) {
            cb.log.error(err);
        } else {
            /* Display the error stack */
            cb.log.error(objError.stack);
        }

        /* Exit with error status code */
        process.exit(1);

    };

    cb.invalid = "error";

    /**
     * Output the success message
     */
    cb.success = function () {

        var out = success.apply(this, arguments);

        out = datatypes.setString(out, null);

        if (out === null) {
            throw new TypeError("Success output must be a string");
        }

        cb.log.info(out);

    };

    return cb;

}


/* Expose reportback so we can test this file */
_.extend(cliOutput, {

    reportback: require("reportback")().extend

});


module.exports = cliOutput;
