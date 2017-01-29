/**
 * sqlite
 */

"use strict";

/* Node modules */
import fs from "fs";
import path from "path";

/* Third-party modules */
import {_} from "lodash";
import Bluebird from "bluebird";

/* Files */

/**
 * The SQLite library was problematic so I wrote
 * this to read a JSON file
 */
export default class SQLite3 {

  constructor (config) {
    this._filename = config.sqlite.filename;
    this._data = require(this._filename);
  }

  close () {}

  get (table, match, limit) {

    return Bluebird.try(() => {

      if (_.has(this._data, table)) {

        let data = this._data[table];

        data = _.filter(data, match);

        if (_.isNumber(limit) && limit > 0) {
          data = _.slice(data, 0, limit);
        }

        return data;

      }

      return [];

    });

  }

  insert (table, input) {

    return Bluebird.try(() => {

      if (_.has(this._data, table) === false) {
        this._data[table] = [];
      }

      let data = this._data[table];

      let last = _.last(data);

      input.id = last ? String(Number(last.id) + 1) : 1;

      this._data[table].push(input);

      fs.writeFileSync(this._filename, JSON.stringify(this._data), "utf8");

      this._data = require(this._filename);

      return input;

    });

  }

}

/* Defines the public output */
export const inject = {
  name: "$SQLiteResource",
  deps: [
    '$config'
  ]
};

// export let __factory = {
//   name: "$SQLiteResource",
//   factory: ($config) => {
//
//     return new Pool({
//       name: "sqlite",
//       create: (cb) => {
//
//         let db = new SQLite3(path.join(__dirname, $config.sqlite.filename));
//
//         cb(null, db);
//
//       },
//       destroy: (client) => {
//         return client.close();
//       }
//     });
//
//   }
// };
