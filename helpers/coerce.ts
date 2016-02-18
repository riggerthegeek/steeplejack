/**
 * Coerce
 *
 * Coerces the value into it's datatype
 */

/// <reference path="../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


const IS_NUMBER = /^(\-)?(\d+(\.\d+)?)$/;


export function coerce (value: string) : any {

    let coercedValue: any = value;

    if (value.match(IS_NUMBER)) {
        coercedValue = Number(value);
    } else {

        switch (value) {

            case "true":
                coercedValue = true;
                break;

            case "false":
                coercedValue = false;
                break;

            case "null":
                coercedValue = null;
                break;

        }

    }

    return coercedValue;

}
