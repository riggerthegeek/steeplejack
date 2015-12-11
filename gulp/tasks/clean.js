/**
 * clean
 */

"use strict";


/* Node modules */


/* Third-party modules */
var del = require("del");
var gulp = require("gulp");


/* Files */


gulp.task("clean:ts", function () {

    return del([
        "build"
    ]);

});
