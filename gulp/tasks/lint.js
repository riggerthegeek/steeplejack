/**
 * lint
 */

"use strict";


/* Node modules */


/* Third-party modules */
var gulp = require("gulp");
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var tslint = require("gulp-tslint");


/* Files */


gulp.task("lint", [
    "lint:ts"
]);


gulp.task("lint:js", function () {

    return gulp.src([
        "*.js",
        "gulp/**/*.js",
        "src/**/*.js"
    ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter("fail"));

});


gulp.task("lint:ts", function () {

    return gulp.src("src/**/*.ts")
        .pipe(tslint())
        .pipe(tslint.report("prose", {
            reportLimit: 5
        }));

});
