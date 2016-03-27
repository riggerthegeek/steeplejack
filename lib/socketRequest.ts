/**
 * Socket Request
 *
 * Wraps the socket request into a consistent
 * object
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Base} from "./base";
import {ISocketBroadcast} from "../interfaces/socketBroadcast";
import {ISocketRequest} from "../interfaces/socketRequest";
import {ISocketStrategy} from "../interfaces/socketStrategy";


export class SocketRequest extends Base implements ISocketRequest {


    protected _params: any[] = [];


    public get params () {
        return this._params;
    }


    public set params (params: any[]) {
        this._params = params;
    }


    public constructor (public socket: any, protected _strategy: ISocketStrategy) {
        super();
    }


    public broadcast (broadcast: ISocketBroadcast) {
        this.emit("broadcast", broadcast);
    }


    public getId () : string {
        return this._strategy.getSocketId(this.socket);
    }


    public joinChannel (channel: string) : SocketRequest {

        this._strategy.joinChannel(this.socket, channel);

        return this;

    }


    public leaveChannel (channel: string) : SocketRequest {

        this._strategy.leaveChannel(this.socket, channel);

        return this;

    }


}
