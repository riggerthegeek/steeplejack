/**
 * index.test
 */

/* Node modules */

/* Third-party modules */

/* Files */
import { request } from '../../helpers/e2e';

describe('404 tests', function () {

  it('should return a 404 on a missing page', function () {

    return request.get('/some-non-existent-endpoint')
      .expect(404);

  });

});
