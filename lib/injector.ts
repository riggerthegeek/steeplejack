/**
 * Injector
 *
 * This a simple reflective dependency injector that
 * helps you create SOLID applications.
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {Base} from "./base";
import {IInjectorComponent} from "../interfaces/injectorComponent";
import {IInjectorComponentItem} from "../interfaces/injectorComponentItem";
import {IInjectorTarget} from "../interfaces/injectorTarget";


const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;


/**
 * Construct
 *
 * Factory method to create a new instance of
 * the constructor.
 *
 * @param {function} constructor
 * @param {Array} args
 * @returns {object}
 */
let construct = (constructor: Function, args: any[]) : any => {

    function Factory () {

        return constructor.apply(this, args);

    }

    Factory.prototype = constructor.prototype;

    return new (<any> Factory)();

};


/**
 * Is ES5 Class
 *
 * This searches a target for evidence
 * of it being an ES5 class (ie, having
 * been extended using the extender helper
 * method).
 *
 * This shouldn't be seen as super-reliable
 * way of testing if it's a class but is
 * a quick and dirty way for the injector
 * to work it out.
 *
 * @param target
 * @returns {boolean}
 */
let isES5Class = (target: any) : boolean => {
    return _.has(target, [
        "prototype",
        "_construct"
    ]);
};


export class Injector extends Base {


    /**
     * Components
     *
     * Where the registered components live
     *
     * @type {IInjectorComponent}
     * @private
     */
    protected _components: IInjectorComponent = {};


    /**
     * Register Component
     *
     * Registers a new component to the injector instance
     *
     * @param {string} name
     * @param {function|Array} factory
     * @param {*} instance
     * @returns {Injector}
     * @private
     */
    protected _registerComponent (name: string, factory: any = null, instance: any = null) : Injector {

        if (_.isEmpty(name)) {

            /* Name is required */
            throw new Error("Name is required to register a component");

        } else if (this.getComponent(name) !== null) {

            /* Cannot register the same component multiple times */
            throw new Error(`Component '${name}' is already registered`);

        } else if (factory === null && instance === null) {

            /* One must be registered */
            throw new Error("Either one of factory and instance must be registered");

        } else if (factory !== null && instance !== null) {

            /* Cannot register both */
            throw new Error("Cannot register both factory and instance");

        } else if (factory !== null) {

            /* Register a factory - check array or function */
            if (_.isFunction(factory) === false && _.isArray(factory) === false) {
                throw new TypeError(`Factory '${name}' can only accept a function or an array`);
            }

        }

        /* Register with the components object */
        this._components[name] = {
            factory,
            instance
        };

        return this;

    }


    /**
     * Get Component
     *
     * Get the components by name
     *
     * @param {string} name
     * @returns {IInjectorComponentItem}
     */
    public getComponent (name: string) : IInjectorComponentItem {

        if (_.has(this._components, name)) {
            return this._components[name];
        }

        return null;

    }


    /**
     * Get Dependencies
     *
     * Iterates over the dependencies and resolve them
     * as usable items.
     *
     * @param {string[]} dependencies
     * @returns {*[]|boolean[]}
     */
    public getDependencies (dependencies: string[]) : any[] {

        return _.map(dependencies, value => {

            let dependency = this.getComponent(value);

            if (dependency === null) {
                throw new Error("Missing dependency: " + value);
            }

            /* If instance hasn't already been processed, process it */
            if (dependency.instance === null) {
                dependency.instance = this.process(dependency.factory);
            }

            return dependency.instance;

        });

    }


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
     * @param {function|Array} target
     * @param {boolean} test
     * @returns {any}
     */
    public process (target: any, test: boolean = false) : any {

        /* Get an array of dependencies */
        let targetDeps = Injector.getTargetDependencies(target);

        let dependencies: any = targetDeps.dependencies;

        /* Overwrite the target with the result of the dependency parser */
        target = targetDeps.target;

        /* Get a definitive list of dependencies */
        let resolved = _.map(dependencies, (str: string) => {

            if (test) {
                /* Test - remove underscores at start and end of string */
                str = str.replace(/\b_([\w\$]+)_\b/g, "$1");
            }

            return str;

        });

        /* Return the constructor with the dependencies loaded */
        return construct(target, this.getDependencies(resolved));

    }


    /**
     * Register Factory
     *
     * Register a component to be managed by the injector.
     * Anything that returns a constructor function is a valid
     * component. Attempting to register the same component
     * multiple times will throw an error.
     *
     * @param {string} name
     * @param {*} factory
     * @returns {Injector}
     */
    public registerFactory (name: string, factory: any) : Injector {
        return this._registerComponent(name, factory);
    }


    /**
     * Register Singleton
     *
     * Register a singleton to be managed by the injector.
     * Anything anything can be a single element - both
     * scalar and non-scalar values. Attempting to register
     * the same name multiple times will throw an error.
     *
     * @param {string} name
     * @param {*} instance
     * @returns {Injector}
     */
    public registerSingleton (name: string, instance: any) : Injector {
        return this._registerComponent(name, null, instance);
    }


    /**
     * Remove
     *
     * Removes a component from the list of registered
     * components
     *
     * @param {string} name
     * @returns {Injector}
     */
    public remove (name: string) : Injector {

        let components: any;
        components = _.omit(this._components, name);

        this._components = components;

        return this;

    }


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
     * @param {string} name
     * @param {IInjectorComponentItem} newComponent
     * @returns {Injector}
     */
    public replace (name: string, newComponent: IInjectorComponentItem) : Injector {

        /* Get the component */
        let registered = this.getComponent(name);

        if (registered === null) {
            /* Cannot replace something that doesn't exist */
            throw new Error(`Component '${name}' cannot be replaced as it's not currently registered`);
        }

        /* Remove the component */
        this.remove(name);

        /* Register the new component */
        if (registered.factory === null) {
            /* It's a singleton */
            this.registerSingleton(name, newComponent);
        } else {
            /* It's a factory */
            this.registerFactory(name, newComponent);
        }

        return this;

    }


    /**
     * Get Target Dependencies
     *
     * Gets the dependencies that are required in the
     * target, either by parsing the function or by
     * reading the array contents
     *
     * @param {*} target
     * @returns {IInjectorTarget}
     * @private
     */
    public static getTargetDependencies (target: any) : IInjectorTarget {

        /* Ensure it's an array or function */
        if (_.isFunction(target) === false && _.isArray(target) === false) {
            throw new TypeError(
                "Injectable constructor must be an array or function"
            );
        }

        let dependencies: any[];
        let fn: Function;

        if (_.isFunction(target) === false) {

            /* Take from the array - last element must be a function */
            dependencies = _.cloneDeep(target);

            /* Set the function as the target */
            fn = dependencies.pop();

            if (isES5Class(fn)) {
                fn = fn.prototype._construct;
            }

            if (_.isFunction(fn) === false) {
                throw new SyntaxError("No constructor function in injector array");
            }

        } else {

            if (isES5Class(target)) {
                fn = target.prototype._construct;
            } else {
                fn = target;
            }

            let text = fn.toString();

            dependencies = text.match(FN_ARGS)[1]
                .split(",");

        }

        /* Trim out whitespace/empty dependencies */
        dependencies = _.reduce(dependencies, (result: string[], name: string) => {

            name = _.trim(name);

            if (_.isEmpty(name) === false) {
                result.push(name);
            }

            return result;

        }, []);

        return {
            dependencies: dependencies,
            target: fn
        };

    }


}
