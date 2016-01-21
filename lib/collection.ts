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
import {Model} from "./model";
import {sortAsc, sortDesc} from "../helpers/sorting";
import {ValidationException} from "../exception/validation/index";


export abstract class Collection extends Base {


    protected _data: any = {};


    protected _order: string[] = [];


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
            let ModelConstructor: any = this._model();

            if (data instanceof ModelConstructor) {
                /* It's already an instance of the model */
                model = <Model>data;
            } else {
                /* Convert the data into an instance of the model */
                model = new ModelConstructor(data);
            }

            /* Add to the collection */
            let id = uuid.v4();
            this._order.push(id);
            this._data[id] = model;

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

        let collection = this.getAll();

        _.each(collection, (data: ICollectionData) => {
            return iterator.call(thisArg, data.model, data.id, collection);
        });

        return this;

    }


    /**
     * Each Right
     *
     * Cycles through each model in the collection backwards
     * and runs the iterator function on it.
     *
     * @param {function} iterator
     * @param {object} thisArg
     * @returns {Collection}
     */
    public eachRight (iterator : Function, thisArg: Object = null) : Collection {

        if (_.isFunction(iterator) === false) {
            throw new TypeError("iterator must be a function");
        }

        let collection = this.getAll();

        _.eachRight(collection, (data: ICollectionData) => {
            return iterator.call(thisArg, data.model, data.id, collection);
        });

        return this;

    }


    /**
     * Filter
     *
     * Anything that matches is removed from the
     * collection.  This is the opposite of where().
     *
     * @param {object} properties
     * @returns {Collection}
     */
    public filter (properties : Object) : Collection {

        this.each((model: Model, id: string) => {
            if (model.where(properties)) {
                /* Remove this from the collection */
                this.removeById(id);
            }
        });

        return this;

    }


    /**
     * Find
     *
     * Similar to the where method, except that this
     * returns the first model that returns a match.
     * This may mean that there are additional things
     * that would match.
     *
     * @param {object} properties
     * @returns {null}
     */
    public find (properties : Object) : Model {

        let result: Model = null;

        this.each((model: Model) => {
            if (result === null && model.where(properties)) {
                result = model;
            }
        });

        return result;

    }


    /**
     * Find Last
     *
     * Opposite of find method.  This performs a
     * reverse search on the collection, finding
     * the last matching model.
     *
     * @param {object} properties
     * @returns {Model}
     */
    public findLast (properties : Object) : Model {

        let result: Model = null;

        this.eachRight((model: Model) => {
            if (result === null && model.where(properties)) {
                result = model;
            }
        });

        return result;

    }


    /**
     * Get All
     *
     * Returns the data array
     *
     * @returns {ICollectionData[]}
     */
    public getAll () : ICollectionData[] {
        return _.map(this._order, (id: string) => {
            return {
                id,
                model: this._data[id]
            };
        });
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
     * Get Model
     *
     * Gets the model constructor
     *
     * @returns {Object}
     */
    public getModel () : Object {
        return this._model();
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

        this._data = {};
        this._order = [];

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

        if (_.has(this._data, id)) {
            delete this._data[id];
            _.remove(this._order, orderId => {
                return orderId === id;
            });
            return true;
        }

        return false;

    }


    /**
     * Remove By Model
     *
     * Removes the given model
     *
     * @param {Model} removeModel
     * @returns {boolean}
     */
    public removeByModel (removeModel: Model) : boolean {

        let removed = false;

        _.each(this._data, (model: Model, id: string) => {
            if (removeModel === model) {
                removed = this.removeById(id);
            }

        });

        return removed;

    }


    /**
     * Sort
     *
     * Sort by the given sortation function. This
     * works in the same way as the Array.prototype.sort
     * method.
     *
     * @param {function} fn
     * @returns {Collection}
     */
    public sort (fn: (a: any, b: any) => number) : Collection {

        if (_.isFunction(fn) === false) {
            throw new TypeError("Collection.sort must receive a function");
        }

        /* Get the array with everything */
        let sorted = this.getAll();

        /* Sort the array by the values */
        sorted.sort(fn);

        /* Change the order array */
        this._order = _.reduce(sorted, (result: string[], data: ICollectionData) => {
            result.push(data.id);

            return result;
        }, []);

        return this;

    }


    /**
     * Sort By
     *
     * This sorts by a key (or keys) in the model. The
     * params should be an object, with the key as the
     * key and the direction as the value.  The acceptable
     * direction values are "ASC" or "DESC".  This works
     * in broadly the same way as MySQLs sorting.
     *
     * @param {object} properties
     * @returns {Collection}
     */
    public sortBy (properties : ISortProperty ) : Collection {

        if (_.isPlainObject(properties) === false) {
            throw new TypeError("Collection.sortBy must receive an object of keys and directions");
        }

        /* Build a search object */
        let search = _.reduce(properties, (result: any, order: string, key: string) => {

            /* Default to ascending */
            result[key] = order.toUpperCase() === "DESC" ? sortDesc : sortAsc;

            return result;

        }, {});

        /* Dispatch to the sort method */
        return this.sort((a: ICollectionData, b: ICollectionData) => {

            let keys = _.keys(search);
            let keyLength = keys.length;
            let forEnd = keyLength - 1;

            for (let integer = 0; integer < keyLength; integer++) {

                /* Decide what we're searching by - go in search object order */
                let key = keys[integer];

                /* Get the value from the model */
                let value1 = a.model.get(key);
                let value2 = b.model.get(key);

                if (_.isString(value1)) {
                    value1 = value1.toLowerCase();
                }
                if (_.isString(value2)) {
                    value2 = value2.toLowerCase();
                }

                if (value1 === value2 && integer !== forEnd) {
                    /* Equal and not final sort key - things to do */
                    break;
                } else {
                    return search[key](value1, value2);
                }

            }

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


    /**
     * Where
     *
     * Performs a where query on the collection.  Removes
     * anything that doesn't meet the criteria from the
     * collection.  This is the opposite of filter().
     *
     * @param {object} properties
     * @returns {Collection}
     */
    public where (properties : Object) : Collection {

        this.each((model: Model, id: string) => {

            if (model.where(properties) === false) {
                /* Remove from the collection */
                this.removeById(id);
            }

        });

        return this;

    }


    /**
     * To Models
     *
     * Creates an instance of the collection object and
     * populates it with the model.toModel method. This
     * can be used to convert a data store result into
     * a collection of models
     *
     * @param {any[]} data
     * @returns {Collection}
     */
    public static toModels(data : any[] = null) : Collection {

        /* Create a new instance of this collection with default data */
        let collection = Object.create(this.prototype);
        this.apply(collection, []);

        _.each(data, item => {
            if (_.isObject(item) && _.isEmpty(item) === false) {
                let model = collection.getModel().toModel(item);

                collection.addOne(model);
            }
        });

        return collection;

    }


}
