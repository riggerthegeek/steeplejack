/**
 * Collection
 *
 * A collection is a series of Models put
 * together so that they can be useful.
 *
 * @package steeplejack
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var uuid = require("node-uuid");


/* Files */
var Base = require("./Base");
var datatypes = Base.datatypes;
var Model = Base.Model;


/**
 * Sort ASC
 *
 * Allows sorting in ascending order
 *
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */
function sortASC (a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}


/**
 * Sort DESC
 *
 * Allows sorting in descending order
 *
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */
function sortDESC (a, b) {
    if (a < b) {
        return 1;
    } else if (a > b) {
        return -1;
    } else {
        return 0;
    }
}


module.exports = Base.extend({



    /**
     * Construct
     *
     * Invoked when this object is called.  It handles
     * whatever is initially passed through to it.
     *
     * @param {*} data
     * @returns {undefined}
     */
    _construct: function (data) {

        /**
         * Data
         *
         * This is where the data for this collection
         * is stored
         */
        this.data = {};

        this.add(data);
    },


    /**
     * Add
     *
     * Adds in the model to the collection
     *
     * @param {object} data
     */
    add: function (data) {

        /* Check if it's an array */
        if (data instanceof Array) {
            _.each(data, function (model) {
                this.add(model);
            }, this);
        } else {
            /* Check that it's an object */
            data = datatypes.setObject(data, null);

            if (data !== null) {

                /* Don't create anything if an empty object is given */
                if (_.isEmpty(data)) {
                    return;
                }

                /* Put it to the model */
                var obj;
                if (data instanceof this.model) {
                    /* Already instance of the model */
                    obj = data;
                } else {
                    obj = this.model.create(data);
                }

                var key = uuid.v4();
                this.data[key] = obj;

            }
        }

    },


    /**
     * Each
     *
     * Assigns forEach to each
     *
     * @param {function} iterator
     * @param {object} thisArg
     * @returns {object}
     */
    each: function (iterator, thisArg) {
        return this.forEach(iterator, thisArg);
    },


    /**
     * For Each
     *
     * This is fundamentally a copy of the Lodash forEach
     * method.  It allows us to cycle through each model
     * in the collection.
     *
     * @param {function} iterator
     * @param {object} thisArg
     * @returns {object}
     */
    forEach: function (iterator, thisArg) {

        var self = this;

        iterator = datatypes.setFunction(iterator, null);

        if (iterator === null) {
            throw new TypeError("iterator must be a function");
        }

        _.each(this.getAll(), function (model, id, obj) {
            return iterator.call(thisArg, self.get(id), id, obj);
        }, thisArg);

        return this;

    },


    /**
     * Get All
     *
     * Gets everything
     *
     * @return {array}
     */
    getAll: function () {
        return this.data;
    },


    /**
     * Get Count
     *
     * Counts the number of items in the collection
     *
     * @returns {array}
     */
    getCount: function () {
        return _.size(this.getAll());
    },


    /**
     * Get Keys
     *
     * Gets the IDs of the models
     *
     * @returns {array}
     */
    getKeys: function () {
        return _.keys(this.data);
    },


    /**
     * Get
     *
     * Gets the specific model from the collection
     *
     * @param {int|string|object|array} id
     * @param {bool} getUUID
     * @returns {*}
     */
    get: function (id, getUUID) {

        getUUID = datatypes.setBool(getUUID, false);

        if (id instanceof Array) {

            var self = this;

            var out = [];

            id.forEach(function (element) {
                out.push(self.get(element, getUUID));
            });

            return out;

        } else {

            if (id instanceof this.model) {

                for (var key in this.data) {
                    if (id === this.data[key]) {
                        return getUUID ? key : this.data[key];
                    }
                }

            } else {

                /* First check for integer */
                var int = datatypes.setInt(id, null);

                if (int !== null) {
                    /* Get the ID of the position */
                    var arr = _.values(this.data);

                    if (arr[int]) {

                        var model = arr[int];

                        if (getUUID) {
                            /* Get the model */
                            return this.get(model, true);
                        } else {
                            return model;
                        }
                    }
                } else {

                    var str = datatypes.setString(id, null);

                    if (this.data[str]) {
                        return getUUID ? str : this.data[str];
                    }

                }


            }

        }

        return null;

    },


    /**
     * Remove
     *
     * Removes the specific model or models
     * from the collection
     *
     * @param {int|object|array|string} model
     * @returns {bool|array}
     */
    remove: function (model) {

        var self = this;

        var int, str;

        /* Input maybe a model, array or integer */
        if (model instanceof Array) {

            if (model.length > 0) {

                var out = [];

                var toDelete = [];

                /* Array */
                model.forEach(function (id) {

                    var deleted = false;

                    /* Check what type the id is - int, string or instance */
                    if (id instanceof self.model) {
                        /* It's an instance of the model - find it's UUID */
                        var modelKey = self.get(id, true);

                        if (modelKey !== null) {
                            deleted = true;
                            toDelete.push(modelKey);
                        }

                    } else {

                        int = datatypes.setInt(id, null);

                        if (int === null) {

                            /* Do it by UUID */
                            str = datatypes.setString(id, null);

                            if (self.get(str) !== null) {
                                deleted = true;
                                toDelete.push(str);
                            }

                        } else {

                            /* Do it by integer */
                            var i = 0;

                            for (var key in self.data) {
                                if (i === int) {
                                    deleted = true;

                                    toDelete.push(key);
                                }
                                i++;
                            }

                        }

                    }

                    out.push(deleted);
                });

                self.data = _.omit(self.data, toDelete);

                return out;

            }

        } else if (model instanceof this.model) {

            for (var key in this.data) {
                if (model === this.data[key]) {
                    return self.remove(key);
                }
            }

        } else {

            /* Integer */
            int = datatypes.setInt(model, null);

            if (int !== null) {

                /* Do it by integer */
                return self.remove([int])[0];

            } else {

                /* Do it by UUID */
                str = datatypes.setString(model, null);

                if (str !== null) {

                    if (self.data[str]) {
                        delete self.data[str];
                        return true;
                    }

                }

            }

        }

        /* Default to nothing removed */
        return false;

    },


    /**
     * Reset
     *
     * Resets the collection back to it's original (empty)
     * setting
     *
     * @return {bool}
     */
    reset: function () {

        if (_.isEmpty(this.data)) {
            /* Nothing to do - it's already empty */
            return false;
        }

        this.data = {};

        return _.isEmpty(this.data);

    },


    /**
     * Sort
     *
     * Sort by the given sortation function
     *
     * @param {function} fn
     * @returns {this}
     */
    sort: function (fn) {

        /* Ensure it's a function */
        fn = datatypes.setFunction(fn, null);

        if (fn === null) {
            throw new SyntaxError("Collection.sort must receive a function");
        }

        /* Build an array that we can sort through */
        var sorted = _.map(this.getAll(), function (model, id) {
            return {
                id: id,
                model: model
            };
        });

        /* Sort the array by the values */
        sorted.sort(fn);

        /* Clone the object */
        var clone = this.clone();

        /* Reset this object */
        this.reset();

        /* Put the models back in in the correct order */
        _.each(sorted, function (values) {
            var id = values.id;
            this.data[id] = clone.get(id);
        }, this);

        return this;

    },


    /**
     * Sort By
     *
     * This sorts by a key (or keys) in the model. The
     * params parameter can be either a string or an
     * object of strings.  The param object should
     * specify the search key as the object key and
     * then either "ASC" or "DESC" as the value.
     *
     * The order parameter is only set if the first
     * argument is a string.  Like a SQL database,
     * this should be either "ASC" or "DESC".
     *
     * @param {object|string} params
     * @param {string} order
     * @returns {this}
     */
    sortBy: function (params, order) {

        var objParams = {};

        /* Have we received a string? */
        var str = datatypes.setString(params, null);

        if (str !== null) {

            /* Build a params object */
            objParams[str] = order;

        } else {

            /* Have we received an object? */
            objParams = datatypes.setObject(params, null);

            if (objParams === null) {
                /* An array */
                var arrParams = datatypes.setArray(params, null);

                if (arrParams !== null) {
                    objParams = _.reduce(arrParams, function (result, key) {
                        key = datatypes.setString(key, null);

                        if (key !== null) {
                            result[key] = "ASC";
                        }

                        return result;
                    }, {});
                } else {
                    throw new SyntaxError("Collection.sortBy must receive string, object or array");
                }
            }

        }

        /* Build the search object */
        var objSearch = _.reduce(objParams, function (result, order, key) {

            key = datatypes.setString(key, null);
            order = datatypes.setString(order, "");

            order = datatypes.setEnum(order.toUpperCase(), [
                "ASC", "DESC"
            ], "ASC");

            /* Attach the key and the sorting function */
            result[key] = order === "ASC" ? sortASC : sortDESC;

            return result;

        }, {});


        /* Activate this using the main sort function */
        return this.sort(function (a, b) {

            var keys = _.keys(objSearch);
            var keyLength = keys.length;
            var forEnd = keyLength - 1;

            for (var i = 0; i < keyLength; i++) {

                /* Decide what we're searching by - go in search object order */
                var key = keys[i];

                /* Get the value from the model */
                a = a.model.get(key);
                b = b.model.get(key);

                if (typeof a === "string") {
                    a = a.toLowerCase();
                }
                if (typeof b === "string") {
                    b = b.toLowerCase();
                }

                if (a === b && i !== forEnd) {
                    /* Equal and not final sort key - things to do */
                    break;
                } else {
                    return objSearch[key](a, b);
                }

            }
        });

    },


    /**
     * To JSON
     *
     * Converts the whole collection into a JSON
     * array.
     *
     * @returns {array}
     */
    toJSON: function () {
        return _.map(this.getAll(), function (model) {
            return model.toObject();
        }, this);
    },


    /**
     * Where
     *
     * Performs a where query on the collection.  Removes
     * anything that doesn't meet the criteria from the
     * collection.
     *
     * @param {object} props
     * @returns {exports}
     */
    where: function (props) {

        _.each(this.getAll(), function (model, id, all) {
            if (model.where(props) === false) {
                /* Remove this from the collection */
                this.remove(id);
            }
        }, this);

        return this;

    }


}, {


    /**
     * To Models
     *
     * Creates an instance of the collection object and
     * populates it with the model.toModel method. This
     * can be used to convert a data store result into
     * a collection of models
     *
     * @returns {object}
     */
    toModels: function (data) {

        /* Create an instance of the collection */
        var collection = this.create();

        var array = datatypes.setArray(data, null);

        if (array === null) {
            data = datatypes.setObject(data, null);

            /* Push to an array */
            array = data !== null ? [data] : [];
        }

        _.each(array, function (item) {

            item = datatypes.setObject(item, null);

            if (_.isEmpty(item) === false) {

                /* Create the model */
                var model = this.model.toModel(item);

                this.add(model);

            }

        }, collection);

        return collection;

    }


});
