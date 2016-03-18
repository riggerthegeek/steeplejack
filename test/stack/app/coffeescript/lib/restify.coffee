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


    addRoute: (httpMethod, route, iterator) ->

        method = httpMethod.toLowerCase();

        @_inst[method] route, (req, res) =>
            iterator req, res


    bodyParser: ->
        @use restify.bodyParser()


    close: ->
        @_inst.close()


    getServer: ->
        @_inst


    gzipResponse: ->
        @use restify.gzipResponse()


    outputHandler: (statusCode, data, req, res) ->

        # Push the output
        res.send statusCode, data



    queryParser: (mapParams) ->
        @use restify.queryParser
            mapParams: mapParams


    start: (port, hostname, backlog) ->
        @_inst.listenAsync(port, hostname, backlog)


    uncaughtException: (fn) ->
        @_inst.on "uncaughtException", fn


    use: (fn) ->
        @_inst.use fn


