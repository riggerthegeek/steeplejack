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
require("es6-collections");
var loader = require("load-grunt-tasks");
var timer = require("grunt-timer");
var ts = require("ts-node/register");


/* Files */


module.exports = function (grunt) {


    /* Load all grunt tasks */
    loader(grunt);
    grunt.loadNpmTasks("remap-istanbul");


    /* Start the timer */
    timer.init(grunt);


    /* Config params */
    var config = {
        coverage: "coverage", /* Location of coverage files */
        dist: "build", /* Location where distributable is built */
        src: "src", /* Location of the source files */
        test: "test", /* Location of the test files */
        tmp: "tmp" /* Temporary build files */
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
                        "**/.baseDir.ts",
                        "./<%= config.coverage %>",
                        "./<%= config.dist %>",
                        "./<%= config.tmp %>"
                    ]
                }]
            }
        },


        coveralls: {
            options: {
                force: false
            },
            src: {
                src: "./<%= config.coverage %>/lcov.info"
            }
        },


        coverage: {
            check: {
                options: {
                    thresholds: {
                        branches: 100,
                        functions: 100,
                        lines: 100,
                        statements: 100
                    },
                    dir: "./<%= config.coverage %>"
                }
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


        "mocha_istanbul": {
            generateReport: {
                options: {
                    recursive: true,
                    root: "./<%= config.dist %>/src"
                },
                src: "./<%= config.dist %>/test/unit/**/*.js"
            }
        },


        mochaTest: {
            options: {
                reporter: "spec",
                ui: "bdd"
            },
            unittest: {
                src: [
                    "./<%= config.test %>/unit/**/*.ts"
                ]
            }
        },


        remapIstanbul: {
            dist: {
                options: {
                    reports: {
                        "html": "./<%= config.coverage %>/lcov-report",
                        "json": "./<%= config.coverage %>/coverage.json"
                    }
                },
                src: "./<%= config.coverage %>/coverage.json"
            }
        },


        ts: {
            options: {
                declaration: true,
                module: "commonjs",
                moduleResolution: "node",
                noImplicitAny: true,
                preserveConstEnums: true,
                removeComments: true,
                sourceMap: true,
                target: "es5"
            },
            all: {
                outDir: "./<%= config.dist %>",
                src: [
                    "./<%= config.src %>/**/*.ts",
                    "./<%= config.test %>/**/*.ts"
                ]
            },
            src: {
                outDir: "./<%= config.dist %>",
                src: [
                    "./<%= config.src %>/**/*.ts"
                ]
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
        },


        watch: {
            options: {
                atBegin: true,
                dateFormat: function (time) {
                    grunt.log.writeln("The task finished in " + time + "ms");
                    grunt.log.writeln("Waiting for more changes…");
                }
            },
            compile: {
                files: [
                    "Gruntfile.js",
                    "package.json",
                    "./<%= config.src %>/**/*",
                    "./<%= config.test %>/**/*"
                ],
                tasks: [
                    "compile"
                ]
            },
            test: {
                files: [
                    "Gruntfile.js",
                    "package.json",
                    "./<%= config.src %>/**/*",
                    "./<%= config.test %>/**/*"
                ],
                tasks: [
                    "test"
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


    grunt.registerTask("ci", "Runs the continuous integration tests", [
        "test",
        "codecoverage"
    ]);


    grunt.registerTask("compile", "Compiles the public application", [
        "ts:src"
    ]);


    grunt.registerTask("codecoverage", "Runs the code coverage tests", [
        "clean",
        "ts:all",
        "mocha_istanbul:generateReport",
        "remapIstanbul:dist",
        "coverage:check"
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
