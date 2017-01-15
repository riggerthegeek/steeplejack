/**
 * e2e
 *
 * Helps us set up the end-to-end tests
 */

/* Node modules */

/* Third-party modules */
import supertest from 'supertest-as-promised';

/* Files */
import { expect } from './configure';
import server from '../e2e/app/app';

/* Create a request object with the application injected */
const request = supertest(server.app);

export {
  expect,
  request
};
