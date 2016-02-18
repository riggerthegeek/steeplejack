###
 * user
###

"use strict";


# Node modules


# Third-party modules
_ = require "lodash"
Bluebird = require "bluebird"


# Files


name = "$userStore"


UserStore = ($poolGrabber, $SQLiteResource) ->

    {

        createUser: (data) ->

            $poolGrabber $SQLiteResource, (db) ->

                map =
                    "$firstName": "first_name"
                    "$lastName": "last_name"
                    "$emailAddress": "email_address"

                sql = "INSERT INTO users (first_name, last_name, email_address)" +
                    "VALUES($firstName, $lastName, $emailAddress)"

                values = _.reduce map, (result, dataKey, valueKey) ->

                    result[valueKey] = data[dataKey];

                    return result

                , {}

                defer = Bluebird.defer()

                db.run sql, values, (err) ->

                    if err
                        return defer.reject err

                    data.id = this.lastID;

                    defer.resolve data

                defer.promise


        getUserById: (userId) ->

            $poolGrabber $SQLiteResource, (db) ->

                db.allAsync "SELECT * FROM users WHERE id = ? LIMIT 1", userId
                    .then (result) ->
                        result[0]

    }


# Defines the public output
exports.__factory =
    name: name
    factory: UserStore
