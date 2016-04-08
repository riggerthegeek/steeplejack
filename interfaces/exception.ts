/**
 * exception
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export interface IException extends Error {
    message: string;
    type: string;
    getDetail: () => any;
    getHttpCode: () => number;

}
