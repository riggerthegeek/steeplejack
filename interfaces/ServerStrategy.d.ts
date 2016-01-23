/**
 * ServerStrategy
 */


declare interface IServerStrategy {
    addRoute: (httpMethod: string, route: string, fn: Function | Function[]) => void;
    start: (port: number, hostname: string, backlog: number) => Promise<string>;
}
