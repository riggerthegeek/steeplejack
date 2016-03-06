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
var _ = require("lodash");
var loader = require("load-grunt-tasks");
var timer = require("grunt-timer");


/* Files */


var stackDirs = [
    "coffeescript",
    "es5",
    "es6",
    "typescript"
];
var stackWrappers = _.reduce(stackDirs, function (result, type) {

    result[type] = {
        options: {
            wrapper: [
                "describe(\"" +
                type.toUpperCase() + "\", function () {\nvar app = require(\"../../../app/" +
                type + "/app\").app;\n",
                "});"
            ]
        },
        src: [
            "<%= config.test %>/stack/test/user/index.test.js"
        ],
        dest: "./<%= config.tmp %>/compiled/test/stack/test/" + type + "/user/index.test.js"
    };

    return result;

}, {});


module.exports = function (grunt) {


    /* Load all grunt tasks */
    loader(grunt);
    grunt.loadNpmTasks("remap-istanbul");


    /* Start the timer */
    timer.init(grunt);


    /* Config params */
    var config = {
        coverage: "coverage", /* Location of coverage files */
        test: "test", /* Location of the test files */
        tmp: "tmp", /* Temporary build files */
        typings: "typings"
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


        ignorePaths: [
            "*.tmp.txt",
            "<%= config.coverage %>",
            "<%= config.test %>",
            "<%= config.tmp %>",
            "<%= config.typings %>",
            "node_modules"
        ].join("|"),


        babel: {
            stack: {
                options: {
                    comments: false,
                    presets: [
                        "es2015"
                    ]
                },
                files: [{
                    expand: true,
                    src: "./<%= config.test %>/stack/app/es6/**/*.js",
                    dest: "./<%= config.tmp %>/compiled"
                }]
            }
        },


        clean: {
            dist: {
                files: [{
                    src: [
                        "./.baseDir.ts",
                        "./**/.baseDir.ts",
                        "./<%= config.coverage %>",
                        "./<%= config.tmp %>",
                        "./*.tmp.txt",
                        "./*.js.map",
                        "./!(Gruntfile)*.js",
                        "./*.d.ts",
                        "./!(<%= ignorePaths %>)/**/*.js.map",
                        "./!(<%= ignorePaths %>)/**/*.js",
                        "./!(<%= ignorePaths %>)/**/*.d.ts"
                    ]
                }]
            },
            tscache: {
                files: [{
                    src: ".tscache"
                }]
            },
            tmp: {
                files: [{
                    src: [
                        "./<%= config.tmp %>"
                    ]
                }]
            }
        },


        coffee: {
            stack: {
                expand: true,
                src: "./<%= config.test %>/stack/app/coffeescript/**/*.coffee",
                dest: "./<%= config.tmp %>/compiled",
                ext: ".js"
            }
        },


        copy: {
            es5stack: {
                files: [{
                    expand: true,
                    src: "<%= config.test %>/stack/app/es5/**/*",
                    dest: "./<%= config.tmp %>/compiled"
                }]
            },
            jsTest: {
                files: [{
                    expand: true,
                    src: "<%= config.test %>/**/*.{js,json}",
                    dest: "./<%= config.tmp %>/compiled"
                }]
            },
            jsonTest: {
                files: [{
                    expand: true,
                    src: "<%= config.test %>/**/*.json",
                    dest: "./<%= config.tmp %>/compiled"
                }]
            },
            stackDb: {
                files: [{
                    expand: true,
                    src: "<%= config.test %>/**/*.db",
                    dest: "./<%= config.tmp %>/compiled"
                }]
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
                        "./!(Gruntfile)*.js",
                        "./!(<%= ignorePaths %>)/**/*.js"
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
                        "./*.js",
                        "./!(<%= ignorePaths %>)/**/*.js"
                    ]
                }
            }
        },


        jsonlint: {
            src: {
                src: [
                    "./*.json",
                    "./!(<%= ignorePaths %>)/**/*.json",
                    "./<%= config.test %>/**/*.json"
                ]
            }
        },


        "mocha_istanbul": {
            generateReport: {
                options: {
                    recursive: true,
                    root: "./<%= config.tmp %>/compiled"
                },
                src: "./<%= config.tmp %>/compiled/test/unit/**/*.js"
            }
        },


        mochaTest: {
            options: {
                reporter: "spec",
                ui: "bdd"
            },
            stacktest: {
                src: [
                    "./<%= config.tmp %>/compiled/test/stack/test/**/*.js"
                ]
            },
            unittest: {
                src: [
                    "./<%= config.tmp %>/compiled/test/unit/**/*.js"
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
                compiler: "./node_modules/typescript/bin/tsc"
            },
            all: {
                options: {
                    fast: "never"
                },
                outDir: "./<%= config.tmp %>/compiled",
                src: [
                    "*.ts",
                    "./!(<%= ignorePaths %>)/**/*.ts",
                    "./<%= config.test %>/**/*.ts"
                ],
                tsconfig: true
            },
            src: {
                options: {
                    rootDir: "./"
                },
                src: [
                    "*.ts",
                    "./!(<%= ignorePaths %>)/**/*.ts"
                ],
                tsconfig: true
            }
        },


        tslint: {
            src: {
                options: {
                    configuration: "tslint.json"
                },
                src: [
                    "./*.ts",
                    "./!(<%= ignorePaths %>)/**/*.ts"
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
                    "*.ts",
                    "*.js",
                    "*.json",
                    "./!(<%= ignorePaths %>)/**/*",
                    "./<%= config.test %>/**/*"
                ],
                tasks: [
                    "compile"
                ]
            },
            coverage: {
                files: [
                    "*.ts",
                    "*.js",
                    "*.json",
                    "./!(<%= ignorePaths %>)/**/*",
                    "./<%= config.test %>/**/*"
                ],
                tasks: [
                    "codecoverage"
                ]
            },
            test: {
                files: [
                    "*.ts",
                    "*.js",
                    "*.json",
                    "./!(<%= ignorePaths %>)/**/*",
                    "./<%= config.test %>/**/*"
                ],
                tasks: [
                    "test"
                ]
            }
        },


        wrap: stackWrappers


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
        "clean",
        "compile"
    ]);


    grunt.registerTask("compile", "Compiles the public application", [
        "ts:src"
    ]);


    grunt.registerTask("codecoverage", "Runs the code coverage tests", [
        "clean",
        "ts:all",
        "copy:jsTest",
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


    grunt.registerTask("stacktest", "Runs test on an example stack", [
        "clean:tmp",
        "ts:all",

        /* Copy test files over */
        "copy:stackDb",
        "copy:jsonTest",
        "wrap:coffeescript",
        "wrap:es5",
        "wrap:es6",
        "wrap:typescript",

        /* CoffeeScript tasks */
        "coffee:stack",

        /* ES5 tasks */
        "copy:es5stack",

        /* ES6 tasks */
        "babel:stack",

        /* Run the tests */
        "mochaTest:stacktest"
    ]);


    grunt.registerTask("test", "Runs tests on the application", [
        "clean",
        "lint",
        "unittest"
    ]);


    grunt.registerTask("unittest", "Executes the unit tests", [
        "clean:tmp",
        "ts:all",
        "copy:jsTest",
        "mochaTest:unittest"
    ]);


};
