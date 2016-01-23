/**
 * ServerStrategy
 */


declare interface IServerStrategy {
    acceptParser?: (options: any, strict: boolean) => void;
    addRoute: (httpMethod: string, route: string, fn: Function | Function[]) => void;
    after?: (fn: Function) => void;
    start: (port: number, hostname: string, backlog: number) => Promise<string>;
}