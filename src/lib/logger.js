/**
 * Logger
 *
 * A simple logging strategy pattern.
 */

/* Node modules */

/* Third-party modules */
import { Base } from '@steeplejack/core';

/* Files */

export default class Logger extends Base {

   /**
     * Constructor
     *
     * Creates a new instance of the strategy
     * class and ensures the concrete strategy
     * object is set
     *
     * @param {*} strategy
     */
  constructor (strategy) {
    super();

    this.strategy = strategy;
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
     * @param {*} data
     * @param {*[]} args
     * @returns {Logger}
     */
  fatal (message, data, ...args) {
    this.strategy.fatal(message, data, ...args);
    return this;
  }

    /**
     * Error
     *
     * @param {string} message
     * @param {*} data
     * @param {*[]} args
     * @returns {Logger}
     */
  error (message, data, ...args) {
    this.strategy.error(message, data, ...args);
    return this;
  }

    /**
     * Warn
     *
     * @param {string} message
     * @param {*} data
     * @param {*[]} args
     * @returns {Logger}
     */
  warn (message, data, ...args) {
    this.strategy.warn(message, data, ...args);
    return this;
  }

    /**
     * Info
     *
     * @param {string} message
     * @param {*} data
     * @param {*[]} args
     * @returns {Logger}
     */
  info (message, data, ...args) {
    this.strategy.info(message, data, ...args);
    return this;
  }

    /**
     * Debug
     *
     * @param {string} message
     * @param {*} data
     * @param {*[]} args
     * @returns {Logger}
     */
  debug (message, data, ...args) {
    this.strategy.debug(message, data, ...args);
    return this;
  }

    /**
     * Trace
     *
     * The least severe form of error. This is the
     * sort of thing to be used when we're marking
     * databases queries and such-like. This is likely
     * to be the most noisy.
     *
     * @param {string} message
     * @param {*} data
     * @param {*[]} args
     * @returns {Logger}
     */
  trace (message, data, ...args) {
    this.strategy.trace(message, data, ...args);
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
  static getLogLevels () {
    return [
      'fatal',
      'error',
      'warn',
      'info',
      'debug',
      'trace',
    ];
  }

}
