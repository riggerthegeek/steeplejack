/**
 * modelGetter
 */

/// <reference path="../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import {data as datatypes} from "datautils";


/* Files */
import {Definition} from "./definition";
import {getFnName} from "./helpers";


/**
 * Model Getter
 *
 * This is the get function on the model
 * data. This is in it's own file to
 * reduce the complexity of the section.
 *
 * @param {string} key
 * @returns {function(any): undefined}
 */
export function modelGetter (definition: Definition, key: string) {

    return function () {

        let customFunc = getFnName("get", key);

        if (_.isFunction((<any>this)[customFunc])) {

            return (<any>this)[customFunc]();

        } else {

            if (_.has(this._data, key)) {
                return this._data[key];
            } else {
                return definition.value;
            }

        }

    };

}
