/**
 * poolGrabber
 */


"use strict";


/* Node modules */


/* Third-party modules */
var Bluebird = require("bluebird");


/* Files */


exports.__factory = {

    name: "$poolGrabber",

    factory: function () {

        return function (resource, iterator) {

            var defer = Bluebird.defer();

            resource.acquire(function (err, db) {

                if (err) {
                    return defer.reject(err);
                }

                return iterator(db)
                    .then(function (result) {
                        defer.resolve(result);
                    })
                    .finally(function () {
                        resource.release(db);
                    });

            });

            return defer.promise;

        };

    }

};
