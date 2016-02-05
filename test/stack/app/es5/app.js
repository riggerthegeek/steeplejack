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


/* Start up the server */
var app = Steeplejack.app({
    config: require("./config"),
    env: require("./envvars"),
    modules: [
        path.join(__dirname, "!(routes)/**/*.js")
    ],
    routesDir: path.join(__dirname, "routes")
});


app.on("start", function () {
    console.log("ES5 started");
});


app.run(function ($config) {

    var server = new Server($config.server, new Restify());

    /* Listen for errors to log */
    server.on("error", function (err) {

    });

    server
    //.bodyParser()
        .gzipResponse();

    return server;

});


exports.app = app;
