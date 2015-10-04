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

function iterator (tasks) {
    var makeCallback = function (index) {
        var fn = function () {
            if (tasks.length) {
                tasks[index].apply(null, arguments);
            }
            return fn.next();
        };
        fn.next = function () {
            return (index < tasks.length - 1) ? makeCallback(index + 1) : null;
        };
        return fn;
    };
    return makeCallback(0);
};

/**
 * Simple version of async.waterfall
 * @param {array} tasks
 * @param {function} callback
 */
function waterfall (tasks, callback) {
    callback = callback || function () {};
    if (tasks instanceof Array === false) {
        var err = new Error("First argument to waterfall must be an array of functions");
        return callback(err);
    }
    if (!tasks.length) {
        return callback();
    }
    var wrapIterator = function (iterator) {
        return function (err) {
            if (err) {
                callback.apply(null, arguments);
                callback = function () {};
            }
            else {
                var args = Array.prototype.slice.call(arguments, 1);
                var next = iterator.next();
                if (next) {
                    args.push(wrapIterator(next));
                }
                else {
                    args.push(callback);
                }
                process.nextTick(function () {
                    iterator.apply(null, args);
                });
            }
        };
    };
    wrapIterator(iterator(tasks))();
}


function isLessThan (version, requiredVersion) {

    version = version.split(".");
    requiredVersion = requiredVersion.split(".");

    if (requiredVersion[0] > version[0]) {
        /* Major version bigger */
        return true;
    } else if (requiredVersion[0] < version[0]) {
        /* Major version smaller */
        return false;
    }

    if (requiredVersion[1] > version[1]) {
        /* Minor version bigger */
        return true;
    } else if (requiredVersion[1] < version[1]) {
        /* Minor version smaller */
        return false;
    }

    if (requiredVersion[2] > version[2]) {
        /* Patch bigger */
        return true;
    } else if (requiredVersion[2] < version[2]) {
        /* Patch smaller */
        return false;
    }

    /* Identical */
    return false;

}




waterfall([
    function (callback) {
        /* Get the npm version */
        getNpmVersion(callback);
    },
    function (version, callback) {

        /* Is it lower than the minVersion? */
        if (isLessThan(version, minVersion) === false) {
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

            if (isLessThan(version, minVersion)) {
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
