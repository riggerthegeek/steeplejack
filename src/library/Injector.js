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

        return _.map(arr, function (value) {
            var dep = this.getComponent(value);

            if (dep === null) {
                throw new Error("Missing dependency: " + value);
            }

            if (dep.instance === null) {
                dep.instance = this.process(dep.constructor);
            }

            return dep.instance;
        }, this);

    },


    /**
     * Process
     *
     * Reflectively determine the targets dependencies and
     * instantiate an instance of the target with all
     * dependencies injected.
     *
     * If it's a test, it allows modules to be specified
     * with an underscore at the start and end.
     *
     * @param {object} target
     * @param {object} thisArg
     * @param {boolean} test
     * @returns {object}
     */
    process: function (target, thisArg, test) {

        test = datatypes.setBool(test, false);

        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

        /* Get the constructor */
        var constFn;
        if (_.has(target.prototype, "_construct")) {
            constFn = target.prototype._construct;
        } else {
            constFn = target;
        }

        /* Get the dependencies, either from array or constructor function */
        var tmp;
        if (_.isArray(constFn)) {

            /* Last one should be function */
            var fn = constFn.pop();

            if (_.has(target.prototype, "_construct")) {
                target.prototype._construct = fn;
            } else {
                target = fn;
            }

            if (_.isFunction(fn) === false) {
                throw new Error("constructor not a function");
            }

            tmp = constFn;

        } else if (_.isFunction(constFn)) {

            var text = constFn.toString();

            tmp = text.match(FN_ARGS)[1].split(",");
            tmp = datatypes.setArray(tmp, []);

        } else {
            throw new Error("Injectable constructor must be an array or function");
        }

        /* Get a definitive list of dependencies */
        var args = _.reduce(tmp, function (result, str) {

            str = str.trim();

            if (str !== "") {

                if (test) {
                    /* Test - remove underscores at start and end of string */
                    str = str.replace(/\b_([\w\$]+)_\b/g, "$1");
                }

                result.push(str);

            }

            return result;

        }, []);

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
     * @returns {exports}
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

        return this;

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
     * @returns {exports}
     */
    registerSingleton: function (name, instance) {

        if (this.getComponent(name) !== null) {
            throw new Error("Singleton '" + name + "' already registered");
        }

        this._components[name] = {
            constructor: null,
            instance: instance
        };

        return this;

    },


    /**
     * Replace
     *
     * This allows a module to be replaced with another
     * module. It will be re-registered with the same
     * register function as what it was originally
     * registered with.
     *
     * This should only be used during unit testing as
     * can cause issues for modules dependent upon what
     * you're replacing.
     *
     * @param name
     * @param component
     * @returns {exports}
     */
    replace: function (name, component) {

        var registered = this.getComponent(name);

        if (registered === null) {
            /* Cannot replace something that doesn't exist */
            throw new Error("Component '" + name + "' cannot be replaced as it's not currently registered");
        }

        var singleton = registered.constructor === null;

        /* Remove the component */
        this.remove(name);

        /* Register the new component */
        if (singleton) {
            /* Singleton */
            this.registerSingleton(name, component);
        } else {
            /* Function */
            this.register(name, component);
        }

        return this;

    },


    /**
     * Remove
     *
     * Removes a component from the lists of components
     *
     * @param name
     * @returns {exports}
     */
    remove: function (name) {

        this._components = _.omit(this._components, name);

        return this;

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
