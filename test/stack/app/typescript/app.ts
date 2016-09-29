/**
 * app
 */

"use strict";


/* Node modules */
import * as path from "path";


/* Third-party modules */
import {Steeplejack} from "../../../../index";
import {Server} from "../../../../lib/server";


/* Files */
import {Restify} from "./lib/restify";
import {SocketIO} from "./lib/socketio";


let app = Steeplejack.app({
    config: require("./config"),
    modules: [
        path.join(__dirname, "!(routes)/**/*.js")
    ],
    routesDir: path.join(__dirname, "routes")
});


app.on("start", () => {
    console.log("TypeScript started");
});


app.run(($config: any) => {

    const restify = new Restify();

    restify.bodyParser();
    restify.gzipResponse();

    let server = new Server($config.server, restify, new SocketIO());

    console.log($config);

    return server;

});


export {app};
