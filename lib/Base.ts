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


    _construct: any;


    /**
     * Constructor
     *
     * Adds in a check for the _construct function,
     * to be called if this class is created using
     * the .extend() static method.
     *
     * @param {*} args
     */
    constructor(...args: any[]) {

        /* Call parent class */
        super();

        /* Call the ES5 constructor */
        if (_.isFunction(this._construct)) {
            this._construct(...args);
        }


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
     * @returns {*}
     */
    static extend (properties: Object = {}, staticProperties: Object = {}) {
        return extender(this, properties, staticProperties);
    }


}
