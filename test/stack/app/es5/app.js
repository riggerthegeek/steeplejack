/**
 * app
 */

"use strict";


/* Node modules */
var path = require("path");


/* Third-party modules */
var Steeplejack = require("../../../../steeplejack").Steeplejack;
var Server = require("../../../../lib/server").Server;


/* Files */
var Restify = require("./lib/restify").Restify;
var SocketIO = require("./lib/socketio").SocketIO;


/* Start up the server */
var app = Steeplejack.app({
    config: require("./config"),
    modules: [
        path.join(__dirname, "!(routes)/**/*.js")
    ],
    routesDir: path.join(__dirname, "routes")
});


app.on("start", function () {
    console.log("ES5 started");
});


app.run(function ($config) {

    var restify = new Restify();

    restify.bodyParser();
    restify.gzipResponse();

    var server = new Server($config.server, restify, new SocketIO());

    /* Listen for errors to log */
    server.on("error", function (err) {

    });

    return server;

});


exports.app = app;
