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

                db.insert "users", data


        getUserById: (userId) ->

            $poolGrabber $SQLiteResource, (db) ->

                db.get "users", {id: userId}, 1
                    .then (result) ->
                        result[0]

    }


# Defines the public output
exports.__factory =
    name: name
    factory: UserStore
