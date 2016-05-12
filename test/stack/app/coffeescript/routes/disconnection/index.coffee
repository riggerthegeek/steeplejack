###
 * index
###

"use strict";


# Node modules


# Third-party modules


# Files


exports.socket = ->

    {

        connect: (conn) ->

            setTimeout ->
                conn.disconnect()
            , 500

    }
