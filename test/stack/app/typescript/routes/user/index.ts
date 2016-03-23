/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export let route = ($userController: any) => {

    return {

        "/": {

            get: (request: any) => {

                /* Simulate a valid bearer token */
                if (request.headers.authorization !== "bearer valid") {
                    return 401;
                }

                return $userController.getUser("1");

            },

            post: (request: any) => {
                /* Simulate a valid bearer token */
                if (request.headers.authorization !== "bearer valid") {
                    return 401;
                }

                return $userController.createUser(request.body);
            }

        }

    };

};


export let socket = () => {

    return {

        connect: [
            (request: any) => {

                console.log(request);

            }
        ],

        chat: [
            (request: any) => {

                return 222;
                
            },
            (value: Number) => {
                
                console.log(value);
                process.exit();
                
            }
        ]

    };

};
