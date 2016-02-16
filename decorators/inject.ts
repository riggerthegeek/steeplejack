/**
 * inject
 */

/// <reference path="../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Injector} from "../lib/injector";


export const injectFlag = "__INJECT__";


export let Inject = (config: IInjectDecorator) => {

    return (constructor: any) => {

        /* See if dependencies are specified in config */
        if (!config.deps) {
            /* No, check for dependencies in the constructor */
            config.deps = Injector.getTargetDependencies(constructor).dependencies;
        }

        /* Define the injector stuff */
        Object.defineProperty(constructor, injectFlag, {
            value: {
                name: config.name,
                deps: config.deps,
                factory: config.factory || false
            }
        });

    };

};
