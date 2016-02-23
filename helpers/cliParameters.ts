/**
 * CLI Parameters
 *
 * Bundles the CLI parameters into a single object
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {coerce} from "./coerce";
import {IDecodedParameter} from "../interfaces/decodedParameter";


export function cliParameters (...input: string[]) : any {

    if (_.isEmpty(input)) {
        return {};
    }

    let obj: any = {};

    _.each(input, param => {

        let decoded = decodeParams(param);

        if (_.isUndefined(decoded) === false) {

            if (_.has(obj, decoded.param)) {
                _.merge(obj[decoded.param], decoded.value);
            } else {
                obj[decoded.param] = decoded.value;
            }

        }

    });

    return obj;


}


export function decodeParams (input: string) : IDecodedParameter {

    if (_.isString(input) === false) {
        return;
    }

    let param: string;
    let value: any;

    /* Check for object notation */
    if (input.match(/\.([\s\w]+)(\=)/) !== null) {

        let elements = input.split(".");

        _.each(elements, (element, key) => {

            if (key > 1) {
                elements[1] += "." + element;
            }

        });

        elements = elements.splice(0, 2);

        /* Set the parameter name */
        param = elements[0];

        /* Decode further parameters */
        let parsedParams = decodeParams(elements[1]);

        value = {};

        value[parsedParams.param] = parsedParams.value;


    } else {

        /* Check for an equals sign */
        if (input.match(/=/) === null) {

            /* None - default value to true */
            param = input;
            value = true;

        } else {

            /* Present - treat as key/value pair */
            let tmp: string[] = input.split("=", 2);

            param = tmp[0];
            value = coerce(tmp[1].trim());

        }

    }

    /* Clean up any whitespace in the param */
    param = param.trim();


    /* Return the pairs */
    return {
        param,
        value
    };

}
