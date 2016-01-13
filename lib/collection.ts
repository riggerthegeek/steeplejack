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


export abstract class Collection extends Base {


    protected _data: ICollectionData[] = [];


    public static model: Function = null;


    /**
     * Constructor
     *
     * Adds the data to the collection
     *
     * @param {*} data
     */
    public constructor (data: any = null) {

        super();

        this.add(data);

    }


    /**
     * Add
     *
     * Adds in the data to the collection
     *
     * @param {*} data
     * @returns {Collection}
     */
    public add (data: any = null) : Collection {

        /* Are we receiving an array? */
        if (_.isArray(data)) {

            /* Yes - cycle through each one */
            _.each(data, model => {
                this.add(model);
            });

        } else if (_.isObject(data) && _.isEmpty(data) === false) {

            /* No, it's an object */
            let model: Model;
            let modelConst: any = this.getModel();

            if (data instanceof modelConst) {
                /* Already an instance of the model */
                model = data;
            } else {
                /* Convert the data into an instance of the model */
                model = new modelConst(data);
            }

            this._data.push({
                id: "string",
                model: model
            });

        }

        return this;

    }


    /**
     * Get Data
     *
     * Returns the models in order
     *
     * @returns {Model[]}
     */
    public getData () : Model[] {
        return _.map(this._data, (item: ICollectionData) => {
            return item.model;
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


}
