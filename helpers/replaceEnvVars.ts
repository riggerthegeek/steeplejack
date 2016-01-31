/**
 * Replace Env Vars
 *
 * Looks for a matching environment variable and
 * puts it into the object
 */

/// <reference path="../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {coerce} from "./coerce";


export function replaceEnvVars (obj: any) {

    _.each(obj, (envVar, key) => {

        if (_.isPlainObject(envVar)) {
            replaceEnvVars(envVar);
        } else {

            if (_.has(process.env, envVar)) {

                /* Replace the value with the envVar */
                let tmp = process.env[envVar];

                obj[key] = coerce(tmp);

            } else {
                /* No known envvar - delete it */
                delete obj[key];
            }

        }

    });

    return obj;

}
