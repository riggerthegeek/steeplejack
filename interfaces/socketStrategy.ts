/**
 * socketStrategy
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {Promise} from "es6-promise";


/* Files */
import {IServerStrategy} from "./serverStrategy";


export interface ISocketStrategy {
    connect: (namespace: any) => Promise<any>;
    createSocket: (server: IServerStrategy) => void;
    listen: (socket: any, event: string, fn: () => void) => void;
    newNamespace: (namespace: string) => any;
}
