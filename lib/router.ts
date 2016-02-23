/**
 * Router
 *
 * This is to do the HTTP routing based upon
 * the file/folder that it's in.
 */

"use strict";


/* Node modules */
import * as path from "path";


/* Third-party modules */
import * as _ from "lodash";
import {sync as glob} from "glob";


/* Files */
import {Base} from "./base";


export class Router extends Base {


    /**
     * Routes
     *
     * Stores the routes
     * @type {object}
     * @private
     */
    protected _routes: Object = {};


    /**
     * Constructor
     *
     * Creates the object, adding in routes
     *
     * @param {object} routes
     */
    public constructor (routes: Object = null) {

        super();

        this.addRoute(routes);

    }


    /**
     * Clean Slashes
     *
     * Gets rid of excess slashes from a string
     *
     * @param {string} str
     * @returns {string}
     * @private
     */
    protected _cleanSlashes (str: string) {

        /* Remove forward slashes */
        str = str.replace(/\\/g, "/");

        /* Remove excess slashes */
        str = str.replace(/\/+/g, "/");

        return str;

    }


    /**
     * Set Route Name
     *
     * Sets the route name
     *
     * @param {string} parent
     * @param {string} route
     * @returns {string}
     */
    protected _setRouteName (parent: string, route: string) {

        let str = [
            parent, route
        ].join("/");

        return this._cleanSlashes(str);

    }


    /**
     * Add Route
     *
     * Adds in a new route(s) to the object
     *
     * @param {object} routes
     * @param {string} parent
     * @returns {Router}
     */
    public addRoute (routes: Object, parent: string = null) : Router {

        _.each(routes, (value: any, key: string) => {

            if (_.isPlainObject(value)) {
                /* It's an object - we're not yet at the lowest level */
                this.addRoute(value, this._setRouteName(parent, key));
            } else {

                /* Remove final slash */
                if (parent !== null && parent !== "/") {
                    parent = parent.replace(/(\/+)$/, "");
                }

                /* Save to the instance */
                if (_.has(this._routes, parent) === false) {
                    (<any> this._routes)[parent] = {};
                }

                if (_.has(this._routes, [parent, key])) {
                    /* Can't overwrite a route */
                    let err = new SyntaxError("CANNOT_OVERWRITE_A_ROUTE");
                    (<any> err).route = parent;
                    (<any> err).key = key;
                    throw err;
                }

                (<any> this._routes)[parent][key] = value;

            }

        });

        return this;

    }


    /**
     * Get Routes
     *
     * Gets the set routes
     *
     * @returns {object}
     */
    public getRoutes () : Object {
        return this._routes;
    }


    /**
     * Discover Routes
     *
     * This is discovers the route files in the
     * given route directory and then loads them
     * up.  It then returns an object of route
     * functions that can be used.
     *
     * @param {IRouteFiles[]} files
     * @returns {Object}
     */
    public static discoverRoutes (files: IRouteFiles[]) : Object {

        const splitNames = new RegExp(`^((\\w+${path.sep})+)?(\\w+)`);

        return _.reduce(files, (result: any, file: IRouteFiles) => {

            let segments = file.name.match(splitNames);

            if (segments !== null) {

                let tmp = segments[3];

                if (tmp === "index") {
                    tmp = segments[1];
                    if (_.isUndefined(tmp)) {
                        tmp = "";
                    } else {
                        /* Remove any trailing slash */
                        tmp = tmp.replace(new RegExp(`${path.sep}$`), "");
                    }
                } else if (segments[1]) {
                    tmp = segments[1] + tmp;
                }

                /* Load the route file */
                let objRoute = require(path.join(file.path, file.name));

                if (_.isFunction(objRoute.route) === false) {
                    throw new TypeError("A route file must have a function on exports.route");
                }

                /* Put in stack */
                result[tmp] = objRoute.route;

            }

            return result;

        }, {});

    }


    /**
     * Get File List
     *
     * Finds all the files in the route directory
     * that matches the glob.
     *
     * @param {string} routeDir
     * @param {string} routeGlob
     * @returns {IRouteFiles[]}
     */
    public static getFileList (routeDir: string, routeGlob: string) : IRouteFiles[] {

        /* Build the routes up */
        let routes = path.join(routeDir, routeGlob);

        /* Get the route files */
        return glob(routes, {
            nosort: true /* Don't waste effort sorting here */
        }).map((file) => {

            let name = file.replace(routeDir + path.sep, "");

            return {
                name,
                path: routeDir
            };

        }).sort((a: IRouteFiles, b: IRouteFiles) => {

            /* Put an index file at the end */
            if (a.name.match(/index\./)) {
                return 1;
            } else {
                /* Sort by filename */
                return a.name > b.name ? 1 : -1;
            }

        });

    }


}