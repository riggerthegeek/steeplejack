/**
 * Injector
 *
 * JS inversion of control/dependency injection.
 *
 * @type {Function}
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");


/* Files */
var Base = require("./Base");
var datatypes = Base.datatypes;


/**
 * ucwords
 *
 * Forces the first character of a string to be in
 * uppercase and the rest to be lowercase
 *
 * @param {string} str
 * @returns {string}
 */
function _ucwords (str) {
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
}


/**
 * Flatten Object
 *
 * Flattens an object - the name becomes "this.was.the.layout"
 *
 * @param {object} obj
 * @returns {object}
 */
function _flattenObject (obj) {
    var toReturn = {};
    for (var i in obj) {
        if ((typeof obj[i]) === "object") {
            var flatObject = _flattenObject(obj[i]);
            for (var x in flatObject) {
                toReturn[i + "." + x] = flatObject[x];
            }
        } else {
            toReturn[i] = obj[i];
        }
    }
    return toReturn;
}


/**
 * Construct
 *
 * Instantiate a new instance of an object of a given
 * type (constructor).
 *
 * @param {function} constructor
 * @param {object} args
 * @returns {object}
 */
function construct (constructor, args, thisArg) {

    function F () {
        if (!thisArg) {
            thisArg = this;
        }
        return constructor.apply(thisArg, args);
    }

    F.prototype = constructor.prototype;

    return new F();

}


module.exports = Base.extend({



    _construct: function () {

        this._components = {};

    },


    /**
     * Get Component
     *
     * Component accessor by name.
     *
     * @param {string} name
     * @returns {*}
     */
    getComponent: function (name) {

        name = datatypes.setString(name, null);

        if (name === null) {
            return null;
        }

        if (_.has(this._components, name)) {
            return this._components[name];
        }

        return null;

    },


    /**
     * Get Dependencies
     *
     * Iterate over a list of dependencies and resolve
     * them.
     *
     * @param {array} arr
     * @returns {*}
     */
    getDependencies: function (arr) {

        var self = this;

        return arr.map(function (value) {
            var dep = self.getComponent(value);

            if (dep === null) {
                throw new Error("Missing dependency: " + value);
            }

            if (dep.instance === null) {
                dep.instance = self.process(dep.constructor);
            }

            return dep.instance;
        });

    },


    /**
     * Process
     *
     * Reflectively determine the targets dependencies and
     * instantiate an instance of the target with all
     * dependencies injected.
     *
     * @param {object} target
     * @param {object} thisArg
     * @returns {object}
     */
    process: function (target, thisArg) {

        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

        /* Get the constructor text */
        var text;
        if (target.prototype._construct) {
            text = target.prototype._construct.toString();
        } else {
            text = target.toString();
        }

        var tmp = text.match(FN_ARGS)[1].split(",");
        tmp = datatypes.setArray(tmp, []);

        /* Trim out spaces */
        var args = [];
        for (var i = 0; i < tmp.length; i++) {
            var str = tmp[i].trim();

            if (str !== "") {
                args.push(str);
            }
        }

        return construct(target, this.getDependencies(args), thisArg);

    },


    /**
     * Register
     *
     * Register a component to be managed by the injector.
     * Anything that returns a constructor function is a valid
     * component. Attempting to register the same component
     * multiple times will throw an error.
     *
     * @param {string} name
     * @param {function} constructor
     */
    register: function (name, constructor) {

        if (this.getComponent(name) !== null) {
            throw new Error("Component '" + name + "' already registered");
        }

        if (typeof constructor !== "function") {
            throw new Error("Component '" + name + "' is not a function");
        }

        this._components[name] = {
            constructor: constructor,
            instance: null
        };
    },


    /**
     * Register Singleton
     *
     * Register a singleton to be managed by the injector.
     * Anything anything can be a single element - both
     * scalar and non-scalr values. Attempting to register
     * the same name multiple times will throw an error.
     *
     * @param {string} name
     * @param {object} instance
     */
    registerSingleton: function (name, instance) {

        if (this.getComponent(name) !== null) {
            throw new Error("Singleton '" + name + "' already registered");
        }

        this._components[name] = {
            constructor: null,
            instance: instance
        };

    }



}, {


    /**
     * Parser
     *
     * This parses an object of data into a format so we can
     * put into the injector.  It allows a prefix and suffix
     * so we can ensure no name-clashes.  The flatten option
     * is there so you can avoid flattening the data - useful
     * if you have an object of instances (with attached
     * methods) rather than an object of constructors functions.
     *
     * @param {object} input
     * @param {string} prefix
     * @param {string} suffix
     * @param {boolean} flatten
     * @returns {object}
     */
    Parser: function (input, prefix, suffix, flatten) {

        input = datatypes.setObject(input, {});
        prefix = datatypes.setString(prefix, null);
        suffix = datatypes.setString(suffix, null);
        flatten = datatypes.setBool(flatten, true);

        /* Optionally flatten the data */
        var flat = flatten ? _flattenObject(input) : input;

        var output = {};

        _.each(flat, function (fn, name) {

            var arr = name.split(".");

            _.each(arr, function (chunk, i) {

                if (i === 0) {
                    chunk = chunk.toLowerCase();
                } else {
                    chunk = _ucwords(chunk);
                }
                arr[i] = chunk;
            });

            /* Add in prefix */
            if (prefix !== null) {
                arr.unshift(prefix.toLowerCase());
            }

            /* Add in suffix */
            if (suffix !== null) {
                arr.push(_ucwords(suffix));
            }

            output[arr.join("")] = fn;

        });

        return output;

    }


});
