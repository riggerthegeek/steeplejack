/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


exports.route = function ($userController, $output) {

    return {

        "/": {

            get: [
                function (req, res, next) {

                    /* Simulate a valid bearer token */
                    if (req.headers.authorization !== "bearer valid") {
                        res.send(401);
                        return;
                    }

                    next();

                },
                function (req, res) {

                    $output(req, res, function () {
                        return $userController.getUser("1");
                    });

                }
            ],

            post: [
                function (req, res) {
                    $output(req, res, function () {
                        return ["hello"];
                    });
                }
            ]

        }

    };

};
