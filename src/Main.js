/**
 * Main
 *
 * This is the main application file.  This is an
 * object that receives all the config parameters
 * and then loads up the server
 *
 * @package steeplejack
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


module.exports = {


    /**
     * Static Methods
     *
     * These are methods that we want to expose publicly
     * to the API.
     */


    /**
     * Base
     *
     * This is our Base object.  It is intended that everything
     * useful is extended from here.
     */
    Base: require("./library/Base"),


    /**
     * Collection
     *
     * A Collection is a series of Models and allows you to perform
     * various functions on groups of data.  These are designed to
     * be extended.
     */
    Collection: require("./library/Collection"),


    /**
     * Exceptions
     *
     * This is for when it all goes wrong.  You can extend these or
     * use them as-is (the Exception class must be extended).
     */
    Exceptions: {
        Exception: require("./error/Exception"),
        Fatal: require("./error/Fatal"),
        Validation: require("./error/Validation")
    },


    /**
     * Injector
     *
     * This is a simple but effective Inversion of Control system
     */
    Injector: require("./library/Injector"),


    /**
     * Model
     *
     * This is what we use to manage our data.  These
     * are all designed to be extended and defined with
     * the schema.
     */
    Model: require("./library/DomainModel"),


    /**
     * Router
     *
     * This allows us to route our application
     */
    Router: require("./library/Router")


};
