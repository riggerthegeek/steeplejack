/**
 * ServerStrategy
 */


declare interface IServerStrategy {
    acceptParser?: (options: any, strict: boolean) => void;
    addRoute: (httpMethod: string, route: string, fn: Function | Function[]) => void;
    after?: (fn: Function) => void;
    bodyParser?: () => void;
    close?: () => void;
    enableCORS?: (origins: string[], addHeaders: string[]) => void;
    getServer: () => Object;
    gzipResponse?: () => void;
    outputHandler: (err: any, data: any, request: Object, result: Object) => any;
    start: (port: number, hostname: string, backlog: number) => any;
}
