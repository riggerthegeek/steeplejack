/**
 * Fatal
 *
 * This is an error that cannot be recovered from. This
 * is likely to be either when a datastore cannot respond
 * or similar. Ultimately, this would return an HTTP 503
 * error (or equivalent).
 *
 * @package Exceptions
 */

"use strict";


/* Node modules */
var util = require("util");


/* Third-party modules */
var _ = require("lodash");
var datatypes = require("datautils").data;


/* Files */
var Exception = require("./Exception");


function FatalException () {

    this.type = "Fatal";

    Exception.apply(this, arguments);

}


util.inherits(FatalException, Exception);


_.extend(FatalException.prototype, {

});


module.exports = FatalException;
