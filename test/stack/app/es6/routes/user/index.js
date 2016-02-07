/**
 * index
 */


"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export let route = ($userController, $output) => {

    return {

        "/": {

            get: [
                (req, res, next) => {

                    /* Simulate a valid bearer token */
                    if (req.headers.authorization !== "bearer valid") {
                        res.send(401);
                        return;
                    }

                    next();

                },
                (req, res) => {

                    $output(req, res, () => {
                        return $userController.getUser("1");
                    });

                }
            ],

            post: [
                (req, res, next) => {

                    /* Simulate a valid bearer token */
                    if (req.headers.authorization !== "bearer valid") {
                        res.send(401);
                        return;
                    }

                    next();

                },
                (req, res) => {
                    $output(req, res, () => {
                        return $userController.createUser(req.body);
                    });
                }
            ]

        }

    };

};
