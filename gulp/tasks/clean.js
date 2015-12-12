/**
 * clean
 */

"use strict";


/* Node modules */


/* Third-party modules */
var del = require("del");
var gulp = require("gulp");


/* Files */
var pkg = require("../../package.json");


gulp.task("clean", [
    "clean:declarations",
    "clean:ts"
]);


gulp.task("clean:declarations", function () {

    return del([
        pkg.name + ".d.ts"
    ]);

});


gulp.task("clean:ts", function () {

    return del([
        "build"
    ]);

});
