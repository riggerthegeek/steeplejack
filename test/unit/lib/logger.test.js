/**
 * logger.test
 */

/* Node modules */

/* Third-party modules */

/* Files */
import { expect, sinon } from '../../helpers/configure';
import Logger from '../../../src/lib/logger';

describe('Logger test', function () {

  describe('Methods', function () {

    let obj;
    let strategy;
    beforeEach(function () {

      const methods = [
        'level',
        'fatal',
        'error',
        'warn',
        'info',
        'debug',
        'trace',
      ];

      strategy = {};

      methods.forEach((method) => {
        strategy[method] = sinon.spy();
      });

      obj = new Logger(strategy);

    });

    describe('#fatal', function () {

      it('should send a fatal message', function () {

        const err = new Error('This is an error');

        expect(obj.fatal('message', err, 2)).to.be.equal(obj);

        expect(strategy.fatal).to.be.calledOnce
                    .calledWithExactly('message', err, 2);

      });

    });

    describe('#error', function () {

      it('should send a error message', function () {

        const err = new Error('This is an error');

        expect(obj.error('message', err, 3)).to.be.equal(obj);

        expect(strategy.error).to.be.calledOnce
                    .calledWithExactly('message', err, 3);

      });

    });

    describe('#warn', function () {

      it('should send a warn message', function () {

        const err = new Error('This is an error');

        expect(obj.warn('message', err, 4)).to.be.equal(obj);

        expect(strategy.warn).to.be.calledOnce
                    .calledWithExactly('message', err, 4);

      });

    });

    describe('#info', function () {

      it('should send an info message', function () {

        const err = new Error('This is an error');

        expect(obj.info('message', err, 5)).to.be.equal(obj);

        expect(strategy.info).to.be.calledOnce
                    .calledWithExactly('message', err, 5);

      });

    });

    describe('#debug', function () {

      it('should send a debug message', function () {

        const err = new Error('This is an error');

        expect(obj.debug('message', err, 6)).to.be.equal(obj);

        expect(strategy.debug).to.be.calledOnce
                    .calledWithExactly('message', err, 6);

      });

    });

    describe('#trace', function () {

      it('should send a trace message', function () {

        const err = new Error('This is an error');

        expect(obj.trace('message', err, 7)).to.be.equal(obj);

        expect(strategy.trace).to.be.calledOnce
                    .calledWithExactly('message', err, 7);

      });

    });

  });

  describe('Static method', function () {

    describe('#getLogLevels', function () {

      it('should return the logging levels', function () {

        expect(Logger.getLogLevels()).to.be.eql([
          'fatal',
          'error',
          'warn',
          'info',
          'debug',
          'trace',
        ]);

      });

    });

  });

});
