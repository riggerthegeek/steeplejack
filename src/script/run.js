/**
 * Run
 *
 * This is the script that handles the running of
 * an instance of this application
 */

"use strict";


/* Node modules */
var path = require("path");


/* Third-party modules */
var _ = require("lodash");


/* Files */
var datatypes = require("../library/Base").datatypes;


/**
 * Replace With Env Vars
 *
 * Looks for a matching environment variable and
 * puts it into the object
 *
 * @param {object} obj
 * @returns {object}
 */
function replaceWithEnvVars(obj) {

    for (var k in obj) {
        var envvar = obj[k];
        if (typeof envvar === "object" && envvar !== null) {
            replaceWithEnvVars(envvar);
        } else {
            if (_.has(process.env, envvar)) {
                /* Replace the value */
                obj[k] = process.env[envvar];
            } else {
                delete obj[k];
            }
        }
    }

    return obj;
}


/**
 * Run
 *
 * Loads up and runs the main file
 *
 * @param {object} options
 * @param {function} cli
 * @returns {undefined}
 */
function Run (options, cli) {

    options = datatypes.setObject(options, {});

    /* Make sure the params is an object */
    var params = datatypes.setObject(options.params, {});

    /* Get the config file */
    var config = Run.loadConfigFilePath(options.configFile, params);

    /* Get the environment variables to config mapper file - optional */
    var envars = datatypes.setString(options.envvars, null);
    if (envars !== null) {
        var envarsConfig = Run.loadFile(Run.resolveFilePath(envars));

        /* Load up the environment variables */
        config = _.merge(config, replaceWithEnvVars(envarsConfig));
    }

    /* Get the target file */
    var Target = Run.loadTargetFilePath(options.filePath);

    /* Execute the target and listen for config */
    var inst = Target
        .create(config, cli)
        .on("config", function (config) {

            config = datatypes.setObject(config, {});

            var out = [
                "--- CONFIG ---",
                "",
                JSON.stringify(config, null, 2),
                "--------------",
                ""
            ];

            /* Write to the STDOUT */
            console.log(out.join("\n"));

        })
        .on("kill", function () {
            inst.emit("close");
        });

    return inst;

}


_.extend(Run, {


    /**
     * Load Config File Path
     *
     * Loads up a config file and merges in parameters
     *
     * @param {string} filePath
     * @param {object} params
     * @returns {object}
     */
    loadConfigFilePath: function (filePath, params) {
        filePath = Run.resolveFilePath(filePath);

        if (filePath === null) {
            throw new Error("CONFIG_FILE_NOT_SET");
        }

        var config = Run.loadFile(filePath);

        /* Merge the params and config - overwrite config with params */
        return _.merge(config, params);
    },


    /**
     * Load Target File Path
     *
     * Loads up the target file
     *
     * @param {string} filePath
     * @returns {function}
     */
    loadTargetFilePath: function (filePath) {
        filePath = Run.resolveFilePath(filePath);

        if (filePath === null) {
            throw new Error("MAIN_FILE_NOT_SET");
        }

        return Run.loadFile(filePath);
    },


    /**
     * Load File
     *
     * Loads up the file - done like this so we
     * can stub it easily
     *
     * @param {string} filePath
     * @returns {*}
     */
    loadFile: function (filePath) {
        try {
            return require(filePath);
        } catch (err) {
            /* Make this consistent with older versions of NodeJS */
            err.code = "MODULE_NOT_FOUND";
            throw err;
        }
    },


    /**
     * Get File Path
     *
     * Resolves the file path
     *
     * @param {string} filePath
     * @returns {string}
     */
    resolveFilePath: function (filePath) {
        filePath = datatypes.setString(filePath, null);

        if (filePath === null) {
            return filePath;
        }

        return path.resolve(process.cwd(), filePath);
    }


});


module.exports = Run;
