/**
 * processRoutes.test
 */

/* Node modules */

/* Third-party modules */

/* Files */
import { expect, proxyquire, sinon } from '../../helpers/configure';

describe('processRoutes tests', function () {

  beforeEach(function () {

    this.Router = sinon.stub()
      .returns('hello');

    this.processRoutes = proxyquire('../../src/helpers/processRoutes', {
      '../lib/router': this.Router,
    }).default;

  });

  it('should run tests on routes', function () {

    const injector = {
      process: sinon.stub(),
    };

    injector.process.withArgs('routeFactory').returns('r');
    injector.process.withArgs('socketFactory').returns('s');

    const result = this.processRoutes(injector, {
      missing: {},
      hello: {
        route: {
          deps: [
            'dep1',
          ],
          factory: 'routeFactory',
        },
        socket: {
          deps: [
            'dep2',
            'dep3',
          ],
          factory: 'socketFactory',
        },
      },
    });

    expect(result).to.have.keys([
      'routes',
      'sockets',
    ]);

    expect(injector.process).to.be.calledTwice
      .calledWithExactly('routeFactory', [
        'dep1',
      ])
      .calledWithExactly('socketFactory', [
        'dep2',
        'dep3',
      ]);

    expect(this.Router).to.be.calledTwice
      .calledWithNew
      .calledWithExactly({
        hello: 'r',
      })
      .calledWithExactly({
        hello: 's',
      });

  });

});
