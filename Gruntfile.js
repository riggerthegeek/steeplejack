/**
 * Gruntfile
 *
 * Handles the building of the application.
 *
 * This requires grunt as a global dependency
 *  npm install -g grunt-cli
 */

"use strict";


/* Node modules */


/* Third-party modules */
var loader = require("load-grunt-tasks");
var timer = require("grunt-timer");


/* Files */


module.exports = function (grunt) {


    /* Load all grunt tasks */
    loader(grunt);


    /* Start the timer */
    timer.init(grunt);


    /* Config params */
    var config  = {
        dist: "build", /* Location where distributable is built */
        src: "src", /* Location of the source files */
        test: "test", /* Location of the test files */
        tmp: ".tmp" /* Temporary build files */
    };

    /* Get the package.json file */
    var pkg = grunt.file.readJSON("package.json");


    /**
     * Configure Grunt
     *
     * These tasks shouldn't ordinarily be called from
     * the command line
     */
    grunt.initConfig({


        /* Set the config params */
        config: config,


        /* Set the package.json */
        pkg: pkg,


        clean: {
            dist: {
                files: [{
                    src: [
                        "./<%= config.dist %>",
                        "./<%= config.tmp %>"
                    ]
                }]
            }
        },


        jscs: {
            options: {
                config: ".jscsrc"
            },
            src: {
                files: {
                    src: [
                        "./<%= config.src %>/**/*.js"
                    ]
                }
            },
            test: {
                files: {
                    src: [
                        "./<%= config.test %>/**/*.js"
                    ]
                }
            }
        },


        jshint: {
            options: {
                jshintrc: true
            },
            src: {
                files: {
                    src: [
                        "Gruntfile.js",
                        "./<%= config.src %>/**/*.js"
                    ]
                }
            }
        },


        jsonlint: {
            src: {
                src: [
                    "./*.json",
                    "./<%= config.src %>/**/*.json",
                    "./<%= config.test %>/**/*.json"
                ]
            }
        },


        mochaTest: {
            options: {
                reporter: "spec",
                require: [
                    require("ts-node/register"),
                    "./<%= config.test %>/helpers/configureChai.js"
                ],
                ui: "bdd"
            },
            unittest: {
                src: [
                    "./<%= config.test %>/unit/**/*.test.ts"
                ]
            }
        },


        ts: {
            src: {
                options: {
                    declaration: true,
                    module: "commonjs",
                    sourceMap: true
                },
                src: [
                    "./<%= config.src %>/**/*.ts"
                ],
                outDir: "./<%= config.dist %>"
            }
        },


        tslint: {
            src: {
                options: {
                    configuration: "tslint.json"
                },
                src: [
                    "./<%= config.src %>/**/*.ts"
                ]
            }
        }


    });


    /**
     * Tasks
     *
     * These are the tasks that you will call
     * to do anything useful.
     */


    grunt.registerTask("build", "Builds the distributable artifact", [
        "clean:dist",
        "test",
        "compile"
    ]);


    grunt.registerTask("compile", "Compiles the public application", [
        "ts:src"
    ]);


    grunt.registerTask("coverage", "Runs the code coverage tests", [

    ]);


    grunt.registerTask("default", [
        "build"
    ]);


    grunt.registerTask("lint", "Runs code quality tests", [
        "tslint:src",
        "jshint:src",
        "jscs:src",
        "jscs:test",
        "jsonlint:src"
    ]);


    grunt.registerTask("test", "Runs tests on the application", [
        "lint",
        "unittest"
    ]);


    grunt.registerTask("unittest", "Executes the unit tests", [
        "mochaTest:unittest"
    ]);


};
