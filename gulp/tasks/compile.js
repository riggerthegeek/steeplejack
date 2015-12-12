/**
 * compile
 */

"use strict";


/* Node modules */


/* Third-party modules */
var dts = require("dts-generator");
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var ts = require("gulp-typescript");


/* Files */
var pkg = require("../../package.json");


gulp.task("compile", [
    "clean:ts",
    "compile:declarations"
], function () {

    var tsProject = ts.createProject("tsconfig.json");

    var tsResult = gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    tsResult.dts.pipe(gulp.dest("build"));

    return tsResult.js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build"));

});


gulp.task("compile:declarations", ["clean:declarations"], function () {

    dts.default({
        name: pkg.name,
        project: ".",
        out: pkg.name + ".d.ts"
    });

});
