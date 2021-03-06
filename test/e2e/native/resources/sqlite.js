/**
 * sqlite
 */

// eslint-disable-next-line strict, lines-around-directive
'use strict';

/* Node modules */
const fs = require('fs');

/* Third-party modules */
const _ = require('lodash');
const Bluebird = require('bluebird');

/* Files */

/**
 * The SQLite library was problematic so I wrote
 * this to read a JSON file
 */
exports.default = (config) => {

  const filename = config.sqlite.filename;
  let dbData = require(filename);

  return {

    get (table, match, limit) {

      return Bluebird.try(() => {

        if (_.has(dbData, table)) {

          let data = dbData[table];

          data = _.filter(data, match);

          if (_.isNumber(limit) && limit > 0) {
            data = _.slice(data, 0, limit);
          }

          return data;

        }

        return [];

      });

    },

    insert (table, input) {

      return Bluebird.try(() => {

        if (_.has(dbData, table) === false) {
          dbData[table] = [];
        }

        const data = dbData[table];

        const last = _.last(data);

        input.id = last ? String(Number(last.id) + 1) : 1;

        dbData[table].push(input);

        fs.writeFileSync(filename, JSON.stringify(dbData), 'utf8');

        dbData = require(filename);

        return input;

      });

    },

  };

};

/* Defines the public output */
exports.inject = {
  name: '$SQLiteResource',
  deps: [
    '$config',
  ],
};
