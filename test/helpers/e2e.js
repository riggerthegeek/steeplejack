/**
 * e2e
 *
 * Helps us set up the end-to-end tests
 */

// eslint-disable-next-line strict, lines-around-directive
'use strict';

/* Node modules */

/* Third-party modules */
const supertest = require('supertest');

/* Files */
const expect = require('./configure').expect;

const type = process.env.STEEPLEJACK_TYPE;

let app;
if (type === 'babel') {
  const babel = require('../e2e/babel/app');
  app = babel.default || babel;
} else if (type === 'native') {
  const native = require('../e2e/native/app');
  app = native.default || native;
} else {
  throw new Error(`Unknown test type ${type}`);
}

/* Create a request object with the application injected */
const request = supertest(app.server.getServer());

module.exports = {
  config: app.injector.getComponent('$config'),
  expect,
  request,
};
