/**
 * config
 */

/* Node modules */

/* Third-party modules */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

/* Files */

chai.use(sinonChai);
chai.use(chaiAsPromised);

const expect = chai.expect;

proxyquire.noCallThru();

module.exports = {
  expect,
  proxyquire,
  sinon,
};
