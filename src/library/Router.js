/**
 * Routing
 *
 * This helps us route to an application
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");


/* Files */
var Base = require("./Base");
var datatypes = Base.datatypes;


module.exports = Base.extend({



    _construct: function (routes) {

        this._routes = {};

        this.setRoute(routes);

    },


    /**
     * Clean Slashes
     *
     * Gets rid of excess slashes from a string
     *
     * @param {string} str
     * @returns {string}
     */
    _cleanSlashes: function (str) {

        str = datatypes.setString(str, "");

        /* Remove forward slashes */
        str = str.replace(/\\/g, "/");

        /* Remove excess slashes */
        str = str.replace(/\/+/g, "/");

        return str;

    },


    /**
     * Set Route Name
     *
     * Sets the route name
     *
     * @param {string} parent
     * @param {string} route
     * @returns {string}
     */
    _setRouteName: function (parent, route) {

        parent = datatypes.setString(parent, "");
        route = datatypes.setString(route, "");

        var str = [
            parent, route
        ].join("/");

        return this._cleanSlashes(str);

    },


    /**
     * Get Routes
     *
     * Gets the set routes
     *
     * @returns {object}
     */
    getRoutes: function () {
        return this._routes;
    },


    /**
     * Set Route
     *
     * Sets a new route
     *
     * @param {object} obj
     * @param {string} route
     * @returns {undefined}
     */
    setRoute: function (obj, route) {

        obj = datatypes.setObject(obj, null);
        route = datatypes.setString(route, null);

        if (obj === null) {
            /* Nothing available to set - return object */
            return;
        }

        _.each(obj, function (value, key) {

            /* Check the type of the value - this determines how we behave */
            var tmpObj = datatypes.setObject(value, null);

            if (tmpObj !== null) {
                /* It's an object - we're not yet at the lowest level */
                this.setRoute(tmpObj, this._setRouteName(route, key));
            } else {

                /* Remove final slash */
                if (route !== "/") {
                    route = route.replace(/(\/+)$/, "");
                }

                /* Save to the instance */
                if (_.has(this._routes, route) === false) {
                    this._routes[route] = {};
                }

                if (_.has(this._routes[route], key)) {
                    /* Can't overwrite a route */
                    var err = new SyntaxError("CANNOT_OVERWRITE_A_ROUTE");
                    err.route = route;
                    err.key = key;
                    throw err;
                }

                this._routes[route][key] = value;

            }

        }, this);

    }



});
