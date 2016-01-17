/**
 * collection
 */

/// <reference path="../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import {data as datatypes} from "datautils";
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
     * Each
     *
     * Cycles through each model in the collection and
     * runs the iterator function on it.
     *
     * @param {function} iterator
     * @param {object} thisArg
     * @returns {Collection}
     */
    public each (iterator : Function, thisArg: Object = null) : Collection {

        if (_.isFunction(iterator) === false) {
            throw new TypeError("iterator must be a function");
        }

        _.each(this.getAll(), (data: ICollectionData) => {
            return iterator.call(thisArg, data.model, data.id, this.getAll());
        });

        return this;

    }



    public eachRight (iterator : Function, thisArg: Object = null) : Collection {

        if (_.isFunction(iterator) === false) {
            throw new TypeError("iterator must be a function");
        }

        _.eachRight(this.getAll(), (data: ICollectionData) => {
            return iterator.call(thisArg, data.model, data.id, this.getAll());
        });

        return this;

    }


    public filter (properties : Object) : Collection {

        return this;

    }


    public find (properties : Object) : Model {

        return null;

    }


    public findLast (properties : Object) : Model {

        return null;

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
     * Get IDs
     *
     * Gets all the IDs in order
     *
     * @returns {string[]}
     */
    public getIds () : string[] {
        return _.map(this.getAll(), (item: ICollectionData) => {
            return item.id;
        });
    }


    /**
     * Limit
     *
     * Limits in the same way as MySQL limits.  The first
     * is the limit, which is the maximum number of items
     * we can keep.  The second is the offset, which is
     * the number of items we pad.
     *
     * On a collection with 5 items, limit(2, 2) will
     * only keep the data at position 2 and 3, dropping
     *
     * 0, 1 and 4 out.
     * @param {number} limit
     * @param {number} offset
     * @returns {Collection}
     */
    public limit (limit: number, offset: number = 0) : Collection {

        limit = datatypes.setInt(limit, null);

        if (limit === null || limit < 0) {
            throw new TypeError("Collection.limit must be a positive integer");
        }

        if (limit === 0) {
            /* Get rid of everything */
            this.reset();
        } else if (limit < this.getCount()) {

            /* Get the keys in the data */
            let keys = this.getIds();

            /* Slice the keys */
            let endKey = limit + offset;

            /* Work out which keys to remove */
            let removeKeys = _.difference(keys, keys.slice(offset, endKey));

            _.each(removeKeys, (key: string) => {
                this.removeById(key);
            });

        }

        return this;

    }


    /**
     * Reset
     *
     * Resets the collection back to it's original (empty)
     * state
     *
     * @returns {boolean}
     */
    public reset () : boolean {

        if (_.isEmpty(this._data)) {
            /* Nothing to do - it's already empty */
            return false;
        }

        this._data = [];

        return _.isEmpty(this._data);

    }


    /**
     * Remove By ID
     *
     * Removes the model by the ID
     *
     * @param {string} id
     * @returns {boolean}
     */
    public removeById (id: string) : boolean {

        let removed = _.remove(this._data, (data: ICollectionData) => {
            return id === data.id;
        });

        return _.size(removed) > 0;

    }


    public removeByModel (model: Model) : boolean {

        return false;

    }


    public sort (fn: Function) : Collection {

        return this;

    }


    public sortBy (params : Object, order : string = "ASC") : Collection {

        return this;

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
    public validate () : boolean {

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


    public where (properties : Object) : Collection {

        return this;

    }


    public static toModels(data : any[] = null) : Collection {

        /* Create a new instance of this collection with default data */
        let collection = Object.create(this.prototype);
        this.apply(collection, []);

        return collection;

    }


}
