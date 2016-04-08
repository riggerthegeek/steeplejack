/**
 * Exception
 *
 * This is the main error object for the library. It
 * is an extension of the global Error object and can
 * be extended infinitely.
 *
 * This is an abstract class and can't be instantiated
 * directly - it must be extended.
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {extender} from "../helpers/extender";
import {IException} from "../interfaces/exception";


export abstract class Exception extends Error implements IException {


    public __construct: Function;


    public message: string = "UNKNOWN_ERROR";


    public type: string;


    /**
     * Constructor
     *
     * Adds in a check for the _construct function,
     * to be called if this class is created using
     * the .extend() static method.
     *
     * @param {*} message
     * @param {*} args
     */
    public constructor (message: any = null, ...args: any[]) {

        /* Call the parent class */
        super();

        /* Call the ES5 constructor */
        if (_.isFunction(this.__construct)) {
            this.__construct(message, ...args);
        }

        /* Ensure the exception type is set */
        if (_.isEmpty(this.type)) {
            throw new SyntaxError("Exception type must be set");
        }

        /* Build the error stack */
        if (message instanceof Error) {
            /* Use the given stack and message */
            let err = message;
            message = err.message;
            this.stack = err.stack;
        } else {
            /* Error not passed in - build the stack */
            this.stack = (new Error()).stack;
        }

        /* Set the message */
        if (_.isString(message)) {
            this.message = message;
        }

    }


    /**
     * Get Detail
     *
     * Decides what to display if this error
     * bubbles-up to the output.
     *
     * @returns {{type: string, message: string}}
     */
    public getDetail () : any {
        return {
            type: this.type,
            message: this.message
        };
    }


    /**
     * Get HTTP Code
     *
     * This is the HTTP status code if this error
     * bubbles-up to the output.
     *
     * @returns {number}
     */
    public getHttpCode () : number {
        return 500;
    }


    /**
     * Extend
     *
     * Used for extending this class if using a
     * preprocessor that doesn't have the
     * "class Child extends Parent" syntax.
     *
     * If using a language that supports class
     * extension (ES6/TypeScript/CoffeeScript)
     * use that languages class extension rather
     * than this method.  This should be seen
     * as a polyfill rather than core functionality.
     *
     * @param {object} properties
     * @param {object} staticProperties
     * @returns {Function}
     */
    public static extend (properties: Object = {}, staticProperties: Object = {}) : Function {
        return extender(this, properties, staticProperties);
    }


}
