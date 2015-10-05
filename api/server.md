---
layout: api
title: Server
permalink: /api/server/
section: api

source: src/library/Server.js
description: |
    A wrapper to create an instance of a Server. This should be extended for individual implementations.
extends:
    url: /api/base/
    name: Base
api:
    -
        type: method
        items:
            -
                name: _construct(options)
                returns:
                desc: |
                    Options accepts the everything that can be set

                        {
                            "backlog": 0, // maximum length of the queue of pending connections
                            "ip": "127.0.0.1", // IP address of the server
                            "port": 3000, // Port to run on
                            "certificate": "str", // HTTPS certificate
                            "formatters": {}, // Formatters for content negotiation
                            "handleUpgrades": false, // Hook the upgrade event from the node HTTP server
                            "key": "str", // HTTPS key
                            "logger": {}, // Instance of the logger object
                            "name": "name", // Server name
                            "spdy": {}, // Any options accepted by node-spdy
                            "version": "1.2.3" // A default version set for all routes
                        }
            -
                name: acceptParser(options)
                returns: this
                desc: |
                    Makes the server use the accept parse.  If options are not an array, uses the default restify
                    options.  Returns this to make the method chainable.
            -
                name: acceptParserStrict(options)
                returns: this
                desc: |
                    This is identical to the acceptParser method, except that the accept header must have the accept
                    header exactly.  There is no coercion around the mime type.
            -
                name: addRoute(httpMethod, route, fn)
                returns:
                desc: Adds a route to the stack
            -
                name: addRoutes(routes)
                returns:
                desc: Takes the routes object and adds to the server instance
            -
                name: after(fn)
                returns: this
                desc: Set up a listener for the after event
            -
                name: bodyParser()
                returns: this
                desc: Allows the server to receive the HTTP body. Returns this to make it chainable.
            -
                name: close()
                returns: this
                desc: Closes the server
            -
                name: enableCORS([origins = ["*"]][, addHeaders = []])
                returns: this
                desc: |
                    Enables cross-origin resource sharing.  This should be done with care as can lead to a major
                    security vulnerability.
            -
                name: getBacklog()
                returns: number
                desc: Gets the HTTP listen backlog
            -
                name: getIP()
                returns: string
                desc: Gets the IP address
            -
                name: getPort()
                returns: number
                desc: Gets the desired port number
            -
                name: getServer()
                returns: object
                desc: Returns the server instance
            -
                name: gzipResponse()
                returns: this
                desc: Makes the response GZIP compressed.  Returnsthis to make it chainable.
            -
                name: outputHandler(err, data, req, res[, cb])
                returns: Promise|null
                desc: |
                    This handles the output.  This can be activated directly or bundled up into a closure and passed
                    around.  Receives an optional callback function at the end.

                    Also checks if the first parameter is a promise. If it is, then all subsequent arguments are
                    moved up one position (ie, data becomes req, req becomes res, res becomes cb)
            -
                name: outputPromise(obj, req, res, cb)
                returns: Promise
                desc: Sugar for the outputHandler method to resolve a promise
            -
                name: pre(fn)
                returns: this
                desc: Set up middleware to be ran at the start of the stack.
            -
                name: start(cb)
                returns: this
                desc: Starts up the server
            -
                name: queryParser(mapParams)
                returns: this
                desc: |
                    Parses the query strings.  The mapParams option allows you to decide if you want to map req.query
                    to req.params - false by default.  Returns this to make it chainable.
            -
                name: setBacklog(backlog)
                returns:
                desc: Sets a backlog for the HTTP listen method
            -
                name: setIP(ip)
                returns:
                desc: Sets an IP for the HTTP listen method
            -
                name: setPort(port)
                returns:
                desc: Sets a port for the HTTP listen method
            -
                name: uncaughtException(fn)
                returns: this
                desc: Executed when an uncaught exception is found
            -
                name: use(fn)
                returns: this
                desc: |
                    Exposes the use method on the server. Can accept a function or an array of functions.  Sends as
                    individual functions.
---
