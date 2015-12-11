/**
 * compile
 */

"use strict";


/* Node modules */


/* Third-party modules */
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var ts = require("gulp-typescript");


/* Files */


gulp.task("compile", ["clean:ts"], function () {

    var tsProject = ts.createProject("tsconfig.json");

    var tsResult = gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    tsResult.dts.pipe(gulp.dest("build"));

    return tsResult.js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build"));

});
