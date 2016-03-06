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
     * @param {string} message
     * @returns {Logger}
     */
    public fatal (message: string) : Logger {
        this.strategy.fatal(message);
        return this;
    }


    /**
     * Error
     *
     * @param {string} message
     * @returns {Logger}
     */
    public error (message: string) : Logger {
        this.strategy.error(message);
        return this;
    }


    /**
     * Warn
     *
     * @param {string} message
     * @returns {Logger}
     */
    public warn (message: string) : Logger {
        this.strategy.warn(message);
        return this;
    }


    /**
     * Info
     *
     * @param {string} message
     * @returns {Logger}
     */
    public info (message: string) : Logger {
        this.strategy.info(message);
        return this;
    }


    /**
     * Debug
     *
     * @param {string} message
     * @returns {Logger}
     */
    public debug (message: string) : Logger {
        this.strategy.debug(message);
        return this;
    }


    /**
     * Trace
     *
     * The least severe form of error. This is the
     * sort of thing to be used when we're marking
     * databases queries and such-like.
     *
     * @param {string} message
     * @returns {Logger}
     */
    public trace (message: string) : Logger {
        this.strategy.trace(message);
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
