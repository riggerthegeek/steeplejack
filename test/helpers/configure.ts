/**
 * config
 */

/// <reference path="../../typings/tsd.d.ts" />



/* Node modules */


/* Third-party modules */
import * as chai from "chai";
import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
import sinonChai = require("sinon-chai");


/* Files */


chai.use(sinonChai);

export let expect = chai.expect;

export {proxyquire, sinon};
