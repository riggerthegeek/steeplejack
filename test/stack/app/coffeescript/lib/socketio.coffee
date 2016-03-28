###*
# socketio
###

'use strict'

### Node modules ###


### Third-party modules ###
_ = require('lodash')
io = require('socket.io')
Promise = require('es6-promise').Promise


### Files ###
Base = require('../../../../../lib/base').Base


exports.SocketIO = class SocketIO extends Base

    broadcast: (request, broadcast) ->
        args = _.concat([ broadcast.event ], broadcast.data)
        if broadcast.target
            request.socket.nsp.to(broadcast.target).emit.apply request.socket.nsp, args
        else
            request.socket.nsp.emit.apply request.socket.nsp, args
        return

    connect: (namespace, middleware) ->

        new Promise (resolve) =>
            nsp = @_inst.of(namespace)
            _.each middleware, (fn) =>
                nsp.use fn
                return
            nsp.on 'connection', (socket) =>

                ### Send both the socket and the namespace ###

                resolve
                    socket: socket
                    nsp: nsp
                return
            return

    createSocket: (server) ->
        @_inst = io(server.getRawServer())
        return

    getSocketId: (obj) ->
        obj.socket.id

    joinChannel: (obj, channel) ->
        obj.socket.join channel
        return

    leaveChannel: (obj, channel) ->
        obj.socket.leave channel
        return

    listen: (obj, event, fn) ->
        obj.socket.on event, fn
        return
