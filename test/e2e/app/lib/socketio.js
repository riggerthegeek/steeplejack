/**
 * socketio
 */

/* Node modules */
import { EventEmitter } from 'events';

/* Third-party modules */
import { _ } from 'lodash';
import io from 'socket.io';

/* Files */

export default class SocketIO {

  broadcast (request, broadcast) {

    if (broadcast.target) {
      request.socket.nsp.to(broadcast.target)
        .emit(broadcast.event, ...broadcast.data);
    } else {
      request.socket.nsp.emit(broadcast.event, ...broadcast.data);
    }

  }

  connect (namespace, middleware)  {
    const nsp = this._inst
      .of(namespace);

    _.each(middleware, fn => {
      nsp.use(fn);
    });

    nsp.on("connection", socket => {

      /* Send both the socket and the namespace */
      this.emit(`${namespace}_connected`, {
        socket,
        nsp
      });

    });

    return this;

  }

  createSocket (server) {
    this._inst = io(server.getRawServer());
  }

  disconnect ({socket}) {
    socket.disconnect();
  }

  getSocketId ({socket}) {
    return socket.id;
  }

  joinChannel ({socket}, channel) {
    socket.join(channel);
  }

  leaveChannel ({socket}, channel) {
    socket.leave(channel);
  }

  listen ({socket}, event, fn) {
    socket.on(event, fn);
  }

}
