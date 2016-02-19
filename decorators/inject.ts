/**
 * inject
 *
 * Simplified the formatting of classes ready for
 * registering with the injector.
 */

/// <reference path="../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {Injector} from "../lib/injector";


export const injectFlag = "__INJECT__";


export let Inject = (config: ISteeplejack.IInjectDecorator) => {

    return (constructor: any) => {

        let factory = _.isBoolean(config.factory) ? config.factory : false;

        /* See if dependencies are specified in config */
        if (!config.deps && !factory) {
            /* No, check for dependencies in the constructor */
            config.deps = Injector.getTargetDependencies(constructor).dependencies;
        }

        /* Define the injector stuff */
        Object.defineProperty(constructor, injectFlag, {
            value: {
                name: config.name,
                deps: config.deps || [],
                factory: factory
            }
        });

    };

};
