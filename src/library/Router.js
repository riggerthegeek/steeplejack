/**
 * Routing
 *
 * This helps us route to an application
 */

"use strict";


/* Node modules */
var path = require("path");


/* Third-party modules */
var _ = require("lodash");
var walk = require("walk");


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



}, {


    /**
     * Discover Routes
     *
     * This is discovers the route files in the
     * given route directory and then loads them
     * up.  It then returns an array of route
     * functions that can be used.
     *
     * @param routeDir
     * @returns Array
     */
    discoverRoutes: function (routeDir) {

        return _.reduce(this.getRouteFiles(routeDir), function (result, route) {

            var routeName = route.name;
            var cwd = route.parent;

            /**
             * Split into segments - first is require name,
             * second is route name. We don't care about
             * the extension
             */
            var segments = routeName.match(/^(((\w+)\/)?((\w{1,})))/);
            if (segments !== null) {
                var requireName = segments[1];
                var tmp = segments[5];

                if (tmp === "index") {
                    tmp = segments[3];
                } else if (segments[2]) {
                    tmp = segments[2] + tmp;
                }

                /* Load the route file */
                var objRoute = require(path.join(cwd, tmp));

                /* Put in stack */
                result[tmp] = objRoute;

            }

            return result;

        }, {}, this);

    },


    /**
     * Get Route Files
     *
     * Gets the route files.  Whilst it's not terribly
     * good form to do synchronous file tasks, as this
     * is only run once and before the server starts,
     * it's acceptable.
     *
     * @param parent
     * @returns {object}
     */
    getRouteFiles: function (parent) {

        parent = Base.datatypes.setString(parent, "");

        if (parent === "") {
            throw new SyntaxError("parent is a required argument");
        }

        var routeFiles = [];

        walk.walkSync(parent, {

            listeners: {
                file: function (root, fileStats, next) {

                    var fullName = path.join(root, fileStats.name);

                    /* Remove the parent path from the string */
                    fullName = fullName.replace(parent + path.sep, "");

                    routeFiles.push({
                        name: fullName,
                        parent: parent
                    });

                    next();

                }
            }

        });

        /* Sorting makes it easier to work with */
        routeFiles.sort(function (a, b) {

            if (a.name.match(/index\./)) {
                return 1;
            } else {
                return a.name > b.name;
            }
        });

        return routeFiles;

    }


});
