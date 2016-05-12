/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export const socket = () => {

    return {

        connect: (conn) => {

            setTimeout(() => {
                conn.disconnect();
            }, 500);

        }

    };

};
