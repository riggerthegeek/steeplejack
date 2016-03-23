/**
 * socketio
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as io from "socket.io";
import {Promise} from "es6-promise";


/* Files */
import {Base} from "../../../../../lib/base";
import {ISocketStrategy} from "../../../../../interfaces/socketStrategy";
import {IServerStrategy} from "../../../../../interfaces/serverStrategy";


export class SocketIO extends Base implements ISocketStrategy {


    _inst: any;


    connect (namespace: any) : Promise<any> {

        return new Promise((resolve: any) => {

            namespace.on("connection", (socket: any) => {
                resolve(socket);
            });

        });

    }


    createSocket (server: IServerStrategy) : void {
        this._inst = io(server.getRawServer());
    }


    listen (socket: any, event: string, fn: () => void) {
        

    }


    newNamespace (namespace: string) : any {
        let nsp = this._inst
            .of(namespace);

        return nsp;
    }


}
