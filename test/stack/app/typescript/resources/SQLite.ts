/**
 * SQLite
 */

"use strict";


/* Node modules */
import * as fs from "fs";
import * as path from "path";


/* Third-party modules */
import * as _ from "lodash";
let Bluebird = require("bluebird");
let Pool = require("generic-pool").Pool;


/* Files */


class SQLite3 {

    protected _filename: string;
    protected _data: any;

    constructor (filename: string) {
        this._filename = filename;
        this._data = require(this._filename);
    }

    close () { }

    get (table: string, match: Object, limit: number) {

        return Bluebird.try(() => {

            if (_.has(this._data, table)) {

                let data: any = this._data[table];

                data = _.filter(data, match);

                if (_.isNumber(limit) && limit > 0) {
                    data = _.slice(data, 0, limit);
                }

                return data;

            }

            return [];

        });

    }

    insert (table: string, input: any) {

        return Bluebird.try(() => {

            if (_.has(this._data, table) === false) {
                this._data[table] = [];
            }

            let data: any = this._data[table];

            let last: any = _.last(data);

            input.id = last ? String(Number(last.id) + 1) : 1;

            this._data[table].push(input);

            fs.writeFileSync(this._filename, JSON.stringify(this._data), "utf8");

            this._data = require(this._filename);

            return input;

        });

    }

}


/* Defines the public output */
exports.__factory = {
    name: "$SQLiteResource",
    factory: ($config: any) => {

        return new Pool({
            name: "sqlite",
            create: (cb: (err: any, result: any) => void) => {

                let db = new SQLite3(path.join(__dirname, $config.sqlite.filename));

                cb(null, db);

            },
            destroy: (client: any) => {
                return client.close();
            }
        });

    }
};
