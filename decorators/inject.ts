/**
 * inject
 */

/// <reference path="../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export const injectFlag = "__INJECT__";
export const injectName = "__NAME__";


export let Inject = (name: string, ...inject: string[]) => {
    return (constructor: any) => {

        Object.defineProperties(constructor, {
            [injectName]: {
                value: name
            },
            [injectFlag]: {
                value: inject
            }
        });

    };
};
