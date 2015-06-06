/**
 * extender
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var datautils = require("datautils");

var datatypes = datautils.data;


/* Files */


/**
 * Extender
 *
 * This is a generic extender that allows us to
 * extend an object from a static method on said
 * object (usually .extend).
 *
 * This will make it an instance of that object.
 * If you need to make it an instance of anything
 * further up, then that should be done in the
 * constructor of that object.
 *
 * @param properties
 * @param staticProps
 * @returns {Function}
 */
module.exports = function extender (properties, staticProps) {

    properties = datatypes.setObject(properties, null);
    staticProps = datatypes.setObject(staticProps, {});

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

};
