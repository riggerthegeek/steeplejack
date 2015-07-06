/**
 * Plugin
 *
 * Manages the registration and use of a
 * steeplejack plugin.  This is so that
 * whole sections of code, written in
 * steeplejack-friendly syntax, can be
 * exported as a separate package and
 * reused.
 *
 * I do like DRY code
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var glob = require("glob");


/* Files */
var Base = require("./Base");
var datatypes = Base.datatypes;


module.exports = Base.extend({


    _construct: function (files) {

        this._modules = [];

        /* Set the module files */
        this.setModules(files);

    },


    /**
     * Get Modules
     *
     * Gets the modules array
     *
     * @returns {Array}
     */
    getModules: function () {
        return this._modules;
    },


    /**
     * Set Modules
     *
     * Sets the modules to be included with this
     * plugin
     *
     * @param module
     * @returns {exports}
     */
    setModules: function (module) {

        if (_.isArray(module)) {

            /* Array of module */
            _.each(module, function (mod) {
                this.setModules(mod);
            }, this);

        } else if (_.isUndefined(module) === false && _.isNull(module) === false) {

            this._modules.push(module);

        }

        return this;

    }


});
