/**
 * ServerOptions
 */


declare module Steeplejack {

    export interface IServerOptions {
        backlog?: number;
        hostname?: string;
        port: number;
    }

}
