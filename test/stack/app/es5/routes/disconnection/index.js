/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


exports.socket = function () {

    return {

        connect: function (conn) {

            setTimeout(function () {
                conn.disconnect();
            }, 500);

        }

    };

};
