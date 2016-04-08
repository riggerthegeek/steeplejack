/**
 * LoggerStrategy
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export interface ILoggerStrategy {
    level(level: string): void;
    fatal(...args: any[]): any;
    error(...args: any[]): any;
    warn(...args: any[]): any;
    info(...args: any[]): any;
    debug(...args: any[]): any;
    trace(...args: any[]): any;
}
