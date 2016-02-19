/**
 * ServerStrategy
 */

import EventEmitter = NodeJS.EventEmitter;

declare interface IServerStrategy extends EventEmitter {
    acceptParser: (options: any, strict: boolean) => void;
    addRoute: (httpMethod: string, route: string, fn: Function | Function[]) => void;
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
