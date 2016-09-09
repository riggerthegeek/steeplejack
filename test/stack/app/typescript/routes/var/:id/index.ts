/**
 * route
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export const route = () => {

    return {

        "/": {

            get (request: any) {
                return request.params;
            }

        }

    };

};
