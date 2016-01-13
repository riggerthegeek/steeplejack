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
import {modelGetter} from "./modelGetter";
import {modelSetter} from "./modelSetter";


export abstract class Model extends Base {


    protected _data: IObjectLiteral = {};


    protected _definition: IObjectLiteral = {};


    protected _primaryKey: string = null;


    public static schema: any = {};


    /**
     * Constructor
     *
     * @param {object} data
     */
    public constructor (data: IObjectLiteral = {}) {

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

        let schema: IObjectLiteral = {};

        /* Add in this schema */
        _.extend(schema, this.getSchema());

        this._definition = _.reduce(schema, (result: any, schemaItem: IModelDefinition, key: string) => {

            let definition = Definition.toDefinition(key, schemaItem);

            result[key] = definition;

            /* Create the setters and getters */
            Object.defineProperty(this, key, {
                configurable: false,
                enumerable: true,
                set: modelSetter(definition, key).bind(this),
                get: modelGetter(definition, key).bind(this)
            });

            /* Set the default value */
            (<any>this)[key] = void 0;

            return result;

        }, {});

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
     * @returns {IObjectLiteral}
     */
    public getData () : IObjectLiteral {
        return this._data;
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
    public getDefinition (key: string = null) : Definition {
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
    public getSchema () :IObjectLiteral {
        return (<any>this.constructor).schema;
    }


    /**
     * To Db
     *
     * Converts the model to the database
     * representation object. This is an
     * object literal
     *
     * @returns {IObjectLiteral}
     */
    public toDb () : IObjectLiteral {

        return _.reduce(this._definition, (result: any, definition: Definition, key: string) => {

            /* Get the column name */
            let column: string = definition.column;

            /* Ignore null columns */
            if (column !== null) {

                let data: any = (<any>this)[key];

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
     * @param {IObjectLiteral} data
     * @returns {Model}
     */
    static toModel (data: IObjectLiteral = {}) : Model {

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
