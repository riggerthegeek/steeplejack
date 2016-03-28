###
 * app
###

"use strict";


# Node modules
path = require "path"


# Third-party modules
Steeplejack = require("../../../../steeplejack").Steeplejack;
Server = require("../../../../lib/server").Server;


# Files
Restify = require("./lib/restify").Restify;
SocketIO = require("./lib/socketio").SocketIO;


### Start up the server ###
app = Steeplejack.app
    config: require "./config"
    modules: [
        path.join __dirname, "!(routes)/**/*.js"
    ]
    routesDir: path.join __dirname, "routes"


app.on "start", () ->
    console.log "CoffeeScript started"



app.run ($config) ->

    server = new Server $config.server, new Restify, new SocketIO

    server
        .bodyParser()
        .gzipResponse()

    server



exports.app = app;
