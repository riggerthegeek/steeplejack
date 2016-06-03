/**
 * view
 */

/// <reference path="../typings/index.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Base} from "./base";


export class View extends Base {


    protected _data: any = {};


    protected _template: string = null;


    public constructor ({ template, data }: { template: string, data: any }) {

        super();

        this._template = template;
        this._data = data;

    }


    /**
     * Get Render Data
     *
     * Gets the render data
     *
     * @returns {*}
     */
    public getRenderData () : any {
        return this._data;
    }


    /**
     * Get Render Template
     *
     * Gets the template to render to
     *
     * @returns {string}
     */
    public getRenderTemplate () : any {
        return this._template;
    }


    /**
     * Render
     *
     * Factory to create a View object
     *
     * @param {string} template
     * @param {*} data
     * @returns {View}
     */
    public static render (template: string, data: any) {

        return new View({
            template,
            data
        });

    }


}
