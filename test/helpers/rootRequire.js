/**
 * Root Require
 *
 * This is a convenience method that prefixes the require
 * path with the root path so as to help calling the
 * correct file.
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


global.rootRequire = function (file) {
    if (!file) { file = ""; }
    return require(require("path").join(process.cwd(), file));
};
