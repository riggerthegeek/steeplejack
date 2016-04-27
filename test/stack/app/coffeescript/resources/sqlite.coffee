###
 * sqlite
###

"use strict";


# Node modules
fs = require "fs"
path = require "path"


# Third-party modules
_ = require "lodash"
Bluebird = require "bluebird"
Pool = require("generic-pool").Pool


# Files


class SQLite3

    constructor: (@_filename) ->
        @_data = require @_filename


    close: () ->

    get: (table, match, limit) ->

        Bluebird.try =>

            if _.has @_data, table

                data = @_data[table]

                data = _.filter data, match

                if (_.isNumber(limit) && limit > 0)

                    data = _.slice data, 0, limit

                return data

            []

    insert: (table, input) ->

        Bluebird.try =>

            if _.has @_data, table == false
                @_data[table] = []

            data = @_data[table]

            last = _.last data

            if last
                input.id = String(Number(last.id) + 1)
            else
                input.id = 1

            @_data[table].push input

            fs.writeFileSync @_filename, JSON.stringify(this._data), "utf8"

            @_data = require @_filename

            input


exports.__factory =

    name: "$SQLiteResource"
    factory: ($config) ->

        new Pool
            name: "sqlite"
            create: (cb) ->
                db = new SQLite3(path.join(__dirname, $config.sqlite.filename))

                cb null, db
            destroy: (client) ->
                client.close()
