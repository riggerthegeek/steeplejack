/**
 * Definition
 *
 * This is the definition of a model
 */

/// <reference path="../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import {data as datatypes} from "datautils";


/* Files */
import {Validation} from "./validation";


export class Definition implements Steeplejack.IModelDefinition {


    public type: any;
    public value: any;
    public column: any;
    public primaryKey: boolean;
    public validation: Function[];
    public enum: any[];
    public settings: any;


    public constructor (data: Steeplejack.IModelDefinition = null) {

        let options: any = _.isObject(data) ? data : {};

        let type: any = null;
        if (_.isString(options.type) || _.isFunction(options.type)) {
            type = options.type;
        }

        this.type = type;
        this.value = _.isUndefined(options.value) ? null : _.cloneDeep(options.value);
        this.column = datatypes.setString(options.column, null);
        this.primaryKey = datatypes.setBool(options.primaryKey, false);
        this.validation = [];
        this.enum = datatypes.setArray(options.enum, []);
        this.settings = datatypes.setObject(options.settings, {});

        /* Add validations using the method */
        if (options.validation) {
            this.addValidation(options.validation);
        }

    }


    /**
     * Add Validation
     *
     * Adds a validation rule to the definition
     * object
     *
     * @param {Array|object} rule
     * @returns {Definition}
     * @todo
     */
    public addValidation (rule: Steeplejack.IDefinitionValidation[] = null) : Definition {

        if (_.isArray(rule)) {

            _.each(rule, item => {

                let validateFn: any = Validation.generateFunction(item, this.value);

                this.validation.push(validateFn);

            });

        }

        return this;

    }


    /**
     * Get Setting
     *
     * Returns the given setting parameter
     *
     * @param {string} setting
     * @returns {*}
     */
    public getSetting (setting: string) : any {
        return this.settings[setting];
    }


    /**
     * Has Primary Key
     *
     * Does this definition have the primary key?
     *
     * @returns {boolean}
     */
    public hasPrimaryKey () : boolean {
        return this.primaryKey;
    }


    /**
     * To Definition
     *
     * Factory method to create the definition object
     *
     * @param {string} name
     * @param {*} data
     * @returns {Definition}
     */
    public static toDefinition (name: string, data: any): Definition {

        return new Definition({
            type: data.type,
            value: data.value,
            column: data.column === null ? null : data.column || name,
            primaryKey: data.primaryKey,
            validation: data.validation,
            enum: data.enum,
            settings: data.settings
        });

    }


}
