/**
 * Socket Request
 *
 * This request object is how we work with
 * a socket, so we can have a consistent
 * interface to work with.
 */

/* Node modules */

/* Third-party modules */
import { Base } from '@steeplejack/core';

/* Files */

class SocketRequest extends Base {
  /**
   * Params
   *
   * These are the parameters that are sent
   * over to the socket.
   *
   * @returns {any[]}
   */
  get params () {
    return this.myParams;
  }

  /**
   * Params
   *
   * Sets the parameters that are sent
   * over to the socket.
   *
   * @param {any[]} params
   */
  set params (params) {
    this.myParams = params;
  }

  /**
   * Constructor
   *
   * The socket object is the instance of the
   * socket library used. The strategy wires
   * it all together.
   *
   * @param {*} socket
   * @param {*} strategy
   */
  constructor (socket, strategy) {
    super();

    this.data = {};
    this.myParams = [];
    this.socket = socket;
    this.strategy = strategy;
  }

  /**
   * Broadcast
   *
   * This is used to talk to the socket
   * connection.
   *
   * @param {*} broadcast
   * @returns {SocketRequest}
   */
  broadcast (broadcast) {
    this.emit('broadcast', broadcast);

    return this;
  }

  /**
   * Disconnect
   *
   * Kills the socket connection
   */
  disconnect () {
    this.strategy.disconnect(this.socket);
  }

  /**
   * Get ID
   *
   * Gets the socket connection ID
   *
   * @returns {string}
   */
  getId () {
    return this.strategy.getSocketId(this.socket);
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
  joinChannel (channel) {
    this.strategy.joinChannel(this.socket, channel);

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
  leaveChannel (channel) {
    this.strategy.leaveChannel(this.socket, channel);

    return this;
  }
}

module.exports = SocketRequest;
