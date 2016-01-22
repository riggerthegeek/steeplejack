/**
 * ServerStrategy
 */


declare interface IServerStrategy {
    start: (port: number, hostname: string, backlog: number) => Promise<string>;
}
