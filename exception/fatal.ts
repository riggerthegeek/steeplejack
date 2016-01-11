/**
 * fatal
 */

/// <reference path="../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Exception} from "./";


/**
 * Fatal
 *
 * This is an error that cannot be recovered from. This
 * is likely to be either when a datastore cannot respond
 * or similar. Ultimately, this would return an HTTP 503
 * error (or equivalent).
 */
export class FatalException extends Exception {


    get type () {
        return "FATAL";
    }


}
