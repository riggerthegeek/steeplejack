/**
 * npm
 *
 * The minimum version of npm that this package
 * requires is v1.4.8.  This is the standard in
 * 0.10, but not in 0.8.  This installs if it
 * it's not present
 */

"use strict";


/* Node modules */
var child = require("child_process");


/* Third-party modules */
var async = require("async");
var semver = require("semver");


/* Files */


var minVersion = "1.4.8";



function getNpmVersion (cb) {
    child.exec("npm --version", function (err, stdout, stderr) {

        if (err) {
            cb(err);
            return;
        }

        /* Clear out line breaks */
        var version = stdout.split("\n")[0];

        cb(null, version);

    });
}




async.waterfall([
    function (callback) {
        /* Get the npm version */
        getNpmVersion(callback);
    },
    function (version, callback) {

        /* Is it lower than the minVersion? */
        if (semver.lt(version, minVersion) === false) {
            /* No - nothing to do */
            callback(null);
            return;
        }

        /* Install min version of npm */
        child.exec("npm install -g npm@" + minVersion, function () {

            /* Always continue here */
            callback(null);

        });
    },
    function (callback) {

        /**
         * Get installed version - if meets
         * minimum version, we've passed.
         * This is due to warnings coming out
         * in err/stderr when it's worked.
         */

        getNpmVersion(function (err, version) {

            if (err) {
                callback(err);
                return;
            }

            if (semver.lt(version, minVersion)) {
                /* Not worked */
                callback("Unable to install");
                return;
            }

            callback(null, version);

        });

    }
], function (err, version) {

    if (err) {
        throw err;
    }

    console.log("npm v" + version + " installed");

});
