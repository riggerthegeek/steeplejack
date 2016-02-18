/**
 * sqlite
 */


"use strict";


/* Node modules */
var path = require("path");


/* Third-party modules */
var Bluebird = require("bluebird");
var Pool = require("generic-pool").Pool;
var SQLite3 = require("sqlite3").verbose();


/* Files */



/* Defines the public output */
exports.__factory = {
    name: "$SQLiteResource",
    factory: function ($config) {

        return new Pool({
            name: "sqlite",
            create: function (cb) {

                var db = new SQLite3.Database(path.join(__dirname, $config.sqlite.filename));

                cb(null, Bluebird.promisifyAll(db));

            },
            destroy: function (client) {
                return client.close();
            }
        });

    }
};
