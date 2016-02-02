/**
 * app
 */

/**
 * Don't use the global TSD so can ensure the
 * Steeplejack .d.ts files
 */

/// <reference path="../../../typings/node/node.d.ts" />

"use strict";


/* Node modules */
import * as path from "path";


/* Third-party modules */
import {Steeplejack} from "../../../steeplejack";


/* Files */


export let app = Steeplejack.app({
    config: require("./config"),
    env: require("./envvars"),
    modules: [
        path.join(__dirname, "!(routes)/**/*.js")
    ],
    routesDir: path.join(__dirname, "routes")
});
