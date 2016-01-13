/**
 * modelSetter
 */

/// <reference path="../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import {data as datatypes} from "datautils";


/* Files */
import {Definition} from "./definition";
import {dataCasting, getFnName} from "./helpers";


/**
 * Model Setter
 *
 * This is the set function on the model
 * data. This is in it's own file to
 * reduce the complexity of the section.
 *
 * @param {Definition} definition
 * @param {string} key
 * @returns {function(any): undefined}
 */
export function modelSetter (definition: Definition, key: string) {

    return function (value: any) {

        let customFunc = getFnName("set", key);
        let defaultValue = definition.value;

        if (_.isFunction((<any>this)[customFunc])) {

            value = (<any>this)[customFunc](value, defaultValue);

        } else {

            let type = definition.type;

            switch (type) {

                case "enum":
                    value = datatypes.setEnum(value, definition.enum, defaultValue);
                    break;

                case "mixed":
                    if (_.isUndefined(value)) {
                        value = defaultValue;
                    }
                    break;

                default:
                    if (_.has(dataCasting, type)) {

                        let fnName:string = (<any>dataCasting)[type];
                        let fn:Function = (<any>datatypes)[fnName];

                        value = fn(value, defaultValue);

                    } else {
                        /* Error */
                    }
                    break;
            }

        }

        this._data[key] = value;

    };

}