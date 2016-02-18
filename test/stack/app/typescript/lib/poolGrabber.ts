/**
 * poolGrabber
 */

"use strict";


/* Node modules */


/* Third-party modules */
let Bluebird = require("bluebird");


/* Files */


export module __factory {

    export const name = "$poolGrabber";

    export let factory = () => {

        return (resource: any, iterator: any) => {

            var defer = Bluebird.defer();

            resource.acquire((err: any, db: any) => {

                if (err) {
                    return defer.reject(err);
                }

                return iterator(db)
                    .then((result: any) => {
                        defer.resolve(result);
                    })
                    .finally(() => {
                        resource.release(db);
                    });

            });

            return defer.promise;

        };

    };

}
