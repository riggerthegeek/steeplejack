/**
 * Domain Model
 *
 * A model is a representation of data so it
 * can be used in a consistent way throughout
 * the application.
 *
 * @package steeplejack
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");


/* Files */
var Base = require("../Base");
var Collection = require("../Collection");
var Definition = require("./Definition");
var datatypes = Base.datatypes;
var Exception = require("../../error/Validation");


/* Create the superclass */
var DomainModel = Base.extend({


    /**
     * Construct
     *
     * The constructor function.  This is run
     * every time a new version of the model is
     * instantiated
     *
     * @param {object} data
     * @returns {undefined}
     */
    _construct: function (data) {

        /* Set the data */
        data = datatypes.setObject(data, null);

        this._cloneIgnore = [
            "definition",
            "definition"
        ];

        /* Default values */
        this._attr = {};
        this._primaryKey = null;

        this._setDefinition();

        /* Set the data */
        if (data !== null) {
            _.each(data, function (value, key) {
                this.set(key, value, true);
            }, this);
        }

    },


    /**
     * Set Definition
     *
     * Sets the model definition
     *
     * @returns {undefined}
     */
    _setDefinition: function setter () {

        var objInput = {};

        /* Add in this definition */
        _.extend(objInput, datatypes.setObject(this.definition, {}));

        /* Extend with any parent definitions */
        var parent = this;
        while (parent instanceof DomainModel) {
            _.extend(objInput, datatypes.setObject(parent.definition, {}));

            /* Go up the chain */
            parent = parent._super;
        }

        var definition = {};
        var key;

        for (key in objInput) {

            var tmp = Definition.toDefinition(key, objInput[key]);

            definition[key] = tmp;

            if (tmp.hasPrimaryKey()) {
                this._setPrimaryKey(key);
            }

        }

        /* Set the properties here so we can hide them and made read-only */
        Object.defineProperty(this, "definition", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: definition
        });

        /* Set the default values */
        _.each(definition, function (value, key) {
            this.set(key, undefined, false);
        }, this);

    },


    /**
     * Set Primary Key
     *
     * Sets the primary key
     *
     * @param {string} key
     * @returns {undefined}
     */
    _setPrimaryKey: function (key) {

        if (this.getPrimaryKey() === null) {
            this._primaryKey = key;
        } else {
            throw new Error("CANNOT_SET_MULTIPLE_PRIMARY_KEYS");
        }

    },


    /**
     * Get Column Keys
     *
     * Gets the keys and the column name
     * as an array of objects
     *
     * @returns {array}
     */
    getColumnKeys: function getter () {

        var arr = [];
        if (this.definition && _.isEmpty(this.definition) === false) {

            var definition = _.clone(this.definition);

            for (var key in definition) {

                var value = definition[key];

                arr.push({
                    key: key,
                    column: value.column
                });

            }

        }

        return arr;

    },


    /**
     * Get Definition
     *
     * Gets the definition object for the given
     * key
     *
     * @param {string} key
     * @returns {object}
     */
    getDefinition: function getter (key) {
        if (datatypes.setString(key, null) === null) {
            return null;
        }
        return this.definition[key] || null;
    },


    /**
     * Get Primary Key
     *
     * Gets the primary key
     *
     * @return {string}
     */
    getPrimaryKey: function () {
        return this._primaryKey;
    },


    /**
     * Get Primary Key Value
     *
     * Gets the value of the primary key
     *
     * @returns {*}
     */
    getPrimaryKeyValue: function () {
        return this.get(this.getPrimaryKey());
    },


    /**
     * Get
     *
     * Gets an individual parameter
     *
     * @param {string} key
     * @params {boolean} checkForCustom
     * @returns {*}
     */
    get: function getter (key, checkForCustom) {

        var getFunc = DomainModel.getFnName("get", key);
        checkForCustom = datatypes.setBool(checkForCustom, true);

        if (checkForCustom === true && getFunc !== null && this[getFunc] && typeof this[getFunc] === "function") {

            return this[getFunc]();

        } else {

            return this._attr[key];

        }

    },


    /**
     * Set
     *
     * Sets the value to the object
     *
     * @param {string} key
     * @param {*} value
     * @param {boolean} checkForCustom
     * @returns {undefined}
     */
    set: function setter (key, value, checkForCustom) {

        var definition = this.getDefinition(key);

        /* Get the definition key */
        if (definition !== null) {

            checkForCustom = datatypes.setBool(checkForCustom, true);

            var defaults = definition.value;

            /* Search for a set function - makes it setKey() */
            var setFunc = DomainModel.getFnName("set", key);

            if (checkForCustom === true && setFunc !== null && this[setFunc] && typeof this[setFunc] === "function") {

                return this[setFunc](value, defaults);

            } else {

                var err;

                if (typeof definition.type === "function") {

                    /* Does it extend DomainModel or Collection? */
                    if (Base.extendsContructor(definition.type, DomainModel, Collection)) {
                        /* Instanceof DomainModel or Collection */
                        if (value instanceof definition.type === false) {
                            var createCollection = false;

                            if (value instanceof Array) {
                                createCollection = true;
                            } else {
                                value = datatypes.setObject(value, defaults);
                                createCollection = value !== defaults;
                            }

                            if (createCollection) {
                                value = definition.type.create(value);
                            }
                        }
                    } else {
                        value = definition.type(value, defaults);
                    }

                } else {

                    /* Set the datatype */
                    switch (definition.type) {

                        case "array":
                        {
                            value = datatypes.setArray(value, defaults);
                            break;
                        }

                        case "boolean":
                        {
                            value = datatypes.setBool(value, defaults);
                            break;
                        }

                        case "date":
                        {
                            value = datatypes.setDate(value, defaults);
                            break;
                        }

                        case "enum":
                        {
                            /* Doesn't matter the datatype as they're set */
                            value = datatypes.setEnum(value, definition.enum, defaults);
                            break;
                        }

                        case "float":
                        {
                            value = datatypes.setFloat(value, defaults);
                            break;
                        }

                        case "integer":
                        {
                            value = datatypes.setInt(value, defaults);
                            break;
                        }

                        case "object":
                        {
                            value = datatypes.setObject(value, defaults);
                            break;
                        }

                        case "string":
                        {
                            value = datatypes.setString(value, defaults);
                            break;
                        }

                        case "mixed":
                        {
                            if (value === undefined) {
                                value = defaults;
                            }
                            break;
                        }

                        default:
                        {
                            err = new TypeError("DATATYPE_NOT_VALID");
                            err.type = definition.type;
                            break;
                        }

                    }

                }

                if (err) {
                    throw err;
                }

                /* Set the value */
                this._attr[key] = value;

            }

        }

        return this;

    },


    /**
     * To Data
     *
     * Pushes the data to the database
     * representation.
     *
     * @returns {object}
     */
    toData: function () {

        var obj = {};
        var keys = Object.keys(this.definition);

        for (var i = 0; i < keys.length; i++) {

            var key = keys[i];

            /* Get the column name */
            var column = this.definition[key].column;

            obj[column] = this.get(key);

        }

        return obj;

    },


    /**
     * To Object
     *
     * Clones out the data as an object
     * of key/value pairs
     *
     * @returns {object}
     */
    toObject: function () {

        var obj = {};
        var keys = Object.keys(this.definition);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];

            var value = this.get(key, false); /* Just return the data, not the getter */

            /* If value is a DomainModel or Collection, get that as an object */
            if (value instanceof DomainModel) {
                value = value.toObject();
            } else if (value instanceof Collection) {
                value = value.toJSON();
            }

            obj[key] = value;
        }

        return obj;
    },


    /**
     * Validate
     *
     * Validates the model against the validation
     * rules.  It throws an error if it detects a
     * violation of the rules.  If it's fine, it
     * continues without any problems.
     *
     * @returns true
     * @throws {Error}
     */
    validate: function () {

        var objValidationError = new Exception("DOMAINMODEL_ERROR");

        /* Run through each of the definitions for the validation rules */
        for (var key in this.definition) {

            var arrValidate = this.getDefinition(key).validation;

            /* Ensure an array */
            arrValidate = datatypes.setArray(arrValidate, []);

            for (var i = 0; i < arrValidate.length; i++) {

                /* This will be a function - run it */
                var rule = arrValidate[i];

                var value = this.get(key);

                try {
                    /* By default, we expect this to throw an error */
                    if (rule(this, value) === false) {
                        /* A custom error where they've returned false */
                        throw new Error("CUSTOM_VALIDATION_FAILED");
                    }
                } catch (err) {
                    /* Add the validation error */
                    objValidationError.addError(key, value, err.message, err.params);
                }

            }

        }

        if (objValidationError.hasErrors()) {
            /* There's validation errors */
            throw objValidationError;
        }

        /* Not really needed, but it shows we're happy with it */
        return true;

    },


    /**
     * Where
     *
     * Does this model fulfil this rule?
     *
     * @param {object} props
     * @returns {boolean}
     */
    where: function (props) {

        props = datatypes.setObject(props, null);

        if (props === null) {
            throw new SyntaxError("where.props must be an object");
        }

        /* Empty always returns false */
        if (_.isEmpty(props)) {
            return false;
        }

        /* Clone this so we can use the setter without breaking the main reference */
        var tmp = this.clone();

        _.forEach(props, function (value, key) {
            this.set(key, value);

            value = this.get(key);

            if (_.isObject(value)) {
                /* Set objects to strings */
                value = value.toString();
            }
            props[key] = value;
        }, tmp);

        /* What properties are set? */
        var obj = {};
        _.forEach(props, function (value, key) {
            value = this.get(key);

            if (_.isObject(value)) {
                /* Set objects to strings */
                value = value.toString();
            }
            obj[key] = value;
        }, this);

        return _.isEqual(props, obj);

    }


}, {


    getFnName: function (prefix, name) {
        prefix = datatypes.setString(prefix, null);
        name = datatypes.setString(name, null);

        if (prefix === null || name === null) {
            return;
        }

        return prefix + name.charAt(0).toUpperCase() + name.slice(1);
    },


    /**
     * To Model
     *
     * Pushes the data object into a model
     *
     * @param {object} objData
     * @returns {Model}
     */
    toModel: function toModel (objData) {

        objData = datatypes.setObject(objData, {});

        /* Create instance of model - this doesn't feel right, but it works */
        var obj = this.create();

        /* Get the definition */
        var def = obj.getColumnKeys();

        /* Set the information to the model */
        for (var i = 0; i < def.length; i++) {
            var key = def[i].key;
            var value = objData[def[i].column];

            obj.set(key, value);
        }

        return obj;

    }


});


module.exports = DomainModel;
