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

            get: function (request) {

                /* Simulate a valid bearer token */
                if (request.headers.authorization !== "bearer valid") {
                    return 401;
                }

                return $userController.getUser("1");

            },

            post: function (request) {

                /* Simulate a valid bearer token */
                if (request.headers.authorization !== "bearer valid") {
                    return 401;
                }

                return $userController.createUser(request.body);

            }

        }

    };

};
