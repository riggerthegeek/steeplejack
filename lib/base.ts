/**
 * Base
 */

/// <reference path="../typings/tsd.d.ts" />

"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {extender} from "../helpers/extender";


export class Base extends EventEmitter {


    protected __construct: Function;


    /**
     * Constructor
     *
     * Adds in a check for the _construct function,
     * to be called if this class is created using
     * the .extend() static method.
     *
     * @param {*} args
     */
    public constructor (...args: any[]) {

        /* Call parent class */
        super();

        /* Call the ES5 constructor */
        if (_.isFunction(this.__construct)) {
            this.__construct(...args);
        }


    }


    /**
     * Clone
     *
     * Clones the instance of the object, returning a
     * new instance of the object with the same values.
     *
     * @returns {Object}
     */
    public clone () : any {

        let prototype = Object.getPrototypeOf(this);

        let clonedObj = Object.create(prototype);

        Object.getOwnPropertyNames(this)
            .map((name) => {

                let obj = _.clone((<any>this)[name]);

                Object.defineProperty(clonedObj, name, {
                    value: obj,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });

            });

        return clonedObj;

    }


    /**
     * Extend
     *
     * Used for extending this class if using a
     * preprocessor that doesn't have the
     * "class Child extends Parent".
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
