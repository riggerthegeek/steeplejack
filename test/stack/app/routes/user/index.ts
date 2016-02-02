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
                (req: any, res: any) => {

                    $output(() => {

                        return $userController.getUser();

                    }, req, res);

                }
            ]

        }

    };

};
