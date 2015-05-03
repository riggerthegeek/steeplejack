/**
 * sinon
 */

"use strict";


/* Node modules */


/* Third-party modules */
global.chai = require("chai");
global.sinon = require("sinon");


/* Files */


chai.use(require("sinon-chai"));
global.expect = chai.expect;
