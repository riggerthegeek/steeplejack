/**
 * poolGrabber
 */


"use strict";


/* Node modules */


/* Third-party modules */
import Bluebird from "bluebird";


/* Files */


exports.__factory = {

    name: "$poolGrabber",

    factory: () => {

        return (resource, iterator) => {

            var defer = Bluebird.defer();

            resource.acquire((err, db) => {

                if (err) {
                    return defer.reject(err);
                }

                return iterator(db)
                    .then((result) => {
                        defer.resolve(result);
                    })
                    .finally(() => {
                        resource.release(db);
                    });

            });

            return defer.promise;

        };

    }

};
