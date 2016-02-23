/**
 * Model
 *
 * This is a piece of data. Typically, this
 * would be a single line/document out of a
 * database. This requires a schema to be
 * defined.
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import {data as datatypes} from "datautils";


/* Files */
import {Base} from "./base";
import {Definition} from "./definition";
import {ValidationException} from "../exception/validation/index";
import {dataCasting} from "../helpers/dataCasting";
import {getFnName} from "../helpers/getFnName";
import {scalarValues} from "../helpers/scalarValues";
import {IDefinitionColumns} from "../interfaces/definitionColumns";
import {IModelDefinition} from "../interfaces/modelDefinition";


export abstract class Model extends Base {


    /**
     * Data
     *
     * This is where the raw model data lives. Ignore
     * this and use the get/set methods to access
     * it.
     *
     * @type {{}}
     * @private
     */
    protected _data: any = {};


    /**
     * Definition
     *
     * This is your definition objects that control
     * how the model behaves.
     *
     * @type {{}}
     * @private
     */
    protected _definition: any = {};


    /**
     * Primary Key
     *
     * Defines the primary key on the model. This
     * is optional.
     *
     * @type {null}
     * @private
     */
    protected _primaryKey: string = null;


    /**
     * Schema
     *
     * This must return a schema object which
     * defines how our model looks and behaves. If
     * you wish to extend a model to create another
     * model, then merge your parent schema with
     * this schema using the _mergeSchemas method.
     *
     * @private
     */
    protected abstract _schema () : any;


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
            (<any> this)[key] = value;
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
    protected _configureDefinition () : void {

        /* Written like this (not with _.reduce) as the setter needs to access the definition */
        _.each(this._schema(), (schemaItem: IModelDefinition, key: string) => {

            let definition = Definition.toDefinition(key, schemaItem);

            if (definition.hasPrimaryKey()) {
                this._setPrimaryKey(key);
            }

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
            (<any> this)[key] = void 0;

        }, {});

    }


    /**
     * Merge Schemas
     *
     * Helper to merge together two schemas
     *
     * @param {object} parent
     * @param {object} child
     * @returns {Object}
     * @private
     */
    protected _mergeSchemas (parent: any, child: any) : any {

        let schema: Object = _.extend(parent, child);

        return schema;

    }


    /**
     * Set Primary Key
     *
     * Sets the primary key
     *
     * @param {string} key
     * @private
     */
    protected _setPrimaryKey (key: string) {

        if (this.getPrimaryKey() === null) {
            this._primaryKey = key;
        } else {
            throw new Error("CANNOT_SET_MULTIPLE_PRIMARY_KEYS");
        }
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

        /* Look for a protected method first */
        let customFunc = getFnName("_get", key);

        /* Get the current value */
        let currentValue: any = (_.has(this._data, key)) ? this._data[key] : void 0;

        if (_.isFunction((<any> this)[customFunc])) {

            /* Use the custom function */
            return (<any> this)[customFunc](currentValue);

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
     * Get Primary Key
     *
     * Gets the primary key
     *
     * @return {string}
     */
    getPrimaryKey () {
        return this._primaryKey;
    }


    /**
     * Get Primary Key Value
     *
     * Gets the value of the primary key
     *
     * @returns {*}
     */
    getPrimaryKeyValue () {
        return this.get(this.getPrimaryKey());
    }


    /**
     * Get Schema
     *
     * Gets the schema from the child class.
     * This is the unparsed version.
     *
     * @returns {*}
     */
    public getSchema () : any {
        return this._schema() || {};
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

        if (_.isFunction((<any> this)[customFunc])) {

            value = (<any> this)[customFunc](value, defaultValue);

            if (_.isUndefined(value)) {
                value = defaultValue;
            }

        } else {

            let type = definition.type;

            /* Is the type a class? */
            if (_.isFunction(type)) {

                /* Yup - is it already instance of the type? */

                if (value instanceof type === false) {

                    /* No - populate the instance if something set */
                    let createNew = false;

                    if (_.isArray(value)) {
                        createNew = true;
                    } else {
                        value = datatypes.setObject(value, defaultValue);
                        createNew = value !== defaultValue;
                    }

                    if (createNew) {
                        value = new type(value);
                    }

                }

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

                            let fnName: string = (<any> dataCasting)[type];
                            let fn: Function = (<any> datatypes)[fnName];

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

                let data: any = (<any> this)[key];

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
     * Validate
     *
     * Validates the model against the validation
     * rules.  It throws an error if it detects a
     * violation of the rules. If the validation
     * succeeds, it returns true.
     *
     * @returns {boolean}
     */
    public validate () {

        /* Create a validation error - will put any errors here */
        let validation = new ValidationException("Model validation error");

        /* Run through each of the definitions for the validation rules */
        _.each(this._definition, (definition: Definition, key: string) => {

            /* Get the current value */
            let value: any = this.get(key);

            if (_.isObject(value) && _.isFunction(value.validate)) {

                /* Collection or Model - validate that */
                try {
                    value.validate();
                } catch (err) {

                    _.each(err.getErrors(), (list: any[], errKey: string) => {

                        _.each(list, error => {

                            let name = [
                                key,
                                errKey
                            ].join("_");

                            validation.addError(name, error.value, error.message, error.additional);

                        });

                    });

                }

            }

            /* Cycle through the validation rules */
            _.each(definition.validation, (rule : Function) => {

                try {
                    /* A validation function can throw error or return false */
                    if (rule(this, value) === false) {
                        /* Returned false - throw a simple error */
                        throw new Error("Custom model validation failed");
                    }
                } catch (err) {
                    /* Add the validation error */
                    validation.addError(key, value, err.message, err.params);
                }

            });

        });

        if (validation.hasErrors()) {
            /* Uh-oh, there's an error */
            throw validation;
        }

        /* Return true to show we're happy */
        return true;

    }


    /**
     * Where
     *
     * Give it some properties and see if the model
     * matches those values.
     *
     * If the data is an object, it casts the data
     * to a string so that it can be matched.
     *
     * @param {object} properties
     * @returns {boolean}
     */
    public where (properties: Object) : boolean {

        /* Throw error if non-object */
        if (_.isPlainObject(properties) === false) {
            throw new TypeError("Model.where properties must be an object");
        }

        /* If there are no properties set, always return false */
        if (_.isEmpty(properties)) {
            return false;
        }

        /* Clone the model so we can use the setter without breaking the references */
        let tmp = this.clone();

        /* Create a target object - the values we want to check */
        let target = _.reduce(properties, (result: any, value: any, key: string) => {

            /* Set the value to the model so in the right format */
            tmp.set(key, value);

            value = scalarValues(tmp.get(key));

            result[key] = value;

            return result;

        }, {});

        /* Get the current values for each of the properties */
        let current = _.reduce(properties, (result: any, value: any, key: string) => {

            value = scalarValues(this.get(key));

            result[key] = value;

            return result;

        }, {});

        return _.isEqual(current, target);

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

            model[key] = value;

        });

        return model;

    }


}
