/**
 * ServerStrategy
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export interface IServerStrategy extends NodeJS.EventEmitter {
    acceptParser: (options: string[], strict: boolean) => void;
    addRoute: (httpMethod: string, route: string) => any;
    after: (fn: Function) => void;
    before: (fn: Function) => void;
    bodyParser: () => void;
    close: () => void;
    enableCORS: (origins: string[], addHeaders: string[]) => void;
    getServer: () => Object;
    gzipResponse: () => void;
    outputHandler: (err: any, data: any, request: any, result: any) => any;
    queryParser: (mapParams: boolean) => void;
    start: (port: number, hostname: string, backlog: number) => any;
    uncaughtException: (fn: Function) => void;
    use: (fn: Function | Function[]) => void;
}
