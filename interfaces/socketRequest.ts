/**
 * socketRequest
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Base} from "../lib/base";
import {ISocketBroadcast} from "./socketBroadcast";


export interface ISocketRequest extends Base {
    params: any[];
    socket: any;
    broadcast: (broadcast: ISocketBroadcast) => void;
    getId: () => string;
    joinChannel: (channel: string) => ISocketRequest;
    leaveChannel: (channel: string) => ISocketRequest;
}
