/**
 * Plugin
 *
 * Manages the registration and use of a steeplejack
 * plugin.  This is so that whole sections of code,
 * written in steeplejack-friendly syntax, can be
 * exported as a separate package and reused.
 *
 * Isn't DRY code marvellous?
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {Base} from "./base";
import {IPlugin} from "../interfaces/plugin";


export class Plugin extends Base implements IPlugin {


    private _modules: any[] = [];


    public constructor (files: any = null) {

        super();

        /* Set the module files */
        this.modules = files;

    }


    /**
     * Modules
     *
     * Gets the modules array
     *
     * @returns {any[]}
     */
    public get modules () {

        return this._modules;

    }


    /**
     * Modules
     *
     * Sets the modules to be included with this
     * plugin
     *
     * @param {*} module
     */
    public set modules (module: any) {

        if (_.isArray(module)) {

            /* Array of modules - cycle through */
            _.each(module, mod => {
                this.modules = mod;
            });

        } else if (_.isUndefined(module) === false && _.isNull(module) === false) {

            this._modules.push(module);

        }

    }


}
