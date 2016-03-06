/**
 * Logger
 *
 * A simple logging strategy pattern.
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {Base} from "./base";
import {ILoggerStrategy} from "../interfaces/loggerStrategy";


export class Logger extends Base {


    protected _level: string = "error";


    /**
     * Constructor
     *
     * Creates a new instance of the strategy
     * class and ensures the concrete strategy
     * object is set
     *
     * @param {ILoggerStrategy} strategy
     */
    public constructor (protected strategy: ILoggerStrategy) {

        super();

    }


    /**
     * Level
     *
     * Gets the logging level
     *
     * @returns {string}
     */
    public get level () : string {
        return this._level;
    }


    /**
     * Level
     *
     * Sets the logging level. It will only
     * change it if it's in the log levels.
     *
     * @param {string} level
     */
    public set level (level: string) {

        let logLevel = Logger.getLogLevels();

        /* Set the log level if valid */
        if (_.indexOf(logLevel, level) !== -1) {
            this._level = level;
        }

    }


    /**
     * Triggers
     *
     * This is in order, from most to leave severe
     */


    /**
     * Fatal
     *
     * The most severe form of error. This is
     * triggered when there's no way of recovering
     * without human input.
     *
     * @param {*[]} args
     * @returns {Logger}
     */
    public fatal (...args: any[]) : Logger {
        this.strategy.fatal(...args);
        return this;
    }


    /**
     * Error
     *
     * @param {*[]} args
     * @returns {Logger}
     */
    public error (...args: any[]) : Logger {
        this.strategy.error(...args);
        return this;
    }


    /**
     * Warn
     *
     * @param {*[]} args
     * @returns {Logger}
     */
    public warn (...args: any[]) : Logger {
        this.strategy.warn(...args);
        return this;
    }


    /**
     * Info
     *
     * @param {*[]} args
     * @returns {Logger}
     */
    public info (...args: any[]) : Logger {
        this.strategy.info(...args);
        return this;
    }


    /**
     * Debug
     *
     * @param {*[]} args
     * @returns {Logger}
     */
    public debug (...args: any[]) : Logger {
        this.strategy.debug(...args);
        return this;
    }


    /**
     * Trace
     *
     * The least severe form of error. This is the
     * sort of thing to be used when we're marking
     * databases queries and such-like.
     *
     * @param {*[]} args
     * @returns {Logger}
     */
    public trace (...args: any[]) : Logger {
        this.strategy.trace(...args);
        return this;
    }


    /**
     * Get Log Levels
     *
     * Gets the available logging levels. This is
     * in order, from most to least severe.
     *
     * @returns {string[]}
     */
    public static getLogLevels () : string[] {
        return [
            "fatal",
            "error",
            "warn",
            "info",
            "debug",
            "trace"
        ];
    }


}
