/**
 * router
 */

/// <reference path="../typings/tsd.d.ts" />

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
    public static discoverRoutes (files: IRouteFiles[]) : any {

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
