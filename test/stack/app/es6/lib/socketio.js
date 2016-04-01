/**
 * socketio
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {_} from "lodash";
import io from "socket.io";
import {Promise} from "es6-promise";


/* Files */
import {Base} from "../../../../../lib/base";


export class SocketIO extends Base {


    broadcast (request, broadcast) {

        if (broadcast.target) {
            request.socket.nsp.to(broadcast.target)
                .emit(broadcast.event, ...broadcast.data);
        } else {
            request.socket.nsp.emit(broadcast.event, ...broadcast.data);
        }

    }


    connect (namespace, middleware)  {

        return new Promise(resolve => {

            let nsp = this._inst
                .of(namespace);

            _.each(middleware, fn => {
                nsp.use(fn);
            });

            nsp.on("connection", socket => {

                /* Send both the socket and the namespace */
                resolve({
                    socket,
                    nsp
                });

            });

        });

    }


    createSocket (server) {
        this._inst = io(server.getRawServer());
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
