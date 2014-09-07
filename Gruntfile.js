/**
 * Gruntfile
 *
 * Handles the building of the application.
 *
 * @param grunt
 */

/* Node modules */


module.exports = function (grunt) {

    "use strict";

    /* Load all grunt tasks */
    require("load-grunt-tasks")(grunt);
    require("grunt-timer").init(grunt);

    grunt.initConfig({
        config: {
            build: "build",
            src: "src",
            test: "test"
        },
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            all: [
                "./<%= config.build %>"
            ]
        },
        copy: {
            src: {
                cwd: "./<%= config.src %>",
                dest: "./<%= config.build %>/",
                expand: true,
                src: "**/*.js"
            }
        },
        jscs: {
            options: {
                config: ".jscsrc"
            },
            src: {
                files: {
                    src: [
                        "Gruntfile.js",
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
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                esnext: true,
                globals: {
                },
                immed: true,
                indent: 4,
                latedef: true,
                noarg: true,
                node: true,
                newcap: true,
                quotmark: "double",
                regexp: true,
                strict: true,
                trailing: true,
                undef: true,
                unused: false
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
            checkCoverage: {
                options: {
                    check: {
                        branches: 100,
                        functions: 100,
                        lines: 100,
                        statements: 100
                    },
                    coverage: true,
                    recursive: true,
                    root: "./<%= config.src %>"
                },
                src: "./<%= config.test %>"
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: [
                    "./<%= config.test %>/**/*.js"
                ]
            }
        }
    });

    grunt.registerTask("build", "Build the package", [
        "clean:all",
        "test",
        "dist"
    ]);

    grunt.registerTask("ci", "Runs the continuous integration tests", [
        "test",
        "mocha_istanbul:checkCoverage"
    ]);

    grunt.registerTask("default", [
        "build"
    ]);

    grunt.registerTask("dist", "Create the distributable files", [
        "copy:src"
    ]);

    grunt.registerTask("lint", "Run the lint tests", [
        "jshint:src",
        "jsonlint:src",
        "jscs:src",
        "jscs:test" /* Run JSCS on tests to ensure readability */
    ]);

    grunt.registerTask("test", "Perform tests on the codebase", [
        "lint",
        "unittest"
    ]);

    grunt.registerTask("unittest", "Run the unit tests", [
        "mochaTest:test"
    ]);

};
