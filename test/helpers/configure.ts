/**
 * config
 */

/// <reference path="../../typings/main.d.ts" />



/* Node modules */


/* Third-party modules */
import * as chai from "chai";
let Promise = require("bluebird");
let chaiAsPromised = require("chai-as-promised");
import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
let sinonAsPromised = require("sinon-as-promised");
import sinonChai = require("sinon-chai");
import * as supertest from "supertest";

console.log(supertest);


/* Files */


chai.use(sinonChai);
chai.use(chaiAsPromised);

sinonAsPromised(Promise);

export let expect = chai.expect;

proxyquire.noCallThru();

export {
    proxyquire,
    sinon
};
