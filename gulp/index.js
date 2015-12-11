/**
 * index
 */

"use strict";


/* Node modules */
var fs = require("fs");


/* Third-party modules */
var gulp = require("gulp");


/* Files */


var tasks = fs.readdirSync("./gulp/tasks");

tasks.forEach(function (task) {
    require("./tasks/" + task);
});