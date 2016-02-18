###
 * poolGrabber
###

"use strict";


# Node modules


# Third-party modules
Bluebird = require "bluebird"


# Files


exports.__factory =

    name: "$poolGrabber"

    factory: () ->

        (resource, iterator) ->

            defer = Bluebird.defer()

            resource.acquire (err, db) ->

                if err
                    return defer.reject err

                iterator db
                    .then (result) ->
                        defer.resolve result
                    .finally ->
                        resource.release db

            defer.promise
