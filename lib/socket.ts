/**
 * Socket
 *
 * The context of a strategy pattern for socket
 * connections.
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
import {Promise} from "es6-promise";


/* Files */
import {Base} from "./base";
import {IAddSocket} from "../interfaces/addSocket";
import {ISocketStrategy} from "../interfaces/socketStrategy";


export class Socket extends Base {


    /**
     * Constructor
     *
     * Assigns the strategy object
     *
     * @param {ISocketStrategy} _strategy
     */
    public constructor (protected _strategy: ISocketStrategy) {

        super();

        if (_.isObject(this._strategy) === false) {
            throw new SyntaxError("Socket strategy object is required");
        }

    }


    public listen (socket: any, event: string, fn: Function[]) {

        this._strategy.listen(socket, event, () => {

            console.log("twat");
            process.exit();
            new Promise((resolve: any, reject: any) => {



            });

        });

    }


    public namespace (namespace: string, events: IAddSocket) : Socket {

        let nsp = this._strategy.newNamespace(namespace);

        /* Get connection listener */
        let onConnect = events.connect;

        /* Omit the connect function now */
        events = (<IAddSocket> _.omit(events, "connect"));

        this._strategy.connect(nsp)
            .then(socket => {
                
                /* Fire the connection event */
                // if (_.isFunction(onConnect)) {
                //     onConnect(request);
                // }

                _.each(events, (fn: Function | Function[], event: string) => {

                    let listener: Function[];

                    if (_.isFunction(fn)) {
                        /* Wrap in an array */
                        listener = <Function[]> [fn];
                    } else {
                        listener = <Function[]> fn;
                    }

                    this.listen(socket, event, listener);

                });

            });

        return this;

    }


}
