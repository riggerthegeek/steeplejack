/**
 * socket.test
 */

/* Node modules */
import { EventEmitter } from 'events';

/* Third-party modules */
import { Base } from '@steeplejack/core';

/* Files */
import Socket, { CONNECT_FLAG, MIDDLEWARE_FLAG } from '../../../src/lib/socket';
import { expect, proxyquire, sinon } from '../../helpers/configure';

describe('socket test', function () {

  describe('flags', function () {

    it('should ensure the CONNECT_FLAG is set to connect', function () {
      expect(CONNECT_FLAG).to.be.equal('connect');
    });

    it('should ensure MIDDLEWARE_FLAG is set to __middleware', function () {
      expect(MIDDLEWARE_FLAG).to.be.equal('__middleware');
    });

  });

  describe('methods', function () {

    beforeEach(function () {

      this.strategy = {
        broadcast: sinon.spy(),
        connect: sinon.spy(),
        createSocket: sinon.spy(),
        getSocketId: sinon.stub(),
        joinChannel: sinon.spy(),
        leaveChannel: sinon.spy(),
        listen: sinon.spy(),
      };

    });

    describe('#constructor', function () {

      it('should set the socket strategy', function () {

        const obj = new Socket(this.strategy);

        expect(obj).to.be.instanceof(Socket)
                    .instanceof(Base);

        expect(obj.strategy).to.be.equal(this.strategy);

      });

      it('should throw an error if strategy not an object', function () {

        let fail = false;

        try {
          new Socket(null); // eslint-disable-line no-new
        } catch (err) {

          fail = true;

          expect(err).to.be.instanceof(SyntaxError);
          expect(err.message).to.be.equal('Socket strategy object is required');

        } finally {
          expect(fail).to.be.true;
        }

      });

    });

    describe('#listen', function () {

      it('should listen, set the params and dispatch to the socketFn, resolving the promise', function (done) {

        const request = {
          emit: sinon.spy(),
          broadcast: sinon.spy(),
          disconnect: sinon.spy(),
          getId: sinon.spy(),
          joinChannel: sinon.spy(),
          leaveChannel: sinon.spy(),
          socket: 'socket',
          params: [],
          data: {},
        };

        this.strategy.listen = (socket, event, iterator) => {

          expect(socket).to.be.equal('socket');
          expect(event).to.be.equal('hello');
          expect(iterator).to.be.a('function');

          iterator('arg1', 'arg2', 'arg3')
                        .then((result) => {
                          expect(result).to.be.equal('bumtitty');
                          done();
                        })
                        .catch((err) => {
                          done(err);
                        });

        };

        const obj = new Socket(this.strategy);

        obj.listen(request, 'hello', (req) => {

          expect(req).to.be.equal(request);
          expect(req.params).to.be.eql([
            'arg1',
            'arg2',
            'arg3',
          ]);

          return 'bumtitty';
        });

      });

      it('should listen, set the params and dispatch to the socketFn, rejecting the promise', function (done) {

        const request = {
          emit: sinon.spy(),
          broadcast: sinon.spy(),
          disconnect: sinon.spy(),
          getId: sinon.spy(),
          joinChannel: sinon.spy(),
          leaveChannel: sinon.spy(),
          socket: 'sockety',
          params: [],
          data: {},
        };

        this.strategy.listen = (socket, event, iterator) => {

          expect(socket).to.be.equal('sockety');
          expect(event).to.be.equal('hello');
          expect(iterator).to.be.a('function');

          iterator('arg1', 'arg2')
                        .then(() => {
                          throw new Error('invalid error');
                        })
                        .catch((err) => {
                          expect(err).to.be.instanceof(Error);
                          expect(err.message).to.be.equal('some error');

                          done();
                        });

        };

        const obj = new Socket(this.strategy);

        obj.listen(request, 'hello', (req) => {

          expect(req).to.be.equal(request);
          expect(req.params).to.be.eql([
            'arg1',
            'arg2',
          ]);

          return Promise.reject(new Error('some error'));
        });

      });

      it('should listen, set the params and dispatch to the socketFn, throwing an error', function (done) {

        const request = {
          emit: sinon.spy(),
          broadcast: sinon.spy(),
          disconnect: sinon.spy(),
          getId: sinon.spy(),
          joinChannel: sinon.spy(),
          leaveChannel: sinon.spy(),
          socket: 'sockety',
          params: [],
          data: {},
        };

        this.strategy.listen = (socket, event, iterator) => {

          expect(socket).to.be.equal('sockety');
          expect(event).to.be.equal('hello');
          expect(iterator).to.be.a('function');

          iterator('arg1', 'arg2')
                        .then(() => {
                          throw new Error('invalid error');
                        })
                        .catch((err) => {
                          expect(err).to.be.instanceof(Error);
                          expect(err.message).to.be.equal('some thrown error');

                          done();
                        });

        };

        const obj = new Socket(this.strategy);

        obj.listen(request, 'hello', (req) => {

          expect(req).to.be.equal(request);
          expect(req.params).to.be.eql([
            'arg1',
            'arg2',
          ]);

          throw new Error('some thrown error');

        });

      });

    });

    describe('#namespace', function () {

      beforeEach(function () {

        this.socketRequest = sinon.stub();

        this.Stub = proxyquire('../../src/lib/socket', {
          './socketRequest': this.socketRequest,
        }).default;

      });

      it('should wrap the namespace with some events, no connect or middleware', function (done) {

        const socketRequestInst = {
          on: (event, listener) => {

            expect(event).to.be.equal('broadcast');
            expect(listener).to.be.a('function');

            listener('broadcast');

          },
        };

        this.socketRequest.returns(socketRequestInst);

        this.strategy.connect = (nsp, mid) => {

          expect(nsp).to.be.equal('namespace');
          expect(mid).to.be.eql([]);

          const emitter = new EventEmitter();

          setTimeout(() => {
            emitter.emit('namespace_connected', 'socketConnection');
          }, 1);

          return emitter;

        };

        const obj = new this.Stub(this.strategy);

        const listener = sinon.spy(obj, 'listen');
        const emitter = sinon.spy(obj, 'emit');

        setTimeout(() => {

          expect(listener).to.be.calledTwice;

          expect(emitter).to.be.calledTwice
                        .calledWithExactly('socketAdded', 'namespace', 'event1')
                        .calledWithExactly('socketAdded', 'namespace', 'event2');

          expect(this.socketRequest).to.be.calledOnce
                        .calledWithNew
                        .calledWithExactly('socketConnection', obj.strategy);

          expect(this.strategy.broadcast).to.be.calledOnce
                        .calledWithExactly(socketRequestInst, 'broadcast');

          done();

        }, 10);

        const event = {
          event1: () => {},
          event2: () => {},
        };

        expect(obj.namespace('namespace', event)).to.be.equal(obj);

      });

      it('should wrap the namespace with some events, connect and middleware', function (done) {

        const socketRequestInst = {
          on: (event, listener) => {

            expect(event).to.be.equal('broadcast');
            expect(listener).to.be.a('function');

            listener('broadcast');

          },
        };

        const event = {
          connect: sinon.spy(),
          __middleware: [
            () => {},
            () => {},
          ],
          event1: () => {},
          event2: () => {},
        };

        this.socketRequest.returns(socketRequestInst);

        this.strategy.connect = (nsp, mid) => {

          expect(nsp).to.be.equal('namespace');
          expect(mid).to.be.equal(event.__middleware);

          const emitter = new EventEmitter();

          setTimeout(() => {
            emitter.emit('namespace_connected', 'socketConnection');
          });

          return emitter;

        };

        const obj = new this.Stub(this.strategy);

        const listener = sinon.spy(obj, 'listen');
        const emitter = sinon.spy(obj, 'emit');

        setTimeout(() => {

          expect(listener).to.be.calledTwice;

          expect(emitter).to.be.calledTwice
                        .calledWithExactly('socketAdded', 'namespace', 'event1')
                        .calledWithExactly('socketAdded', 'namespace', 'event2');

          expect(this.socketRequest).to.be.calledOnce
                        .calledWithNew
                        .calledWithExactly('socketConnection', obj.strategy);

          expect(this.strategy.broadcast).to.be.calledOnce
                        .calledWithExactly(socketRequestInst, 'broadcast');

          expect(event.connect).to.be.calledOnce
                        .calledWithExactly(socketRequestInst);

          done();

        }, 10);

        expect(obj.namespace('namespace', event)).to.be.equal(obj);

      });

    });

  });

});
