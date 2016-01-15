/**
 * collection
 */

/// <reference path="../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {Base} from "./base";
import {Model} from "./model/index";
import {ValidationException} from "../exception/validation/index";


export abstract class Collection extends Base {


    protected _data: ICollectionData[] = [];


    public static model: Function = null;


    /**
     * Constructor
     *
     * Adds the data to the collection
     *
     * @param {any[]} data
     */
    public constructor (data: any[] = null) {

        super();

        this.add(data);

    }


    /**
     * Add
     *
     * Adds in the data to the collection
     *
     * @param {any[]} data
     * @returns {Collection}
     */
    public add (data: any[] = null) : Collection {

        /* Ensure we've got an array */
        if (_.isArray(data)) {

            _.each(data, item => {

                let model: Model;
                let ModelConstructor: any = this.getModel();

                if (item instanceof ModelConstructor) {
                    /* It's already an instance of the model */
                    model = <Model>item;
                } else {
                    /* Convert the data into an instance of the model */
                    model = new ModelConstructor(item);
                }

                this._data.push({
                    id: "string",
                    model: model
                });

            });

        }

        return this;

    }


    /**
     * Get Data
     *
     * Returns the models in order
     *
     * @returns {any[]}
     */
    public getData () : any[] {
        return _.map(this._data, (item: ICollectionData) => {
            return item.model.getData();
        });
    }


    /**
     * Get Model
     *
     * Gets the model from the child class.
     * This is the constructor.
     *
     * @returns {*}
     */
    public getModel () : any {
        return (<any>this.constructor).model;
    }


    /**
     * To Db
     *
     * Returns the database representation of
     * the models in order
     *
     * @returns {TResult[]}
     */
    public toDb () : any {
        return _.map(this._data, (item: ICollectionData) => {
            return item.model.toDb();
        });
    }


    /**
     * Validate
     *
     * Validates all the models in the collection.
     *
     * @returns {boolean}
     */
    validate () : boolean {

        let collectionErr = new ValidationException("Collection validation error");

        _.each(this._data, (item: ICollectionData, id: number) => {

            try {
                item.model.validate();
            } catch (err) {

                _.each(err.getErrors(), (list: any[], key: string) => {

                    _.each(list, error => {

                        collectionErr.addError(`${id}_${key}`, error.value, error.message, error.additional);

                    });

                });

            }

        });

        if (collectionErr.hasErrors()) {
            throw collectionErr;
        }

        return true;

    }


}
