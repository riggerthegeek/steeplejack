/**
 * sqlite
 */


"use strict";


/* Node modules */
var fs = require("fs");
var path = require("path");


/* Third-party modules */
var _ = require("lodash");
var Bluebird = require("bluebird");
var Pool = require("generic-pool").Pool;


/* Files */


function SQLite3 (filename) {
    this._filename = filename;
    this._data = require(this._filename);
}


_.extend(SQLite3.prototype, {

    close: function () { },

    get: function (table, match, limit) {

        var self = this;

        return Bluebird.try(function () {

            if (_.has(self._data, table)) {

                var data = self._data[table];

                data = _.filter(data, match);

                if (_.isNumber(limit) && limit > 0) {
                    data = _.slice(data, 0, limit);
                }

                return data;

            }

            return [];

        });

    },

    insert function (table, input) {

        var self = this;

        return Bluebird.try(function () {

            if (_.has(self._data, table) === false) {
                self._data[table] = [];
            }

            var data = self._data[table];

            var last = _.last(data);

            input.id = last ? String(Number(last.id) + 1) : 1;

            self._data[table].push(input);

            fs.writeFileSync(self._filename, JSON.stringify(self._data), "utf8");

            self._data = require(self._filename);

            return input;

        });

    }

});



/* Defines the public output */
exports.__factory = {
    name: "$SQLiteResource",
    factory: function ($config) {

        return new Pool({
            name: "sqlite",
            create: function (cb) {

                var db = new SQLite3(path.join(__dirname, $config.sqlite.filename));

                cb(null, db);

            },
            destroy: function (client) {
                return client.close();
            }
        });

    }
};
