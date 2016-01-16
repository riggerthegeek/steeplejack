/**
 * collection
 */

/// <reference path="../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import * as uuid from "node-uuid";


/* Files */
import {Base} from "./base";
import {Model} from "./model/index";
import {ValidationException} from "../exception/validation/index";


export abstract class Collection extends Base {


    protected _data: ICollectionData[] = [];


    protected abstract _model () : Object;


    /**
     * Constructor
     *
     * Adds the data to the collection
     *
     * @param {any[]} data
     */
    public constructor (data: any[] = null) {

        super();

        /* Add in anything passed in */
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
                this.addOne(item);
            });
        }

        return this;

    }


    /**
     * Add One
     *
     * Adds one object to the collection
     *
     * @param {any} data
     * @returns {Collection}
     */
    public addOne (data: any = null) : Collection {

        if (_.isObject(data) && _.isArray(data) === false) {

            let model:Model;
            let ModelConstructor:any = this._model();

            if (data instanceof ModelConstructor) {
                /* It's already an instance of the model */
                model = <Model>data;
            } else {
                /* Convert the data into an instance of the model */
                model = new ModelConstructor(data);
            }

            /* Add to the collection */
            this._data.push({
                id: uuid.v4(),
                model: model
            });

        }

        return this;

    }


    /**
     * Get All
     *
     * Returns the data array
     *
     * @returns {ICollectionData[]}
     */
    public getAll () : ICollectionData[] {
        return this._data;
    }


    /**
     * Get All By ID
     *
     * Gets all the models by matching the
     * ID
     *
     * @param ids
     * @returns {Model[]}
     */
    public getAllById (ids : string[]) : Model[] {

        /* Get the keys for the models */
        let keys = _.reduce(this.getAll(), (result: any, data: ICollectionData, key: number) => {

            if (_.indexOf(ids, data.id) !== -1) {
                result.push(key);
            }

            return result;

        }, []);

        return this.getAllByKey(keys);

    }


    /**
     * Get All By Key
     *
     * Gets all the models from the collection with
     * the array keys.
     *
     * @param {number[]} id
     * @returns {Model[]}
     */
    public getAllByKey (id : number[]) : Model[] {

        return _.reduce(this.getAll(), (result: any, data: ICollectionData, key: number) => {

            if (_.indexOf(id, key) !== -1) {
                result.push(data.model);
            }

            return result;

        }, []);

    }


    /**
     * Get All By Model
     *
     * Gets all the models by matching the model
     * instances themselves.
     *
     * @param {Model[]} models
     * @returns {Model[]}
     */
    public getAllByModel (models: Model[]) : Model[] {

        /* Get the IDs for the models */
        let keys = _.reduce(this.getAll(), (result: any, data: ICollectionData, key: number) => {

            if (_.indexOf(models, data.model) !== -1) {
                result.push(key);
            }

            return result;

        }, []);

        return this.getAllByKey(keys);

    }


    /**
     * Get By ID
     *
     * Search through the collection for the ID
     *
     * @param id
     * @returns {any}
     */
    public getById (id : string) : Model {

        let models = this.getAllById([
            id
        ]);

        if (_.size(models) === 1) {
            return _.first(models);
        }

        return null;

    }


    /**
     * Get By Key
     *
     * Searches through the collection for the array
     * key.
     *
     * @param {number} id
     * @returns {Model}
     */
    public getByKey (id : number) : Model {

        let models = this.getAllByKey([
            id
        ]);

        if (_.size(models) === 1) {
            return _.first(models);
        }

        return null;

    }


    /**
     * Get By Model
     *
     * Search through the collection for the model
     *
     * @param {Model} model
     * @returns {Model}
     */
    public getByModel (model: Model) : Model {

        let models = this.getAllByModel([
            model
        ]);

        if (_.size(models) === 1) {
            return models[0];
        }

        return null;

    }


    /**
     * Get Count
     *
     * Counts the number of items in the collection
     *
     * @returns {number}
     */
    public getCount () {
        return _.size(this.getAll());
    }


    /**
     * Get Data
     *
     * Returns the models in order
     *
     * @returns {any[]}
     */
    public getData () : any[] {
        return _.map(this.getAll(), (item: ICollectionData) => {
            return item.model.getData();
        });
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
        return _.map(this.getAll(), (item: ICollectionData) => {
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

        _.each(this.getAll(), (item: ICollectionData, id: number) => {

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
