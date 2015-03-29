/**
 * Base
 *
 * This is our base object.  Everything extends from
 * here to given consistency and allows for good
 * inheritance.
 */

"use strict";


/* Node modules */
var EventEmitter = require("events").EventEmitter;
var util = require("util");


/* Third-party modules */
var _ = require("lodash");
var datautils = require("datautils");

var datatypes = datautils.data;


/* Files */


/**
 * Define Property
 *
 * @param {object} obj
 * @param {string} name
 * @param {*} value
 */
function defineProperty (obj, name, value) {

    obj = datatypes.setObject(obj, null);
    name = datatypes.setString(name, null);

    Object.defineProperty(obj, name, {
        value: value,
        writable: true,
        enumerable: name.match(/^\_/) === null,
        configurable: true
    });

}


function Base () {


    if (this instanceof Base === false) {
        throw new SyntaxError("Class must be instantiated with new or create()");
    }


    EventEmitter.call(this);


    /**
     * Construct
     *
     * Override this as required.  By default, it doesn't actually do
     * anything
     */
    defineProperty(this, "_construct", Base.datatypes.setFunction(this._construct, function () {
    }));


    /* Activate the constructor */
    this._construct.apply(this, arguments);


    /* Set the properties - ones starting _ are hidden */
    for (var key in this) {
        var definition = Object.getOwnPropertyDescriptor(this, key);

        if (definition === undefined || definition.configurable === true) {
            defineProperty(this, key, this[key]);
        }
    }


    return this;


}


util.inherits(Base, EventEmitter);


/**
 * Prototype methods
 */


_.extend(Base.prototype, {


    /**
     * Clone
     *
     * Clones the object, returning a new instance of
     * this object
     *
     * @returns {object}
     */
    clone: function () {

        /* If this._Class not set, it's only an instance of Base */
        var constructor = this._Class || this.constructor;
        var clone = constructor.create();

        var cloneIgnore = Base.datatypes.setArray(this._cloneIgnore, []);

        /* Get the values from this and set to clone */
        Object.getOwnPropertyNames(this).map(function (name) {
            if (_.indexOf(cloneIgnore, name) === -1) {
                defineProperty(clone, name, _.clone(this[name]));
            }
        }, this);

        return clone;

    }

});


/**
 * Static methods
 */


_.extend(Base, {


    /**
     * Create
     *
     * Factory method to create a new instance of the object
     *
     * @returns {object}
     */
    create: function create () {

        var obj = Object.create(this.prototype);

        return this.apply(obj, arguments);

    },


    /**
     * DataTypes
     *
     * Expose the datatypes module to allow
     * consistent data coersion throughout
     * the package.
     */
    datatypes: datatypes,


    /**
     * Extend
     *
     * Allows us to extend the Base object
     *
     * @param {object} properties
     * @param {object} staticProps
     * @returns {object}
     */
    extend: function extend (properties, staticProps) {

        properties = this.datatypes.setObject(properties, null);
        staticProps = this.datatypes.setObject(staticProps, {});

        var parent = this;
        var Class = function () {
            return parent.apply(this, arguments);
        };

        /* Add static properties */
        _.extend(Class, parent, staticProps);

        function Surrogate () {
        }

        Surrogate.prototype = parent.prototype;
        Class.prototype = new Surrogate();

        /* Attach the parent */
        Class.prototype._super = parent.prototype;

        if (properties) {
            _.extend(Class.prototype, properties);
        }

        Class.prototype._Class = Class;

        /* Set the parent to the super_ parameter - keep consistent with util.inherits */
        Class.super_ = parent;

        return Class;

    },


    /**
     * Extends Constructor
     *
     * Resolves if the first class extends the second class. This
     * does not instantiate the class but looks in the super_
     * parameter, so should be able to be used by both Node and
     * steeplejack classes
     *
     * @param ChildClass
     * @returns {boolean}
     */
    extendsContructor: function extendsContructor (ChildClass) {

        ChildClass = datatypes.setFunction(ChildClass, null);

        /* Convert to array and remove first one */
        var classes = Array.prototype.slice.call(arguments);
        classes.splice(0, 1);

        return _.some(classes, function (ParentClass) {

            var tmp = ChildClass;
            ParentClass = datatypes.setFunction(ParentClass, null);

            /* Default to false */
            var extenderOf = false;

            if (tmp !== null && ParentClass !== null) {

                var cont = true;
                do {

                    if (tmp === ParentClass) {
                        /* Extends it */
                        cont = false;
                        extenderOf = true;
                    } else if (_.has(tmp, "super_")) {
                        tmp = tmp.super_;
                    } else {
                        /* Can't continue */
                        cont = false;
                    }

                } while (cont);

            }

            return extenderOf;

        });

    },


    validation: datautils.validation


});


module.exports = Base;
