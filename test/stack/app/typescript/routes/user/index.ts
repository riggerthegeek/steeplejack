/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export let route = ($userController: any, $output: any) => {

    return {

        "/": {

            get: [
                (req: any, res: any, next: any) => {

                    /* Simulate a valid bearer token */
                    if (req.headers.authorization !== "bearer valid") {
                        res.send(401);
                        return;
                    }

                    next();

                },
                (req: any, res: any) => {

                    $output(req, res, () => {
                        return $userController.getUser("1234");
                    });

                }
            ],

            post: [
                (req: any, res: any) => {
                    $output(req, res, () => {
                        return ["hello"];
                    });
                }
            ]

        }

    };

};
