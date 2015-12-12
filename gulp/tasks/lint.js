/**
 * lint
 */

"use strict";


/* Node modules */


/* Third-party modules */
var gulp = require("gulp");
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");
var jsonlint = require("gulp-jsonlint");
var stylish = require("jshint-stylish");
var tslint = require("gulp-tslint");


/* Files */


gulp.task("lint", [
    "lint:js",
    "lint:json",
    "lint:ts"
]);


gulp.task("lint:js", function () {

    return gulp.src([
        "*.js",
        "gulp/**/*.js",
        "src/**/*.js"
    ])
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter("fail"));

});


gulp.task("lint:json", function () {

    return gulp.src([
        "*.json",
        "src/**/*.json"
    ])
        .pipe(jsonlint())
        .pipe(jsonlint.failAfterError())
        .pipe(jsonlint.reporter());

});


gulp.task("lint:ts", function () {

    return gulp.src("src/**/*.ts")
        .pipe(tslint())
        .pipe(tslint.report("prose", {
            reportLimit: 5
        }));

});
