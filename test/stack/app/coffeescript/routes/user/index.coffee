###
 * index
###

"use strict";


# Node modules


# Third-party modules


# Files


exports.route = ($userController) ->

    {

        "/":

            get: (request) ->

                # Simulate a valid bearer token
                if request.headers.authorization != "bearer valid"
                    return 401

                $userController.getUser "1"


            post: (request) ->

                # Simulate a valid bearer token
                if request.headers.authorization != "bearer valid"
                    return 401

                $userController.createUser request.body

    }

exports.socket = ->

    {

        send: (socket) ->

            socket.broadcast
                event: "receive",
                data: socket.params

    }
