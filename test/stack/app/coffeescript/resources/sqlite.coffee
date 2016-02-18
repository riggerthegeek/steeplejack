###
 * sqlite
###

"use strict";


# Node modules
path = require "path"


# Third-party modules
Bluebird = require "bluebird"
Pool = require("generic-pool").Pool
SQLite3 = require("sqlite3").verbose()


# Files


exports.__factory =

    name: "$SQLiteResource"
    factory: ($config) ->

        new Pool
            name: "sqlite"
            create: (cb) ->
                db = new SQLite3.Database(path.join(__dirname, $config.sqlite.filename))

                cb null, Bluebird.promisifyAll db
            destroy: (client) ->
                client.close()
