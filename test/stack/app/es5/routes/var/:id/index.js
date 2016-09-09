/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


exports.route = function () {

    return {

        "/": {

            get: function (request) {
                return request.params;

            }

        }

    };

};
