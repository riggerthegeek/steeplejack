#!/usr/bin/env node

/**
 * App
 *
 * This runs the application as a command-line program.
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var cliOutput = require("../src/helper/cliOutput");
var cliParameters = require("../src/helper/cliParameters");
var program = require("../src/library/Commander");
var steeplejack = require("../");
//var script = require("../src/script");


/* Define the cmd variable - our commands are put in here */
var cmd;

/* This function is used to ignore unknown options */
var NOOP = function () {
};


/* Configure the CLI interface */
program
    .version(require("../package").version, "-v, --version");


/* Display the usage instructions */
program.usage("[command] [options]");


/**
 * Run
 */
cmd = program.command("run");
cmd.unknownOption = NOOP;
cmd.option("-C, --config-file [path/to/file]", "Specify the config file - a JS/JSON file containing the configuration parameters", String, null);
cmd.option("-M, --main [path/to/file]", "Specify the main file", String, null);
cmd.description("run the application");
cmd.action(function () {
    var args = cliParameters.apply(this, arguments);
    var stdout = cliOutput();
    try {
        steeplejack({
            params: args.params,
            configFile: args.commander.configFile,
            filePath: args.commander.main
        }, stdout);
    } catch (err) {
        stdout(err);
    }
});


/* Don't throw a wobbly if unknown options */
program.unknownOption = NOOP;


/* Parse input */
program.parse(process.argv);
if (program.args.length === 0) {
    program.usageMinusWildcard();
}
