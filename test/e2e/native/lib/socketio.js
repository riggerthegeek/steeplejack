/**
 * socketio
 */

// eslint-disable-next-line strict, lines-around-directive
'use strict';

/* Node modules */

/* Third-party modules */
const Base = require('@steeplejack/core').Base;
const _ = require('lodash');
const io = require('socket.io');

/* Files */

exports.default = function socketIO () {
  class SocketIO extends Base {

    broadcast (request, broadcast) {

      function _toConsumableArray (arr) {
        if (Array.isArray(arr)) {
          const arr2 = new Array(arr.length);
          for (let i = 0; i < arr.length; i += 1) {
            arr2[i] = arr[i];
          }
          return arr2;
        }

        return Array.from(arr);
      }

      if (broadcast.target) {
        let _request$socket$nsp$t;

        (_request$socket$nsp$t = request.socket.nsp.to(broadcast.target)).emit
          .apply(_request$socket$nsp$t, [broadcast.event]
            .concat(_toConsumableArray(broadcast.data)));
      } else {
        let _request$socket$nsp;

        (_request$socket$nsp = request.socket.nsp).emit
          .apply(_request$socket$nsp, [broadcast.event]
            .concat(_toConsumableArray(broadcast.data)));
      }

    }

    connect (namespace, middleware) {
      const nsp = this._inst
        .of(namespace);

      _.each(middleware, (fn) => {
        nsp.use(fn);
      });

      nsp.on('connection', (socket) => {

        /* Send both the socket and the namespace */
        this.emit(`${namespace}_connected`, {
          socket,
          nsp,
        });

      });

      return this;

    }

    createSocket (server) {
      this._inst = io(server.getRawServer());
    }

    disconnect (obj) {
      obj.socket.disconnect();
    }

    getSocketId (obj) {
      return obj.socket.id;
    }

    joinChannel (obj, channel) {
      obj.socket.join(channel);
    }

    leaveChannel (obj, channel) {
      obj.socket.leave(channel);
    }

    listen (obj, event, fn) {
      obj.socket.on(event, fn);
    }

  }

  return SocketIO;
};

exports.inject = {
  name: 'SocketIO',
};
