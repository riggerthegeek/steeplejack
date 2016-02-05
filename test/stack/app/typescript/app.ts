/**
 * app
 */

/**
 * Don't use the global TSD so can ensure the
 * Steeplejack .d.ts files
 */

/// <reference path="../../../../typings/main/ambient/node/node.d.ts" />

"use strict";


/* Node modules */
import * as path from "path";


/* Third-party modules */
import {Steeplejack} from "../../../../steeplejack";
import {Server} from "../../../../lib/server";


/* Files */
import {Restify} from "./lib/restify";


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
    console.log("--- Config ---");
    console.log(JSON.stringify(app.config, null, 4));
});


app.run(($config: any) => {

    let server = new Server($config.server, new Restify());

    /* Listen for errors to log */
    server.on("error", (err: any) => {

    });

    server
        //.bodyParser()
        .gzipResponse();

    return server;

});


export {app};
