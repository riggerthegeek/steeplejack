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
                $output(() => {
                    return $userController.getUser();
                })
            ],

            post: [
                $output(() => {
                    return ["hello"];
                })
            ]

        }

    };

};
