/**
 * Definition
 *
 * The Model definition object.  This ensures consistency
 * in the definition of Models
 *
 * Although this is technically a Model, it cannot use the
 * DomainModel object as that would create a circular
 * dependency.
 *
 * @package DomainModel
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var Base = require("../Base");
var datatypes = Base.datatypes;
var Validation = require("./Validation");


var Definition = Base.extend({


    _construct: function (options) {

        options = datatypes.setObject(options, {});

        var type = null;
        if (datatypes.setEnum(typeof options.type, ["string", "function"], null) !== null) {
            type = options.type;
        }

        this.type = type;
        this.value = options.value !== undefined ? options.value : null;
        /* Default to null */
        this.column = datatypes.setString(options.column, null);
        this.primaryKey = datatypes.setBool(options.primaryKey, false);
        this.validation = null;
        this.enum = datatypes.setArray(options.enum, []);
        this.settings = datatypes.setObject(options.settings, {});

        if (options.validation) {
            this.addValidation(options.validation);
        }

        return this;

    },


    /**
     * Add Validation
     *
     * Adds a validation rule to the definition
     *
     * @param {array|object} objRule
     * @returns {undefined}
     */
    addValidation: function (objRule) {

        if (objRule instanceof Array) {
            for (var i = 0; i < objRule.length; i++) {
                this.addValidation(objRule[i]);
            }
            return;
        }

        objRule = datatypes.setObject(objRule, null);

        /* Ignore if nothing set */
        if (objRule === null) {
            return;
        }

        var fnValidation = Validation.generateFunction(objRule, this.value);

        /* Ensure validation is an array */
        this.validation = datatypes.setArray(this.validation, []);

        this.validation.push(fnValidation);

    },


    /**
     * Get Setting
     *
     * Returns the given setting parameter
     *
     * @param {string} setting
     * @returns {object}
     */
    getSetting: function getter (setting) {
        return this.settings[setting];
    },


    /**
     * Has Primary Key
     *
     * Does this definition have the primary key
     *
     * @returns {bool}
     */
    hasPrimaryKey: function () {
        return this.primaryKey;
    }


}, {


    /**
     * To Definition
     *
     * This receives at least one object and converts them into
     * Definition objects
     *
     * @param {string} name
     * @param {object} definition
     * @returns {undefined}
     */
    toDefinition: function (name, definition) {

        definition = datatypes.setObject(definition, {});

        return Definition.create({
            type: definition.type,
            value: definition.value,
            column: definition.column || name,
            primaryKey: definition.primaryKey,
            validation: definition.validation,
            enum: definition.enum,
            settings: definition.settings
        });

    }


});


module.exports = Definition;
