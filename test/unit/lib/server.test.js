/**
 * server.test
 */

/* Node modules */
import { EventEmitter } from 'events';
import http from 'http';

/* Third-party modules */
import { Base } from '@steeplejack/core';
import Bluebird from 'bluebird';

/* Files */
import { expect, proxyquire, sinon } from '../../helpers/configure';

describe('Server tests', function () {

  let Server;
  beforeEach(function () {
    this.requestIp = {
      mw: sinon.stub(),
    };

    this.uuid = sinon.stub()
      .returns('some v4 uuid');

    Server = proxyquire('../../src/lib/server', {
      'request-ip': this.requestIp,
      'uuid/v4': this.uuid,
    });

    class Strategy extends EventEmitter {
      acceptParser () { }

      addRoute () { }

      after () { }

      before () { }

      bodyParser () { }

      close () { }

      enableCORS () { }

      getServer () {
        return {
          method () {},
        };
      }

      gzipResponse () { }

      outputHandler () { }

      queryParser () { }

      start () {
        return new Promise(function (resolve) {
          resolve();
        });
      }

      staticDir () { }

      uncaughtException () { }

      use () { }
    }

    class SocketStrategy extends EventEmitter {
      connect () {
        return this;
      }

      createSocket () {

      }
    }

    this.DefaultStrategy = Strategy;
    this.serverStrategy = new Strategy();

    this.DefaultSocketStrategy = SocketStrategy;
    this.socketStrategy = new SocketStrategy();
  });

  describe('Methods', function () {

    describe('#constructor', function () {

      it('should receive options and a strategy object', function () {

        const obj = new Server({
          port: 8080,
          backlog: 1000,
          hostname: '192.168.0.100',
        }, new this.DefaultStrategy());

        expect(obj).to.be.instanceof(Server)
          .instanceof(Base);

        expect(this.requestIp.mw).to.be.calledOnce
          .calledWithExactly({
            attributeName: Server.clientIp,
          });

      });

      it('should receive options, a strategy object and socket strategy', function () {

        const obj = new Server({
          port: 8080,
          backlog: 1000,
          hostname: '192.168.0.100',
        }, new this.DefaultStrategy(), new this.DefaultSocketStrategy());

        expect(obj).to.be.instanceof(Server)
          .instanceof(Base);

      });

      it("should throw an error if it doesn't receive a strategy object", function () {

        let fail = false;

        try {
          new Server(null, null); // eslint-disable-line no-new
        } catch (err) {
          fail = true;

          expect(err).to.be.instanceof(SyntaxError);
          expect(err.message).to.be.equal('Server strategy object is required');
        } finally {
          expect(fail).to.be.true;
        }

      });

    });

    describe('#logger', function () {

      it('should set the logger just to the server and strategy', function () {

        const strategy = {
          use: sinon.spy(),
        };
        const logger = {};

        const obj = new Server('opts', strategy);

        expect(obj.log).to.be.undefined;

        obj.log = logger;

        expect(obj.log).to.be.equal(logger);
        expect(obj.socket).to.be.undefined;
        expect(strategy.log).to.be.equal(logger);

      });

      it('should set the logger to a socket too', function () {

        const strategy = {
          use: sinon.spy(),
        };
        const socket = {
          createSocket: () => {},
        };
        const logger = {};

        const obj = new Server('opts', strategy, socket);

        expect(obj.log).to.be.undefined;

        obj.log = logger;

        expect(obj.log).to.be.equal(logger);
        expect(obj.socket.log).to.be.equal(logger);
        expect(strategy.log).to.be.equal(logger);

      });

    });

    describe('#routeFactory', function () {

      beforeEach(function () {

        this.clock = sinon.useFakeTimers(new Date(2015, 1, 1).getTime());

        this.spy = sinon.stub(this.serverStrategy, 'addRoute');
        this.outputHandler = sinon.stub(this.serverStrategy, 'outputHandler');

        this.req = {
          body: 'reqBody',
          [Server.clientIp]: 'clientIpAddress',
          headers: 'some headers',
          method: 'HTTP Method',
          url: 'currentURL',
        };

        this.obj = (new Server({
          port: 8080,
        }, this.serverStrategy));

        this.obj.log = sinon.spy();

        this.log = this.obj.log;

      });

      afterEach(function () {
        this.clock.restore();
      });

      it('should execute a single function', function () {

        this.outputHandler.resolves('outputResult');

        const fns = [
          (req, res) => {

            expect(req).to.be.equal(this.req);
            expect(res).to.be.equal('res');

            expect(this.log).to.be.calledOnce
              .calledWithExactly('info', 'New HTTP call', {
                body: 'reqBody',
                headers: 'some headers',
                id: 'some v4 uuid',
                ip: 'clientIpAddress',
                method: 'HTTP Method',
                time: Date.now(),
                url: 'currentURL',
              });

            return 'result1';

          },
        ];

        return this.obj.routeFactory(this.req, 'res', fns)
          .then((result) => {

            expect(result).to.be.equal('outputResult');

            expect(this.outputHandler).to.be.calledOnce
              .calledWithExactly(200, 'result1', this.req, 'res');

          });

      });

      it('should execute multiple functions in order', function () {

        this.outputHandler.resolves('outputResult');

        const order = [];

        const fns = [
          (req, res) => {

            expect(req).to.be.equal(this.req);
            expect(res).to.be.equal('res');

            return new Promise((resolve) => {
              order.push(0);
              resolve('result1');
            });

          },
          (req, res) => {

            expect(req).to.be.equal(this.req);
            expect(res).to.be.equal('res');

            return new Promise((resolve) => {
              order.push(1);
              resolve('result2');
            });

          },
        ];

        return this.obj.routeFactory(this.req, 'res', fns)
          .then((result) => {

            expect(result).to.be.equal('outputResult');

            expect(order).to.be.eql([
              0,
              1,
            ]);

            expect(this.outputHandler).to.be.calledOnce
              .calledWithExactly(200, 'result2', this.req, 'res');

            expect(this.log).to.be.calledTwice
              .calledWithExactly('info', 'New HTTP call', {
                body: 'reqBody',
                headers: 'some headers',
                id: 'some v4 uuid',
                ip: 'clientIpAddress',
                method: 'HTTP Method',
                time: Date.now(),
                url: 'currentURL',
              })
              .calledWithExactly('debug', 'Returning response to client', {
                body: 'result2',
                id: 'some v4 uuid',
                requestTime: 0,
                statusCode: 200,
              });

          });

      });

      it('should stop when executing multiple functions if a previous one fails - Error', function () {

        this.outputHandler.resolves('outputResult');

        let fail = false;

        const fns = [
          (req, res) => {

            expect(req).to.be.equal(this.req);
            expect(res).to.be.equal('res');

            throw new Error('some error');

          },
          () => {

            /* Test that this isn't called */
            fail = true;

            return 'result2';

          },
        ];

        return this.obj.routeFactory(this.req, 'res', fns)
          .then(() => {
            throw new Error('invalid error');
          })
          .catch((err) => {

            expect(err).to.be.instanceof(Error);
            expect(err.message).to.be.equal('some error');


            expect(this.log).to.be.calledTwice
              .calledWithExactly('info', 'New HTTP call', {
                body: 'reqBody',
                headers: 'some headers',
                id: 'some v4 uuid',
                ip: 'clientIpAddress',
                method: 'HTTP Method',
                time: Date.now(),
                url: 'currentURL',
              })
              .calledWithExactly('fatal', 'Uncaught exception', {
                err,
                id: 'some v4 uuid',
              });

            expect(this.outputHandler).to.not.be.called;

            expect(fail).to.be.false;

          });

      });

      it('should stop when executing multiple functions if a previous one fails - non-Error', function () {

        this.outputHandler.resolves('outputResult');

        let fail = false;

        const fns = [
          (req, res) => {

            expect(req).to.be.equal(this.req);
            expect(res).to.be.equal('res');

            return Promise.reject('some error');

          },
          () => {

            /* Test that this isn't called */
            fail = true;

            return 'result2';

          },
        ];

        return this.obj.routeFactory(this.req, 'res', fns)
          .then(() => {
            throw new Error('invalid error');
          })
          .catch((err) => {

            expect(err).to.be.equal('some error');

            expect(this.log).to.be.calledTwice
              .calledWithExactly('info', 'New HTTP call', {
                body: 'reqBody',
                headers: 'some headers',
                id: 'some v4 uuid',
                ip: 'clientIpAddress',
                method: 'HTTP Method',
                time: Date.now(),
                url: 'currentURL',
              })
              .calledWithExactly('fatal', 'Uncaught exception', {
                err,
                id: 'some v4 uuid',
              });

            expect(this.outputHandler).to.not.be.called;

            expect(fail).to.be.false;

          });

      });

      it('should treat three arguments as requiring a callback', function () {

        this.outputHandler.resolves('outputResult');

        const fns = [
          (req, res, cb) => {

            expect(req).to.be.equal(this.req);
            expect(res).to.be.equal('res');

            cb(null, 'result1');

          },
        ];

        return this.obj.routeFactory(this.req, 'res', fns)
          .then((result) => {

            expect(result).to.be.equal('outputResult');

            expect(this.outputHandler).to.be.calledOnce
              .calledWithExactly(200, 'result1', this.req, 'res');

            expect(this.log).to.be.calledTwice
              .calledWithExactly('info', 'New HTTP call', {
                body: 'reqBody',
                headers: 'some headers',
                id: 'some v4 uuid',
                ip: 'clientIpAddress',
                method: 'HTTP Method',
                time: Date.now(),
                url: 'currentURL',
              })
              .calledWithExactly('debug', 'Returning response to client', {
                body: 'result1',
                id: 'some v4 uuid',
                statusCode: 200,
                requestTime: 0,
              });

          });

      });

      it('should treat three arguments as requiring a callback - error', function () {

        this.outputHandler.resolves('outputResult');

        const fns = [
          (req, res, cb) => {

            expect(req).to.be.equal(this.req);
            expect(res).to.be.equal('res');

            cb(new Error('some error'));

          },
        ];

        return this.obj.routeFactory(this.req, 'res', fns)
          .then(() => {
            throw new Error('invalid');
          })
          .catch((err) => {

            expect(err).to.be.instanceof(Error);
            expect(err.message).to.be.equal('some error');

            expect(this.outputHandler).to.not.be.called;

            expect(this.log).to.be.calledTwice
              .calledWithExactly('info', 'New HTTP call', {
                body: 'reqBody',
                headers: 'some headers',
                id: 'some v4 uuid',
                ip: 'clientIpAddress',
                method: 'HTTP Method',
                time: Date.now(),
                url: 'currentURL',
              })
              .calledWithExactly('fatal', 'Uncaught exception', {
                err,
                id: 'some v4 uuid',
              });

          });

      });

      describe('#request log function', function () {

        it('should register a log function on the request object - no data/additional', function () {

          return this.obj.routeFactory(this.req, 'res', [
            (req, res) => {
              expect(this.req).to.be.equal(req);
              expect(res).to.be.equal('res');

              expect(req.log).to.be.a('function');

              req.log('logLevel', 'logMessage');

              expect(this.log).to.be.called
                .calledWithExactly('logLevel', 'logMessage', {
                  id: 'some v4 uuid',
                  ip: 'clientIpAddress',
                });
            },
          ]);

        });

        it('should register a log function on the request object - data not object', function () {

          return this.obj.routeFactory(this.req, 'res', [
            (req, res) => {
              expect(this.req).to.be.equal(req);
              expect(res).to.be.equal('res');

              expect(req.log).to.be.a('function');

              req.log('logLevel', 'logMessage', null);

              expect(this.log).to.be.called
                .calledWithExactly('logLevel', 'logMessage', null)
                .calledWithExactly('trace', 'Logged server data is not an object', {
                  data: null,
                  id: 'some v4 uuid',
                  ip: 'clientIpAddress',
                });
            },
          ]);

        });

        it('should register a log function on the request object - some data/additional', function () {

          return this.obj.routeFactory(this.req, 'res', [
            (req, res) => {
              expect(this.req).to.be.equal(req);
              expect(res).to.be.equal('res');

              expect(req.log).to.be.a('function');

              req.log('logLevel', 'logMessage', {
                hello: 'world',
                id: 'ignoreId',
                ip: 'ignoreIp',
              }, 2, 3, 'hello');

              expect(this.log).to.be.called
                .calledWithExactly('logLevel', 'logMessage', {
                  id: 'some v4 uuid',
                  ip: 'clientIpAddress',
                  hello: 'world',
                }, 2, 3, 'hello');
            },
          ]);

        });

      });

    });

    describe('#addRoute', function () {

      let obj;

      beforeEach(function () {

        this.spy = sinon.spy(this.serverStrategy, 'addRoute');

        obj = new Server({
          port: 8080,
        }, this.serverStrategy);

        obj.log = sinon.spy();

      });

      it('should throw an error if httpMethod not a string', function () {

        let fail = false;

        try {
          obj.addRoute(null, null, null);
        } catch (err) {

          fail = true;

          expect(err).to.be.instanceof(TypeError);
          expect(err.message).to.be.equal('httpMethod must be a string');

        } finally {

          expect(fail).to.be.true;

        }

      });

      it('should throw an error if route not a string', function () {

        let fail = false;

        try {
          obj.addRoute('get', null, null);
        } catch (err) {

          fail = true;

          expect(err).to.be.instanceof(TypeError);
          expect(err.message).to.be.equal('route must be a string');

        } finally {

          expect(fail).to.be.true;

        }

      });

      it('should throw an error if fn not a function or array', function () {

        [
          null,
        ].forEach(function (fn) {

          let fail = false;

          try {
            obj.addRoute('get', '/route', fn);
          } catch (err) {

            fail = true;

            expect(err).to.be.instanceof(TypeError);
            expect(err.message).to.be.equal('fn must be a function or array');

          } finally {

            expect(fail).to.be.true;

          }

        });

      });

      it('should allow a known HTTP method through', function () {

        [
          'get',
          'GET',
          'post',
          'POST',
          'DEL',
          'del',
          'DELETE',
          'delete',
          'head',
          'HEAD',
          'patch',
          'PATCH',
          'opts',
          'OPTS',
          'options',
          'OPTIONS',
        ].forEach((method, i) => {

          const fn = function () {};

          let httpMethod = method.toUpperCase();

          /* Check delete and options have been shortened */
          if (httpMethod === 'DEL') {
            httpMethod = 'DELETE';
          } else if (httpMethod === 'OPTS') {
            httpMethod = 'OPTIONS';
          }

          let emitted = false;

          obj.once('routeAdded', (emittedMethod, emittedRoute) => {
            emitted = true;

            expect(emittedMethod).to.be.equal(httpMethod);
            expect(emittedRoute).to.be.equal('/route');
          });

          expect(obj.addRoute(method, '/route', fn)).to.be.equal(obj);

          expect(emitted).to.be.true;

          i += 1;

          expect(this.spy).to.be.callCount(i)
            .calledWith(httpMethod, '/route');

        });

      });

      it('should allow a known HTTP method through - array passed in', function () {

        [
          'get',
          'GET',
          'post',
          'POST',
          'DEL',
          'del',
          'DELETE',
          'delete',
          'head',
          'HEAD',
          'patch',
          'PATCH',
          'opts',
          'OPTS',
          'options',
          'OPTIONS',
        ].forEach((method, i) => {

          const fn = [
            function () {},
          ];

          let httpMethod = method.toUpperCase();

          /* Check delete and options have been shortened */
          if (httpMethod === 'DEL') {
            httpMethod = 'DELETE';
          } else if (httpMethod === 'OPTS') {
            httpMethod = 'OPTIONS';
          }

          let emitted = false;

          obj.once('routeAdded', (emittedMethod, emittedRoute) => {
            emitted = true;

            expect(emittedMethod).to.be.equal(httpMethod);
            expect(emittedRoute).to.be.equal('/route');
          });

          expect(obj.addRoute(method, '/route', fn)).to.be.equal(obj);

          expect(emitted).to.be.true;

          expect(this.spy).to.be.callCount(i += 1)
            .calledWith(httpMethod, '/route');

        });

      });

      it("should add 'all' to each known method", function () {

        const fn = function () {};

        const methods = [
          'GET',
          'POST',
          'PUT',
          'DELETE',
          'HEAD',
          'PATCH',
          'OPTIONS',
        ];

        const emitted = [];
        let count = 0;
        obj.on('routeAdded', (emittedMethod, emittedRoute) => {

          emitted.push(emittedMethod);
          expect(emittedRoute).to.be.equal('/route');
          count += 1;

        });

        expect(obj.addRoute('all', '/route', fn)).to.be.equal(obj);

        expect(count).to.be.equal(methods.length);

        /* We don't care about order, just values */
        expect(emitted.sort()).to.be.eql(methods.sort());

        expect(this.spy).to.be.callCount(methods.length);

        methods.forEach((method) => {
          expect(this.spy).to.be.calledWith(method, '/route');
        });

      });

      it('should throw an error if an unknown HTTP method', function () {

        let fail = false;

        try {
          obj.addRoute('method', '/route', function () { });
        } catch (err) {
          fail = true;

          expect(err).to.be.instanceof(SyntaxError);
          expect(err.message).to.be.equal('HTTP method is unknown: METHOD:/route');
        } finally {
          expect(fail).to.be.true;
        }

      });

    });

    describe('#addRoutes', function () {

      let obj;

      beforeEach(function () {

        this.addRoute = sinon.stub(this.serverStrategy, 'addRoute');
        this.strategyOutput = sinon.spy(this.serverStrategy, 'outputHandler');

        obj = new Server({
          port: 8080,
        }, this.serverStrategy);

        obj.log = sinon.spy();

        this.outputHandler = sinon.spy(obj, 'outputHandler');

      });

      it('should go through an objects of objects, passing to the strategy', function (done) {

        const fn1 = function () {
          return 'fn1';
        };
        const fn2 = function () {
          return 'fn2';
        };
        const fn3 = function () {
          return 'fn3';
        };
        const fn4 = function () {
          return 'fn4';
        };

        const arr = [fn3, fn4];

        const routes = {
          '/test': {
            get: fn1,
            post: fn2,
          },
          '/test/example': {
            del: arr,
          },
        };

        let count = 0;
        const emitted = [];
        obj.on('routeAdded', (emittedMethod, emittedRoute) => {

          emitted.push(emittedMethod);
          if (emittedMethod === 'DELETE') {
            expect(emittedRoute).to.be.equal('/test/example');
          } else {
            expect(emittedRoute).to.be.equal('/test');
          }
          count += 1;

        });

        const req = {
          req: true,
          headers: {},
        };
        const res = {
          res: true,
        };

        this.addRoute.yields(req, res);

        expect(obj.addRoutes(routes)).to.be.equal(obj);

        expect(count).to.be.equal(3);

        expect(this.outputHandler).to.be.calledThrice
          .calledWith(req, res);

        expect(this.addRoute).to.be.calledThrice
          .calledWith('GET', '/test')
          .calledWith('POST', '/test')
          .calledWith('DELETE', '/test/example');

        setTimeout(() => {

          expect(this.strategyOutput).to.be.calledThrice
            .calledWithExactly(200, 'fn1', req, res)
            .calledWithExactly(200, 'fn2', req, res)
            .calledWithExactly(200, 'fn4', req, res);

          done();

        }, 10);

      });

      it('should not parse an object of non-objects', function () {

        const routes = {
          '/test1': function () {},
          '/test2': [2],
          '/test3': null,
          '/test4': true,
          '/test5': false,
          '/test6': 2.3,
        };

        let count = 0;
        obj.on('routeAdded', () => {
          count += 1;
        });

        expect(obj.addRoutes(routes)).to.be.equal(obj);

        expect(count).to.be.equal(0);

        expect(this.addRoute).to.not.be.called;

      });

      it('should not pass a non-object', function () {

        const routes = [];

        obj.addRoutes(routes);

        expect(this.addRoute).to.not.be.called;

      });

    });

    describe('#addSockets', function () {

      beforeEach(function () {

        this.listen = sinon.spy();

        this.socketStrategy = {
          connect: (sinon.stub()).resolves(),
          createSocket: sinon.spy(),
          listen: sinon.spy(),
        };

        this.socketInst = {
          namespace: sinon.stub(),
        };

        this.socketInst.namespace.returns(this.socketInst);

        this.socket = sinon.stub().returns(this.socketInst);

        this.SServer = proxyquire('../../src/lib/server', {
          './socket': this.socket,
        });

        this.sockets = {
          socket1: {
            event1: () => {},
            event2: () => {},
          },
          socket2: {
            event1: () => {},
          },
        };

      });

      it('should not add any sockets if not socket strategy defined', function () {

        const obj = new this.SServer({
          port: 8080,
          backlog: 1000,
          hostname: '192.168.0.100',
        }, new this.DefaultStrategy());

        expect(obj.addSockets(this.sockets)).to.be.equal(obj);

        expect(this.socketInst.namespace).to.not.be.called;

      });

      it('should add sockets if the socket strategy is defined', function () {

        const obj = new this.SServer({
          port: 8080,
          backlog: 1000,
          hostname: '192.168.0.100',
        }, new this.DefaultStrategy(), this.socketStrategy);

        const ons = [];

        obj.on('socketAdded', (nsp, eventName) => {
          ons.push({
            nsp,
            eventName,
          });
        });

        expect(obj.addSockets(this.sockets)).to.be.equal(obj);

        expect(this.socketInst.namespace).to.be.calledTwice
          .calledWithExactly('socket1', this.sockets.socket1)
          .calledWithExactly('socket2', this.sockets.socket2);

        expect(ons).to.have.length(3);

        expect(ons[0].nsp).to.be.equal('socket1');
        expect(ons[1].nsp).to.be.equal('socket1');
        expect(ons[2].nsp).to.be.equal('socket2');

        expect(ons[0].eventName).to.be.equal('event1');
        expect(ons[1].eventName).to.be.equal('event2');
        expect(ons[2].eventName).to.be.equal('event1');

      });

    });

    describe('#after', function () {

      let obj;

      beforeEach(function () {

        obj = new Server({
          port: 8080,
        }, this.serverStrategy);

      });

      it('should send through to the after method', function () {

        const fn = function () { };
        const fn2 = function () { };
        const fn3 = function () { };

        expect(obj.middleware.afterUse).to.be.an('array')
          .to.have.length(0);

        expect(obj.after(fn)).to.be.equal(obj);

        expect(obj.middleware.afterUse).to.be.an('array')
          .to.have.length(1);

        expect(obj.middleware.afterUse[0]()).to.be.eql([
          fn,
        ]);

        expect(obj.after(fn2, fn3)).to.be.equal(obj);

        expect(obj.middleware.afterUse).to.be.an('array')
          .to.have.length(2);

        expect(obj.middleware.afterUse[0]()).to.be.eql([
          fn,
        ]);
        expect(obj.middleware.afterUse[1]()).to.be.eql([
          fn2,
          fn3,
        ]);

      });

    });

    describe('#close', function () {

      let obj;

      beforeEach(function () {

        this.spy = sinon.spy(this.serverStrategy, 'close');

        obj = new Server({
          port: 8080,
        }, this.serverStrategy);

      });

      it('should defer to the strategy method', function () {

        expect(obj.close()).to.be.equal(obj);

        expect(this.spy).to.be.calledOnce
          .calledWithExactly();

      });

    });

    describe('#getServer', function () {

      let obj;

      beforeEach(function () {

        this.stub = sinon.stub(this.serverStrategy, 'getServer');

        obj = new Server({
          port: 8080,
        }, this.serverStrategy);

      });

      it('should get the server instance', function () {

        this.stub.returns('server');

        expect(obj.getServer()).to.be.equal('server');

        expect(this.stub).to.be.calledOnce
          .calledWithExactly();

      });

    });

    describe('#outputHandler', function () {

      let obj;

      beforeEach(function () {

        this.req = {
          req: true,
          hello: () => {},
          startTime: new Date(),
          id: 'requestId',
        };
        this.res = {
          res: true,
          hello: () => {},
        };

        this.stub = sinon.stub(this.serverStrategy, 'outputHandler');

        obj = new Server({
          port: 8080,
        }, this.serverStrategy);

        this.emit = sinon.spy(obj, 'emit');

        obj.log = sinon.spy();

        this.log = obj.log;

      });

      describe('successful response', function () {

        afterEach(function () {
          expect(this.emit).to.not.be.called;
        });

        it('should dispatch to the strategy, resolving a promise', function () {

          this.req.id = 'request id';
          this.req.startTime = new Date(2015, 1, 1, 12, 12, 34, 1);

          const clock = sinon.useFakeTimers(new Date(2015, 1, 1, 12, 12, 35).getTime());

          this.stub.returns('output');

          return obj.outputHandler(this.req, this.res, () => 'result')
            .then((data) => {

              expect(data).to.be.equal('output');

              expect(this.stub).to.be.calledOnce
                .calledWithExactly(200, 'result', this.req, this.res);

              expect(this.log).to.be.calledOnce
                .calledWithExactly('debug', 'Returning response to client', {
                  body: 'result',
                  id: 'request id',
                  requestTime: 999,
                  statusCode: 200,
                });

              clock.restore();

            });

        });

        it('should return the status code and empty output', function () {

          this.stub.returns('output');

          return obj.outputHandler(this.req, this.res, () => 201)
            .then((data) => {

              expect(data).to.be.equal('output');

              expect(this.stub).to.be.calledOnce
                .calledWithExactly(201, undefined, this.req, this.res);

            });

        });

        it('should call the getData function', function () {

          this.stub.returns('output');

          return obj.outputHandler(this.req, this.res, () => ({
            getData: () => 'getDataOutput',
          }))
            .then((data) => {

              expect(data).to.be.equal('output');

              expect(this.stub).to.be.calledOnce
                .calledWithExactly(200, 'getDataOutput', this.req, this.res);

            });

        });

        it('return empty data and set the status code to 204', function () {

          this.stub.returns('output');

          return obj.outputHandler(this.req, this.res, () => '')
            .then((data) => {

              expect(data).to.be.equal('output');

              expect(this.stub).to.be.calledOnce
                .calledWithExactly(204, undefined, this.req, this.res);

            });

        });

        it('should return an empty object', function () {

          this.stub.returns('output');

          return obj.outputHandler(this.req, this.res, () => ({}))
            .then((data) => {

              expect(data).to.be.equal('output');

              expect(this.stub).to.be.calledOnce
                .calledWithExactly(200, {}, this.req, this.res);

            });

        });

        it('return undefined data and set the status code to 204', function () {

          this.stub.returns('output');

          return obj.outputHandler(this.req, this.res, () => {

          })
            .then((data) => {

              expect(data).to.be.equal('output');

              expect(this.stub).to.be.calledOnce
                .calledWithExactly(204, undefined, this.req, this.res);

            });

        });

        it('return null data and set the status code to 204', function () {

          this.stub.returns('output');

          return obj.outputHandler(this.req, this.res, () => null)
            .then((data) => {

              expect(data).to.be.equal('output');

              expect(this.stub).to.be.calledOnce
                .calledWithExactly(204, undefined, this.req, this.res);

            });

        });

        it('return numeric data and not set the status code to 204', function () {

          this.stub.returns('output');

          return obj.outputHandler(this.req, this.res, () => 2)
            .then((data) => {

              expect(data).to.be.equal('output');

              expect(this.stub).to.be.calledOnce
                .calledWithExactly(200, 2, this.req, this.res);

            });

        });

        it('should send to the preSend function', function () {

          let calledPreSend = false;

          obj.preSend((statusCode, output, req, res) => {

            calledPreSend = true;

            expect(statusCode).to.be.equal(200);
            expect(output).to.be.eql({
              hello: 'world',
            });
            expect(req).to.be.equal(this.req);
            expect(res).to.be.equal(this.res);

            return {
              statusCode: 201,
              output: 'output',
            };

          });

          this.stub.returns('some output');

          return obj.outputHandler(this.req, this.res, () => ({
            hello: 'world',
          })).then((data) => {

            expect(data).to.be.equal('some output');

            expect(calledPreSend).to.be.true;

            expect(this.stub).to.be.calledOnce
              .calledWithExactly(201, 'output', this.req, this.res);

          });

        });

        it("should receive 'end' and not send the output", function () {

          this.stub.returns('output');

          return obj.outputHandler(this.req, this.res, () => 'end')
            .then((data) => {

              expect(data).to.be.undefined;

              expect(this.stub).to.not.be.called;

            });

        });

        it('should log View instance with template and data', function () {

          const view = {
            getRenderTemplate: sinon.stub()
              .returns('render template result'),
            getRenderData: sinon.stub()
              .returns('render data result'),
          };

          this.stub.returns('output');

          return obj.outputHandler(this.req, this.res, () => view)
            .then((data) => {

              expect(data).to.be.equal('output');

              expect(this.stub).to.be.calledOnce
                .calledWithExactly(200, view, this.req, this.res);

              expect(this.log).to.be.calledOnce
                .calledWith('debug', 'Returning response to client');

              const output = this.log.args[0][2];

              expect(output).to.have.keys([
                'body',
                'id',
                'requestTime',
                'statusCode',
              ]);

              expect(output.body).to.be.eql({
                data: 'render data result',
                template: 'render template result',
              });

              expect(output.id).to.be.equal(this.req.id);
              expect(output.requestTime).to.be.a('number');
              expect(output.statusCode).to.be.equal(200);

            });

        });

      });

      describe('failed response', function () {

        describe('no uncaught exception listeners', function () {

          it("should not call the preSend if it's an error response", function () {

            let callPreSend = false;

            obj.preSend(() => {
              callPreSend = true;
            });

            return obj.outputHandler(this.req, this.res, () => Promise.reject('rejected promise')).then(() => {
              throw new Error('invalid');
            })
              .catch((err) => {

                expect(callPreSend).to.be.false;

                expect(err).to.be.equal('rejected promise');

              });

          });

          it('should handle an error in the strategy, emitting to uncaughtException listener after resolved promise', function () {

            this.stub.rejects(new Error('output'));

            return obj.outputHandler(this.req, this.res, () => 'result')
              .then(() => {
                throw new Error('invalid');
              })
              .catch((err) => {

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.equal('output');

                expect(this.stub).to.be.calledOnce
                  .calledWithExactly(200, 'result', this.req, this.res);

                expect(this.emit).to.not.be.called;

              });

          });

          it('should handle an error in the function, emitting to uncaughtException listener', function () {

            this.req.id = 'myId';

            return obj.outputHandler(this.req, this.res, () => {
              throw new Error('output');
            })
              .then(() => {
                throw new Error('invalid');
              })
              .catch((err) => {

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.equal('output');

                expect(this.stub).to.not.be.called;

                expect(this.emit).to.not.be.called;

                expect(this.log).to.be.calledOnce
                  .calledWithExactly('fatal', 'Uncaught exception', {
                    err,
                    id: 'myId',
                  });

              });

          });

          it('should handle a rejected promise in the function, emitting to uncaughtException listener', function () {

            this.req.id = 'new id';
            return obj.outputHandler(this.req, this.res, () => Promise.reject({
              hello: 'world',
            }))
              .then(() => {
                throw new Error('invalid');
              })
              .catch((err) => {

                expect(err).to.be.eql({
                  hello: 'world',
                });

                expect(this.stub).to.not.be.called;

                expect(this.emit).to.not.be.called;

                expect(this.log).to.be.calledOnce
                  .calledWithExactly('fatal', 'Uncaught exception', {
                    err,
                    id: 'new id',
                  });

              });

          });

          it('should return the status code and empty output', function () {

            this.stub.returns('output');

            return obj.outputHandler(this.req, this.res, () => Promise.reject(506))
              .then((data) => {

                expect(data).to.be.equal('output');

                expect(this.stub).to.be.calledOnce
                  .calledWithExactly(506, {
                    statusCode: 506,
                    message: http.STATUS_CODES[506],
                  }, this.req, this.res);

                expect(this.emit).to.be.calledOnce
                  .calledWithExactly('error_log', 506);

              });

          });

          it('should return the status code and empty output - unknown status code', function () {

            this.stub.returns('output');

            return obj.outputHandler(this.req, this.res, () => Promise.reject(599))
              .then((data) => {

                expect(data).to.be.equal('output');

                expect(this.stub).to.be.calledOnce
                  .calledWithExactly(599, {
                    statusCode: 599,
                    message: 'Unknown error',
                  }, this.req, this.res);

                expect(this.emit).to.be.calledOnce
                  .calledWithExactly('error_log', 599);

              });

          });

          it('should handle a validation error - no errors', function () {

            this.stub.returns('output');

            const err = {
              type: 'errcode',
              message: 'errmessage',
              hasErrors: () => false,
            };

            return obj.outputHandler(this.req, this.res, () => Promise.reject(err))
              .then((data) => {

                expect(data).to.be.equal('output');

                expect(this.stub).to.be.calledOnce
                  .calledWithExactly(400, {
                    code: 'errcode',
                    message: 'errmessage',
                  }, this.req, this.res);

                expect(this.emit).to.be.calledOnce
                  .calledWithExactly('error_log', err);

              });

          });

          it('should handle a validation error - some errors', function () {

            this.stub.returns('output');

            const err = {
              type: 'errcode2',
              message: 'errmessage2',
              getErrors: () => 'err list',
              hasErrors: () => true,
            };

            return obj.outputHandler(this.req, this.res, () => Promise.reject(err))
              .then((data) => {

                expect(data).to.be.equal('output');

                expect(this.stub).to.be.calledOnce
                  .calledWithExactly(400, {
                    code: 'errcode2',
                    message: 'errmessage2',
                    error: 'err list',
                  }, this.req, this.res);

                expect(this.emit).to.be.calledOnce
                  .calledWithExactly('error_log', err);

              });

          });

          it('should handle an ordinary error and not emit it', function () {

            const err = {
              type: 'errcode2',
              message: 'errmessage2',
              getErrors: () => 'err list',
              hasErrors: () => true,
            };

            this.stub.resolves('output');

            return obj.outputHandler(this.req, this.res, () => Promise.reject(err), false)
              .then((data) => {

                expect(data).to.be.equal('output');

                expect(this.stub).to.be.calledOnce
                  .calledWithExactly(400, {
                    code: 'errcode2',
                    message: 'errmessage2',
                    error: 'err list',
                  }, this.req, this.res);

                expect(this.emit).to.not.be.called;

              });

          });

          it('should handle an ordinary error - getHttpCode and getDetail methods', function () {

            this.stub.returns('output');

            const err = new Error('uh-oh crap');
            (err).getHttpCode = () => 401;
            (err).getDetail = () => 'detail';

            return obj.outputHandler(this.req, this.res, () => Promise.reject(err))
              .then((data) => {

                expect(data).to.be.equal('output');

                expect(this.stub).to.be.calledOnce
                  .calledWithExactly(401, 'detail', this.req, this.res);

                expect(this.emit).to.be.calledOnce
                  .calledWithExactly('error_log', err);

              });

          });

        });

        describe('an uncaught exception listener', function () {

          it('should handle an error in the strategy, emitting to uncaughtException listener after resolved promise', function (done) {

            obj.on('uncaughtException', (req, res, err) => {

              try {

                expect(req).to.be.equal(this.req);
                expect(res).to.be.equal(this.res);
                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.equal('output');

                done();

              } catch (error) {
                done(error);
              }

            });

            const err = new Error('output');

            this.stub.rejects(err);

            this.req.id = 'hello';

            obj.outputHandler(this.req, this.res, () => 'result')
              .then((result) => {

                try {

                  expect(result).to.be.undefined;

                  expect(this.log).to.be.calledTwice
                    .calledWithExactly('fatal', 'Uncaught exception', {
                      err,
                      id: 'hello',
                    });

                  expect(this.stub).to.be.calledOnce
                    .calledWithExactly(200, 'result', this.req, this.res);

                  expect(this.emit).to.be.calledOnce
                    .calledWithExactly('uncaughtException', this.req, this.res, err);

                } catch (err2) {
                  done(err2);
                }

              });

          });

          it('should handle an error in the function, emitting to uncaughtException listener', function (done) {

            obj.on('uncaughtException', (req, res, err) => {

              expect(req).to.be.equal(this.req);
              expect(res).to.be.equal(this.res);
              expect(err).to.be.instanceof(Error);
              expect(err.message).to.be.equal('output');

              done();
            });

            obj.outputHandler(this.req, this.res, () => {
              throw new Error('output');
            })
              .then((result) => {

                expect(result).to.be.undefined;

                expect(this.stub).to.not.be.called;

                expect(this.emit).to.be.calledOnce
                  .calledWithExactly('uncaughtException', this.req, this.res, new Error('output'));

              });

          });

        });

      });

    });

    describe('#start', function () {

      it('should start a server with just the port', function () {

        class Strategy extends EventEmitter {
          acceptParser () { }
          after () { }
          before () { }
          bodyParser () { }
          close () { }
          enableCORS () { }
          getRawServer () {}
          gzipResponse () { }
          queryParser () { }
          uncaughtException () { }
          use () { }
          addRoute () { }
          getServer () { return {}; }
          outputHandler () { }
          start (port, hostname, backlog) {
            return new Promise(function (resolve) {
              return resolve({
                port,
                hostname,
                backlog,
              });
            });
          }

        }

        const obj = new Server({
          port: 3200,
        }, new Strategy());

        return obj.start()
          .then((result) => {

            expect(result).to.be.eql({
              port: 3200,
              backlog: undefined,
              hostname: undefined,
            });

            return result;

          });

      });

      it('should start a server, returning an ES6 promise', function () {

        class Strategy extends EventEmitter {
          acceptParser () { }
          after () { }
          before () { }
          bodyParser () { }
          close () { }
          enableCORS () { }
          getRawServer () { }
          gzipResponse () { }
          queryParser () { }
          uncaughtException () { }
          use () { }
          addRoute () { }
          getServer () { return {}; }
          outputHandler () { }
          start (port, hostname, backlog) {
            return new Promise(function (resolve) {
              return resolve({
                port,
                hostname,
                backlog,
              });
            });
          }

        }

        const obj = new Server({
          port: 8080,
          backlog: 1000,
          hostname: '192.168.0.100',
        }, new Strategy());

        return obj.start()
          .then((result) => {

            expect(result).to.be.eql({
              port: 8080,
              backlog: 1000,
              hostname: '192.168.0.100',
            });

            return result;

          });

      });

      it('should start a server, returning a Bluebird promise', function (done) {

        class Strategy extends EventEmitter {
          acceptParser () { }
          after () { }
          before () { }
          bodyParser () { }
          close () { }
          enableCORS () { }
          getRawServer () {}
          gzipResponse () { }
          queryParser () { }
          uncaughtException () { }
          use () { }
          addRoute () { }
          getServer () { return {}; }
          outputHandler () { }
          start (port, hostname, backlog) {
            return Bluebird.try(() => ({
              bPort: port,
              bHostname: hostname,
              bBacklog: backlog,
            }));
          }

        }

        const obj = new Server({
          port: 9999,
          backlog: 4200,
          hostname: '193.168.0.100',
        }, new Strategy());

        obj.start()
          .then((result) => {

            expect(result).to.be.eql({
              bPort: 9999,
              bBacklog: 4200,
              bHostname: '193.168.0.100',
            });


            return result;

          })
          .finally(done);

      });

    });

    describe('#uncaughtException', function () {

      let obj;

      beforeEach(function () {

        this.spy = sinon.spy(this.serverStrategy, 'uncaughtException');

        obj = new Server({
          port: 8080,
        }, this.serverStrategy);

        this.onSpy = sinon.spy(obj, 'on');

      });

      it('should send through to the uncaughtException method', function () {

        const fn = function () { };

        expect(obj.uncaughtException(fn)).to.be.equal(obj);

        expect(this.onSpy).to.be.calledOnce
          .calledWithExactly('uncaughtException', fn);

        expect(this.spy).to.be.calledOnce
          .calledWithExactly(fn);

      });

      it('should throw an error if a non-function received', function () {

        let fail = false;

        try {
          obj.uncaughtException(null);
        } catch (err) {

          fail = true;

          expect(err).to.be.instanceof(TypeError);
          expect(err.message).to.be.equal('Server.uncaughtException must receive a function');

        } finally {

          expect(fail).to.be.true;

          expect(this.spy).to.not.be.called;

        }

      });

    });

    describe('#use', function () {

      let obj;

      beforeEach(function () {

        this.spy = sinon.spy(this.serverStrategy, 'use');

        obj = new Server({
          port: 8080,
        }, this.serverStrategy);

      });

      it('should do one function', function () {

        const fn = function () { };

        expect(obj.use(fn)).to.be.equal(obj);

        expect(this.spy).to.be.calledTwice
          .calledWithExactly(fn);

      });

      it('should do many args', function () {

        const fn = function () { };

        expect(obj.use(fn, 2, 3, 'hello')).to.be.equal(obj);

        expect(this.spy).to.be.calledTwice
          .calledWithExactly(fn, 2, 3, 'hello');

      });

      it('should do an array of functions', function () {

        const fn1 = function () { };
        const fn2 = function () { };

        expect(obj.use([fn1, fn2])).to.be.equal(obj);

        expect(this.spy).to.be.calledTwice
          .calledWithExactly([
            fn1,
            fn2,
          ]);

      });

    });

  });

  describe('Static method', function () {

    describe('#allowableHTTPMethods', function () {

      it('should returns all the allowable HTTP methods', function () {

        expect(Server.allowableHTTPMethods).to.be.eql([
          'GET',
          'POST',
          'PUT',
          'DELETE',
          'HEAD',
          'OPTIONS',
          'PATCH',
        ]);

      });

    });

    describe('#clientIp', function () {

      it('should return clientip', function () {
        expect(Server.clientIp).to.be.equal('clientIp');
      });

    });

  });

});
