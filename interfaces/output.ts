/**
 * output
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {Promise} from "es6-promise";


/* Files */


export interface IOutput {
    (
        request: Object,
        response: Object,
        fn: () => void
    ) : Promise<any>;
}
