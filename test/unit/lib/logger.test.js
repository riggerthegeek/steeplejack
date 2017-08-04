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

    describe('#trigger', function () {

      it('should send a fatal message with no data', function () {

        expect(obj.trigger('fatal', 'message')).to.be.equal(obj);

        expect(strategy.fatal).to.be.calledOnce
          .calledWithExactly('message', {});

      });

      it('should send a fatal message', function () {

        const err = new Error('This is an error');

        expect(obj.trigger('fatal', 'message', err, 2)).to.be.equal(obj);

        expect(strategy.fatal).to.be.calledOnce
          .calledWithExactly('message', err, 2);

      });

      it('should send a error message', function () {

        const err = new Error('This is an error');

        expect(obj.trigger('error', 'message', err, 3)).to.be.equal(obj);

        expect(strategy.error).to.be.calledOnce
          .calledWithExactly('message', err, 3);

      });

      it('should send a warn message', function () {

        const err = new Error('This is an error');

        expect(obj.trigger('warn', 'message', err, 4)).to.be.equal(obj);

        expect(strategy.warn).to.be.calledOnce
          .calledWithExactly('message', err, 4);

      });

      it('should send an info message', function () {

        const err = new Error('This is an error');

        expect(obj.trigger('info', 'message', err, 5)).to.be.equal(obj);

        expect(strategy.info).to.be.calledOnce
          .calledWithExactly('message', err, 5);

      });

      it('should send a debug message', function () {

        const err = new Error('This is an error');

        expect(obj.trigger('debug', 'message', err, 6)).to.be.equal(obj);

        expect(strategy.debug).to.be.calledOnce
          .calledWithExactly('message', err, 6);

      });

      it('should send a trace message', function () {

        const err = new Error('This is an error');

        expect(obj.trigger('trace', 'message', err, 7)).to.be.equal(obj);

        expect(strategy.trace).to.be.calledOnce
          .calledWithExactly('message', err, 7);

      });

      it('should throw an error if level not recognised', function () {

        let fail = false;
        try {
          obj.trigger('unknown', 'message', new Error('hello'), 7);
        } catch (err) {
          fail = true;

          expect(err).to.be.instanceof(SyntaxError);
          expect(err.message).to.be.equal('Unknown log level: unknown');

          Logger.getLogLevels().forEach((level) => {
            expect(strategy[level]).to.not.be.called;
          });
        } finally {
          expect(fail).to.be.true;
        }

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
