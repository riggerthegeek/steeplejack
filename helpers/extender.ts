/**
 * extender
 */

/// <reference path="../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */


/**
 * Extender
 *
 * This is a generic extender that allows us to
 * extend an object from a static method on said
 * object (usually .extend).
 *
 * This will make it an instance of that object.
 * If you need to make it an instance of anything
 * further up, then that should be done in the
 * constructor of that object.
 *
 * NB. This is a polyfill for the extends keyword.
 * While you may be able to mix ES5 and ES6 coding,
 * you shouldn't do so.  Although ES5 is supported,
 * ES6 is the preferred standard for all new projects.
 *
 * @param {function} Constructor
 * @param {Object} prototypeProps
 * @param {Object} staticProps
 * @returns {function(): *}
 */
export function extender (Constructor: any, prototypeProps: Object = {}, staticProps: Object = {}) : Function {

    if (_.isFunction(Constructor) === false) {
        throw new TypeError("The Constructor must be a function");
    }

    if (_.isPlainObject(prototypeProps) === false) {
        throw new TypeError("The prototype properties must be an object");
    }

    if (_.isPlainObject(staticProps) === false) {
        throw new TypeError("The static properties must be an object");
    }

    let MyClass: any;
    MyClass = function (...args: any[]) : void {
        return Constructor.apply(this, arguments);
    };

    /* Ignore these properties */
    let ignoreProperties = Object.getOwnPropertyNames(MyClass);

    /* Discover all enumerable and non-enumerable static properties */
    let merge = [
        Constructor,
        staticProps
    ];

    /* Merge everything */
    _.each(merge, obj => {

        let keys = Object.getOwnPropertyNames(obj);

        /* Ignore function methods */
        if (_.isFunction(obj)) {

            /* Remove function-specific properties */
            keys = _.without(keys, ...ignoreProperties)
                .sort();

        }

        _.each(keys, key => {
            MyClass[key] = obj[key];
        });

    });

    MyClass.prototype = Object.create(Constructor.prototype);

    if (_.isEmpty(prototypeProps) === false) {
        _.extend(MyClass.prototype, prototypeProps);
    }

    /* Attach the parent to super_ - keep consistent with util.inherits */
    MyClass.prototype.super_ = Constructor.prototype;
    MyClass.super_ = Constructor;

    return MyClass;


}
