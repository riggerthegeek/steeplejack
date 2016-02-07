/**
 * sqlite
 */


"use strict";


/* Node modules */
import path from "path";


/* Third-party modules */
import Bluebird from "bluebird";
import {Pool} from "generic-pool";
import sqlite3 from "sqlite3";


/* Files */


let SQLite3 = sqlite3.verbose();


/* Defines the public output */
exports.__factory = {
    name: "$SQLiteResource",
    factory: ($config) => {

        return new Pool({
            name: "sqlite",
            create: (cb) => {

                var db = new SQLite3.Database(path.join(__dirname, $config.sqlite.filename));

                cb(null, Bluebird.promisifyAll(db));

            },
            destroy: (client) => {
                return client.close();
            }
        });

    }
};
