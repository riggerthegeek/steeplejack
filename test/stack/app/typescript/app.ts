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


app.run(($config: any) => {

    let server = new Server($config.server, new Restify(), new SocketIO());

    console.log($config);

    server
        .bodyParser()
        .gzipResponse();

    return server;

});


export {app};
