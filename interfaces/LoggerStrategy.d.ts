/**
 * LoggerStrategy
 */


declare module ISteeplejack {

    export interface ILoggerStrategy {
        fatal(message: string): any;
        error(message: string): any;
        warn(message: string): any;
        info(message: string): any;
        debug(message: string): any;
        trace(message: string): any;
    }

}
