/**
 * lint
 */

"use strict";


/* Node modules */


/* Third-party modules */
var gulp = require("gulp");
var tslint = require("gulp-tslint");


/* Files */


gulp.task("lint", [
    "lint:ts"
]);


gulp.task("lint:ts", function () {

    return gulp.src("src/**/*.ts")
        .pipe(tslint())
        .pipe(tslint.report("prose", {
            reportLimit: 5
        }));

});
