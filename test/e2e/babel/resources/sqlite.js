/**
 * sqlite
 */


/* Node modules */
import fs from 'fs';

/* Third-party modules */
import { _ } from 'lodash';
import Bluebird from 'bluebird';

/* Files */

/**
 * The SQLite library was problematic so I wrote
 * this to read a JSON file
 */
export default (config) => {

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
export const inject = {
  name: '$SQLiteResource',
  deps: [
    '$config',
  ],
};
