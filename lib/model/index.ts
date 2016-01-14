import {data} from "datautils";
/**
 * model
 */

/// <reference path="../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import {data as datatypes} from "datautils";


/* Files */
import {Base} from "./../base";
import {Definition} from "./definition";
import {dataCasting, getFnName} from "./helpers";


export abstract class Model extends Base {


    protected _data: any = {};


    protected _definition: any = {};


    protected _primaryKey: string = null;


    public static schema: any = {};


    /**
     * Constructor
     *
     * @param {object} data
     */
    public constructor (data: any = {}) {

        super();

        this._configureDefinition();

        /* Set the data to the model */
        _.each(data, (value: any, key: string) => {
            (<any>this)[key] = value;
        });

    }


    /**
     * Configure Definition
     *
     * Takes the schema and converts it to a
     * definition object
     *
     * @private
     */
    protected _configureDefinition () {

        let schema: any = {};

        /* Add in this schema */
        _.extend(schema, this.getSchema());

        /* Written like this (not with _.reduce) as the setter needs to access the definition */
        _.each(schema, (schemaItem: IModelDefinition, key: string) => {

            let definition = Definition.toDefinition(key, schemaItem);

            /* Set the definition to the class */
            this._definition[key] = definition;

            /* Create the setters and getters */
            Object.defineProperty(this, key, {
                configurable: false,
                enumerable: true,
                set: (value: any) => {
                    return this.set(key, value);
                },
                get: () => {
                    return this.get(key);
                }
            });

            /* Set the default value */
            (<any>this)[key] = void 0;

        }, {});

    }


    /**
     * Get
     *
     * Returns the data set to the key name
     *
     * @param {string} key
     * @returns {any}
     */
    public get (key: string) : any {

        let definition = this.getDefinition(key);

        /* Look for a protected method first */
        let customFunc = getFnName("_get", key);

        /* Get the current value */
        let currentValue: any = (_.has(this._data, key)) ? this._data[key] : void 0;

        if (_.isFunction((<any>this)[customFunc])) {

            /* Use the custom function */
            return (<any>this)[customFunc](currentValue);

        } else {

            /* Just return the value */
            return currentValue;

        }

    }


    /**
     * Get Column Keys
     *
     * Gets the keys and the column name
     * as an array of objects
     *
     * @returns {IDefinitionColumns[]}
     */
    public getColumnKeys () : IDefinitionColumns[] {

        return _.reduce(this._definition, (result: any, definition: Definition, key: string) => {

            result.push({
                key: key,
                column: definition.column
            });

            return result;

        }, []);

    }


    /**
     * Get Data
     *
     * Returns the data that is set to this
     * data model.
     *
     * This allows us to access the static
     * property set in the child.
     *
     * @returns {any}
     */
    public getData () : any {

        return _.reduce(this._data, (result: any, data: any, key: string) => {

            if (_.isObject(data) && _.isFunction(data.getData)) {
                data = data.getData();
            }

            result[key] = data;

            return result;

        }, {});

    }


    /**
     * Get Definition
     *
     * Once the schema has been converted into
     * a series of Definition objects, they will
     * live in here.
     *
     * @param {string} key
     * @returns {Definition|null}
     */
    public getDefinition (key: string) : Definition {
        return this._definition[key] || null;
    }


    /**
     * Get Schema
     *
     * Gets the schema from the child class.
     * This is the unparsed version.
     *
     * @returns {*}
     */
    public getSchema () :any {
        return (<any>this.constructor).schema;
    }


    /**
     * Set
     *
     * Sets data to the desired key. If no value is
     * received, it will set the default value.
     *
     * If there is a method called _setKey (eg, if
     * key = "item", method called _setItem) on the
     * concrete class, that will act as the setter.
     * Otherwise, it uses simple datatype rules.
     *
     * @param {string} key
     * @param {any} value
     * @returns {Model}
     */
    public set (key: string, value: any = void 0) : Model {

        let definition = this.getDefinition(key);

        if (definition === null) {
            /* We don't know this key here */
            return this;
        }

        let customFunc = getFnName("_set", key);
        let defaultValue = definition.value;

        if (_.isFunction((<any>this)[customFunc])) {

            value = (<any>this)[customFunc](value, defaultValue);

            if (_.isUndefined(value)) {
                value = defaultValue;
            }

        } else {

            let type = definition.type;

            /* Is the type a class? */
            if (_.isFunction(type)) {

                /* Yup - create an instance */
                value = new type(value);

            } else {

                /* No - treat as string */
                switch (type) {

                    case "enum":
                        value = datatypes.setEnum(value, definition.enum, defaultValue);
                        break;

                    case "mixed":
                        if (_.isUndefined(value)) {
                            value = defaultValue;
                        }
                        break;

                    default:
                        if (_.has(dataCasting, type)) {

                            let fnName:string = (<any>dataCasting)[type];
                            let fn:Function = (<any>datatypes)[fnName];

                            value = fn(value, defaultValue);

                        } else {
                            /* Unknown datatype */
                            throw new TypeError(`Definition.type '${type}' is not valid`);
                        }
                        break;
                }

            }

        }

        this._data[key] = value;

        return this;

    }


    /**
     * To Db
     *
     * Converts the model to the database
     * representation object. This is an
     * object literal
     *
     * @returns {any}
     */
    public toDb () : any {

        return _.reduce(this._definition, (result: any, definition: Definition, key: string) => {

            /* Get the column name */
            let column: string = definition.column;

            /* Ignore null columns */
            if (column !== null) {

                let data: any = (<any>this)[key];

                /* If it's an instance of the model, get the DB representation */
                if (_.isObject(data) && _.isFunction(data.toDb)) {
                    data = data.toDb();
                }

                result[column] = data;

            }

            return result;

        }, {});
    }


    /**
     * To Model
     *
     * Converts an object literal to an instance
     * of this model. This will be expecting the
     * data in the same format that is returned
     * from the toDb() method
     *
     * @param {any} data
     * @returns {Model}
     */
    static toModel (data: any = {}) : Model {

        /* Create a new instance of this model with default data */
        let model = Object.create(this.prototype);
        this.apply(model, []);

        let definition: IDefinitionColumns[] = (model.getColumnKeys());

        /* Set the column data to the model */
        _.each(definition, item => {

            let key = item.key;
            let value = data[item.column];
            let type = model.getDefinition(key).type;

            model[key] = value;

        });

        return model;

    }


}
