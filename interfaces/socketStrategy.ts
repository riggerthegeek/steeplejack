/**
 * socketStrategy
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {Promise} from "es6-promise";


/* Files */
import {IServerStrategy} from "./serverStrategy";
import {ISocketBroadcast} from "./socketBroadcast";
import {ISocketRequest} from "./socketRequest";


export interface ISocketStrategy {
    broadcast: (request: ISocketRequest, broadcast: ISocketBroadcast) => void;
    connect: (namespace: string, middleware: Function[]) => Promise<any>;
    createSocket: (server: IServerStrategy) => void;
    // disconnect: () => void;
    getSocketId: (socket: any) => string;
    joinChannel: (socket: any, channel: string) => void;
    leaveChannel: (socket: any, channel: string) => void;
    listen: (socket: any, event: string, fn: () => void) => void;
}
