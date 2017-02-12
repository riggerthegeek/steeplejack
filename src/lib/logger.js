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
   * Trigger
   *
   * Triggers a new call to the log strategy. If the
   * level is unknown, it will throw an error.
   *
   * @param {string} level
   * @param {string} message
   * @param {*} data
   * @param {*[]}additional
   * @returns {Logger}
   */
  trigger (level, message, data, ...additional) {
    const trigger = level.toLowerCase();

    if (Logger.getLogLevels().indexOf(trigger) !== -1) {
      this.strategy[trigger](message, data, ...additional);
    } else {
      throw new SyntaxError(`Unknown log level: ${trigger}`);
    }

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
