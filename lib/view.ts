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


    protected _headers: any = {};


    protected _statusCode: number = null;


    protected _template: string = null;


    public constructor ({
        data,
        headers,
        statusCode,
        template
    }: {
        data: any,
        headers: any,
        statusCode: number,
        template: string
    }) {

        super();

        this._data = data;
        this._headers = headers;
        this._statusCode = statusCode;
        this._template = template;

    }


    /**
     * Get Headers
     *
     * Returns the headers
     *
     * @returns {any}
     */
    public getHeaders () : any {
        return this._headers;
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
     * Get Status Code
     *
     * Gets the status code
     *
     * @returns {number}
     */
    public getStatusCode () : number {
        return this._statusCode;
    }


    /**
     * Get Render Template
     *
     * Gets the template to render to
     *
     * @returns {string}
     */
    public getRenderTemplate () : string {
        return this._template;
    }


    /**
     * Render
     *
     * Factory to create a View object
     *
     * @param {string} template
     * @param {*} data
     * @param {number} statusCode
     * @param {*} headers
     * @returns {View}
     */
    public static render (template: string, data: any, statusCode: number = null, headers: any = {}) {

        return new View({
            data,
            headers,
            statusCode,
            template
        });

    }


}
