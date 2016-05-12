/**
 * Socket Request
 *
 * Wraps the socket request into a consistent
 * object. This is what is sent to a socket
 * route instance when a socket is called.
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


    /**
     * Stores the params set to the request
     *
     * @type {Array}
     * @private
     */
    protected _params: any[] = [];


    /**
     * Data
     *
     * Any data that we wish to attach to this
     * request is stored here. This might contain
     * user data or similar.
     *
     * @type {object}
     */
    public data = {};


    /**
     * Params
     *
     * These are the parameters that are sent
     * over to the socket.
     *
     * @returns {any[]}
     */
    public get params () {
        return this._params;
    }


    /**
     * Params
     *
     * Sets the parameters that are sent
     * over to the socket.
     *
     * @param {any[]} params
     */
    public set params (params: any[]) {
        this._params = params;
    }


    /**
     * Constructor
     *
     * The socket object is the instance of the
     * socket library used. The strategy wires
     * it all together.
     *
     * @param {*} socket
     * @param {ISocketStrategy} _strategy
     */
    public constructor (public socket: any, protected _strategy: ISocketStrategy) {

        super();

    }


    /**
     * Broadcast
     *
     * This is used to talk to the socket
     * connection.
     *
     * @param {ISocketBroadcast} broadcast
     * @returns {SocketRequest}
     */
    public broadcast (broadcast: ISocketBroadcast) {

        this.emit("broadcast", broadcast);

        return this;

    }


    /**
     * Disconnect
     *
     * Kills the socket connection
     *
     * @param {string} reason
     */
    public disconnect (reason: string) {
        this._strategy.disconnect(this.socket, reason);
    }


    /**
     * Get ID
     *
     * Gets the socket connection ID
     *
     * @returns {string}
     */
    public getId () : string {
        return this._strategy.getSocketId(this.socket);
    }


    /**
     * Join Channel
     *
     * Adds this socket to a given channel. This
     * will help with broadcasting between different
     * entities, such as when remote controlling
     * a device.
     *
     * @param {string} channel
     * @returns {SocketRequest}
     */
    public joinChannel (channel: string) : SocketRequest {

        this._strategy.joinChannel(this.socket, channel);

        return this;

    }


    /**
     * Leave Channel
     *
     * Tells this connection to leave a particular
     * channel.
     *
     * @param {string} channel
     * @returns {SocketRequest}
     */
    public leaveChannel (channel: string) : SocketRequest {

        this._strategy.leaveChannel(this.socket, channel);

        return this;

    }


}
