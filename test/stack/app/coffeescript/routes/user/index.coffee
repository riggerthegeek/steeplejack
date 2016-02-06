###
 * index
###

"use strict";


# Node modules


# Third-party modules


# Files


exports.route = ($output, $userController) ->

    {

        "/":

            get: [
                (req, res, next) ->

                    # Simulate a valid bearer token
                    if req.headers.authorization != "bearer valid"
                        res.send(401)
                        return

                    next()

                (req, res) ->

                    $output req, res, ->
                        $userController.getUser "1"

            ]

            post: [
                (req, res, next) ->

                    # Simulate a valid bearer token
                    if req.headers.authorization != "bearer valid"
                        res.send 401
                        return


                    next()

                (req, res) ->

                    $output req, res, ->
                        $userController.createUser req.body

            ]

    }
