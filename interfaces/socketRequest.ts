/**
 * socketRequest
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {ISocketBroadcast} from "./socketBroadcast";


export interface ISocketRequest {
    emit (event: string, ...args: any[]): boolean;
    params: any[];
    socket: any;
    broadcast: (broadcast: ISocketBroadcast) => void;
    disconnect: (reason: string) => void;
    getId: () => string;
    joinChannel: (channel: string) => ISocketRequest;
    leaveChannel: (channel: string) => ISocketRequest;
    data: {
        [key: string]: any;
    };
}
