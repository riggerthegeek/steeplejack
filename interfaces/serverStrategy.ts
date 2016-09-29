/**
 * ServerStrategy
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export interface IServerStrategy extends NodeJS.EventEmitter {
    addRoute: (httpMethod: string, route: string, iterator: (request: any, response: any) => any) => void;
    close: () => void;
    getRawServer: () => Object;
    getServer: () => Object;
    outputHandler: (statusCode: Number, data: any, request: any, result: any) => any;
    start: (port: number, hostname: string, backlog: number) => any;
    uncaughtException: (fn: Function) => void;
    use: (...args: any[]) => void;
}
