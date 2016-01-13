/**
 * definition
 */

/// <reference path="../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import {data as datatypes} from "datautils";


/* Files */


export class Definition implements IModelDefinition {


    public type: any;
    public value: any;
    public column: any;
    public primaryKey: boolean;
    public validation: Function[];
    public enum: any[];
    public settings: any;


    public constructor (options: IModelDefinition) {

        let type: any = null;
        if (_.isString(options.type) || _.isFunction(options.type)) {
            type = options.type;
        }

        this.type = type;
        this.value = _.isUndefined(options.value) ? null : _.cloneDeep(options.value);
        this.column = datatypes.setString(options.column, null);
        this.primaryKey = datatypes.setBool(options.primaryKey, false);
        this.validation = null;
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
    public addValidation (rule: any) : Definition {

        if (_.isArray(rule)) {

            _.each(rule, item => {
                this.addValidation(item);
            });

            return this;

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


    public static toDefinition (name: string, data: IModelDefinition): Definition {

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
