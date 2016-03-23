/**
 * SQLite
 */

"use strict";


/* Node modules */
import * as path from "path";


/* Third-party modules */
let Bluebird = require("bluebird");
let Pool = require("generic-pool").Pool;
let sqlite3 = require("sqlite3");


/* Files */


let SQLite3 = sqlite3.verbose();


/* Defines the public output */
exports.__factory = {
    name: "$SQLiteResource",
    factory: ($config: any) => {

        return new Pool({
            name: "sqlite",
            create: (cb: (err: any, result: any) => void) => {

                var db = new SQLite3.Database(path.join(__dirname, $config.sqlite.filename));

                cb(null, Bluebird.promisifyAll(db));

            },
            destroy: (client: any) => {
                return client.close();
            }
        });

    }
};
