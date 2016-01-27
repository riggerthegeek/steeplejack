/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export let route = ($output: any) => {

    return {

        "/": {

            get: (req: any, res: any) => {

                $output(() => {
                    return {
                        sync: "result"
                    };
                }, req, res);

            }

        }

    };

};
