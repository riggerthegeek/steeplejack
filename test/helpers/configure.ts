/**
 * config
 */


/* Node modules */


/* Third-party modules */
import * as chai from "chai";
import * as proxyquireModule from "proxyquire";
import * as sinonModule from "sinon";
import sinonChai = require("sinon-chai");


/* Files */


chai.use(sinonChai);

export let expect = chai.expect;
export let proxyquire = proxyquireModule;
export let sinon = sinonModule;
