###
 * restify
 *
 * This is a cut-down Restify strategy pattern for the
 * Server class.  If using Restify in production, use
 * the steeplejack-restify package instead.
###

"use strict";


# Node modules
http = require "http"


# Third-party modules
_ = require "lodash"
Bluebird = require "bluebird"
restify = require "restify"


# Files
ValidationException = require("../../../../../exception/validation/index").ValidationException


exports.Restify = class Restify


    constructor: () ->
        @_inst = Bluebird.promisifyAll restify.createServer()


    addRoute: (httpMethod, route, fn) ->
        @_inst[httpMethod.toLowerCase()] route, fn


    bodyParser: ->
        @use restify.bodyParser()


    close: ->
        @_inst.close()


    getServer: ->
        @_inst


    gzipResponse: ->
        @use restify.gzipResponse()


    outputHandler: (err, data, req, res) ->

        statusCode = 200
        output = null

        if err

            # Convert to a Restify error and process
            if err > 100 && err < 600
                statusCode = err
            else if err instanceof restify.RestError

                # Already a RestError - use it
                statusCode = err.statusCode
                output = err

            else if err instanceof ValidationException

                # A steeplejack validation error
                statusCode = 400
                output =
                    code: err.type,
                    message: err.message


                if err.hasErrors()
                    output.error = err.getErrors()

            else

                # Convert to a restify-friendly error
                statusCode = if _.isFunction err.getHttpCode then err.getHttpCode() else 500
                output = if _.isFunction err.getDetail then err.getDetail() else err.message

        else if data

            # Success
            if data > 100 && data < 600
                statusCode = data
            else if _.isFunction data.getData
                output = data.getData()
            else
                output = data

        else

            # No content
            statusCode = 204

        # Push the output
        res.send statusCode, output


    queryParser: (mapParams) ->
        @use restify.queryParser
            mapParams: mapParams


    start: (port, hostname, backlog) ->
        @_inst.listenAsync(port, hostname, backlog)


    uncaughtException: (fn) ->
        @_inst.on "uncaughtException", fn


    use: (fn) ->
        @_inst.use fn


