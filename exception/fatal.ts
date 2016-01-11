/**
 * fatal
 */

/// <reference path="../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Exception} from "./";


export class FatalException extends Exception {


    get type () {
        return "FATAL";
    }


}
