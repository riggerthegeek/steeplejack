/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


exports.route = function ($userController) {

    return {

        "/": {

            get: [
                function (obj) {

                    /* Simulate a valid bearer token */
                    if (obj.request.headers.authorization !== "bearer valid") {
                        return 401;
                    }

                    return $userController.getUser("1");

                }
            ],

            post: [
                function (obj) {

                    /* Simulate a valid bearer token */
                    if (obj.request.headers.authorization !== "bearer valid") {
                        return 401;
                    }

                    return $userController.createUser(obj.request.body);

                }
            ]

        }

    };

};
