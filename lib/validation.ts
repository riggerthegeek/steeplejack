/**
 * Validation
 *
 * This adds validation to the Definition class
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import {validation} from "datautils";


/* Files */
import {Model} from "./model";
import {IDefinitionValidation} from "../interfaces/definitionValidation";


export class Validation {


    /**
     * Create Closure
     *
     * Creates a closure of the validation function.  This returns
     * another function with the parameters set as arguments so they
     * can be accessed.  In all cases, the first two arguments are
     * the instance of the model and the desired value to validate
     * against.
     *
     * @param {function} rule
     * @param {*} params
     * @param {*} defaultValue
     * @param {boolean} isRequired
     * @returns {function(Model, any): (boolean|*)}
     */
    static createClosure (rule: Function, params: any[], defaultValue: any, isRequired: boolean) : Function {

        /* Create closure with params */
        return function (value: any, model: Model) {

            if (value === defaultValue && isRequired === false) {
                /* Value is not set and not required - validate */
                return true;
            } else {

                /* Build the array to send to the rule */
                let input: any[] = [
                    value,
                    model
                ];

                /* Are there any parameters? */
                if (_.isEmpty(params) === false) {
                    input = input.concat(params);
                }

                /* Execute the function with the parameters */
                return rule(...input);

            }

        };

    }


    /**
     * Generate Function
     *
     * Creates the closure to validate the model
     * data
     *
     * @param {IDefinitionValidation} validate
     * @param {*} defaultValue
     */
    static generateFunction (validate: IDefinitionValidation, defaultValue: any = void 0) : any {

        if (_.isObject(validate) === false) {
            return null;
        }

        let rule = validate.rule;
        let required = false;
        let ruleFn: Function;

        if (_.isFunction(rule)) {

            /* We're passing a custom function to validate against */
            ruleFn = (<Function> rule);

        } else if (_.isString(rule)) {

            /* Treat the rule as a string */
            const ruleName: string = rule;

            /* Set the required status */
            required = ruleName.toUpperCase() === "REQUIRED";

            if ((<string> ruleName).toUpperCase() === "MATCH") {
                /* Use the special match rule */
                ruleFn = Validation.match;
            } else if (_.isFunction((<any> validation)[ruleName])) {

                /* Valid rule in the validation utils package */
                ruleFn = function (value: string, model: Model, ...args: any[]) {

                    /* Add the value as first element */
                    args.unshift(value);

                    return (<any> validation)[ruleName](...args);

                };

            } else {
                /* The rule doesn't exist in the validation library */
                throw new SyntaxError(`'${rule}' is not a validation function`);
            }

        } else {

            throw new TypeError(`IDefinitionValidation.rule must be a function or a string, not a ${typeof rule}`);

        }

        /* Return the closure */
        return Validation.createClosure(ruleFn, validate.param, defaultValue, required);

    }


    /**
     * Match
     *
     * A special rule that matches the given value
     * against the value for the given key in the
     * model
     *
     * @param {*} value
     * @param {Model} model
     * @param {string} key
     * @returns {boolean}
     */
    static match (value: any, model: Model, key: string) : boolean {

        let matchValue: any = model.get(key);

        if (matchValue !== value) {

            let err: any = new Error("VALUE_DOES_NOT_MATCH");
            err.key = key;
            err.value = value;
            err.params = [
                matchValue
            ];

            throw err;

        }

        return true;

    }


}
