/**
 * app
 */

/**
 * Don't use the global TSD so can ensure the
 * Steeplejack .d.ts files
 */

/// <reference path="../../../typings/main/ambient/node/node.d.ts" />

"use strict";


/* Node modules */
import * as path from "path";


/* Third-party modules */
import {Steeplejack} from "../../../steeplejack";
import {Server} from "../../../lib/server";


/* Files */
import {Restify} from "./lib/restify";

console.log(path.join(__dirname, "routes/**/*.js"));

/* Start up the server */
let app = Steeplejack.app({
    config: require("./config"),
    env: require("./envvars"),
    modules: [
        path.join(__dirname, "!(routes)/**/*.js")
    ],
    routesDir: path.join(__dirname, "routes")
});


app.on("start", () => {
    console.log(app.config);
});


app.run(($config: any) => {

    let http = new Restify();

    return new Server($config.server, http);

});


export {app};
