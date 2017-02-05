/**
 * view
 */

/* Node modules */

/* Third-party modules */
import { Base } from '@steeplejack/core';

/* Files */

export default class View extends Base {

    constructor ({data, headers, statusCode, template} = {}) {
        super();

        this.data = data || {};
        this.headers = headers || {};
        this.statusCode = statusCode || null;
        this.template = template || null;
    }

    /**
     * Get Headers
     *
     * Returns the headers
     *
     * @returns {object}
     */
    getHeaders () {
        return this.headers;
    }

    /**
     * Get Render Data
     *
     * Gets the render data
     *
     * @returns {object}
     */
    getRenderData () {
        return this.data;
    }

    /**
     * Get Status Code
     *
     * Gets the status code
     *
     * @returns {number}
     */
    getStatusCode () {
        return this.statusCode;
    }

    /**
     * Get Render Template
     *
     * Gets the template to render to
     *
     * @returns {string}
     */
    getRenderTemplate () {
        return this.template;
    }

    /**
     * Render
     *
     * Factory to create a View object
     *
     * @param {string} template
     * @param {*} data
     * @param {number} statusCode
     * @param {*} headers
     * @returns {View}
     */
    static render (template, data, statusCode = null, headers = {}) {
        return new View({
            data,
            headers,
            statusCode,
            template
        });
    }

}
