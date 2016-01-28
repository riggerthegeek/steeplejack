/**
 * config
 */

/// <reference path="../../typings/tsd.d.ts" />



/* Node modules */


/* Third-party modules */
import * as chai from "chai";
let Promise = require("bluebird");
import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
import sinonChai = require("sinon-chai");
require("sinon-as-promised")(Promise);


/* Files */


chai.use(sinonChai);

export let expect = chai.expect;

proxyquire.noCallThru();

export {
    proxyquire,
    sinon
};
