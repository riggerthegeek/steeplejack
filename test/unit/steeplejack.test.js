/**
 * steeplejack.test
 */

/* Node modules */
import { EventEmitter } from 'events';
import path from 'path';

/* Third-party modules */
import { _ } from 'lodash';
import { Base } from '@steeplejack/core';

/* Files */
import { expect, proxyquire, sinon } from '../helpers/configure';
import Steeplejack from '../../src/steeplejack';
import Plugin from '../../src/lib/plugin';
import Server from '../../src/lib/server';


describe('Steeplejack test', function () {

  describe('Methods', function () {

    describe('#constructor', function () {

      it('should add system components to the injector', function () {

        const registerSystemComponents = sinon.spy();

        const injectorInst = {
          registerComponent: sinon.stub(),
        };

        injectorInst.registerComponent.returns(injectorInst);

        const injector = sinon.stub()
          .returns(injectorInst);

        const SSteeplejack = proxyquire('../../src/steeplejack', {
          '@steeplejack/injector': injector,
          './helpers/registerSystemComponents': registerSystemComponents,
        });

        const app = new SSteeplejack({
          config: 'configObj',
        });

        expect(app).to.be.instanceof(SSteeplejack)
          .instanceof(Base);

        expect(injector).to.be.calledOnce
          .calledWithNew
          .calledWithExactly();

        expect(registerSystemComponents).to.be.calledOnce
          .calledWithExactly(app, injectorInst, 'configObj');

      });

    });

    describe('#addModule', function () {

      beforeEach(function () {

        this.glob = {
          sync: sinon.stub(),
        };

        this.Steeplejack = proxyquire('../../src/steeplejack', {
          glob: this.glob,
        });

        this.obj = new this.Steeplejack({});

      });

      it('should register a single string', function () {

        this.glob.sync.returns([
          '/path/to/module1',
          '/path/to/module2',
        ]);

        this.obj.addModule('module1');

        expect(this.obj.modules).to.be.eql([
          '/path/to/module1',
          '/path/to/module2',
        ]);

        expect(this.glob.sync).to.be.calledOnce
          .calledWith(path.join(process.cwd(), 'module1'));

      });

      it('should register many modules', function () {

        this.glob.sync.onCall(0).returns([
          '/path/to/module1',
          '/path/to/module1a',
        ]);

        this.glob.sync.onCall(1).returns([
          '/path/to/module2',
          '/path/to/module2a',
          '/path/to/module2b',
        ]);

        this.glob.sync.onCall(2).returns([
          '/path/to/module3',
        ]);

        this.glob.sync.onCall(3).returns([
          '/module4',
        ]);

        [
          'module1',
          'module2',
          'module3',
          '/module4', // absolute path
        ].forEach((module) => {
          expect(this.obj.addModule(module)).to.be.equal(this.obj);
        });

        expect(this.obj.modules).to.be.eql([
          '/path/to/module1',
          '/path/to/module1a',
          '/path/to/module2',
          '/path/to/module2a',
          '/path/to/module2b',
          '/path/to/module3',
          '/module4',
        ]);

        expect(this.glob.sync).to.be.callCount(4)
          .calledWith(path.join(process.cwd(), 'module1'))
          .calledWith(path.join(process.cwd(), 'module2'))
          .calledWith(path.join(process.cwd(), 'module3'))
          .calledWith(path.join('/module4'));

      });

      it('should throw an error if a non-string is passed in with the array', function () {

        let fail = false;

        try {
          this.obj.addModule(2);
        } catch (err) {

          fail = true;

          expect(err).to.be.instanceof(TypeError);
          expect(err.message).to.be
            .equal('Steeplejack.addModule can only accept a string or a Plugin instance');

        } finally {

          expect(fail).to.be.true;

          expect(this.glob.sync).to.not.be.called;

        }

      });

      it('should allow registration of a single Plugin', function () {

        const plugin = new Plugin();

        expect(this.obj.addModule(plugin)).to.be.equal(this.obj);

        expect(this.glob.sync).to.not.be.called;

      });

      it('should allow registration of mixed Plugins and files', function () {

        const plugin1 = new Plugin([
          'plugin1-1',
          'plugin1-2',
        ]);
        const plugin2 = new Plugin([
          'plugin2-1',
          'plugin2-2',
          'plugin2-3',
          {},
        ]);

        this.glob.sync.onCall(0).returns([
          '/path/to/module1',
          '/path/to/module1a',
        ]);

        this.glob.sync.onCall(1).returns([
          '/path/to/module2',
          '/path/to/module2a',
          '/path/to/module2b',
        ]);

        this.glob.sync.onCall(2).returns([
          '/path/to/module3',
        ]);

        [
          plugin1,
          'module1',
          'module2',
          plugin2,
          'module3',
        ].forEach((module) => {
          expect(this.obj.addModule(module)).to.be.equal(this.obj);
        });

        expect(this.obj.modules).to.be.eql([
          'plugin1-1',
          'plugin1-2',
          '/path/to/module1',
          '/path/to/module1a',
          '/path/to/module2',
          '/path/to/module2a',
          '/path/to/module2b',
          'plugin2-1',
          'plugin2-2',
          'plugin2-3',
          {},
          '/path/to/module3',
        ]);

        expect(this.glob.sync).to.be.calledThrice
          .calledWith(path.join(process.cwd(), 'module1'))
          .calledWith(path.join(process.cwd(), 'module2'))
          .calledWith(path.join(process.cwd(), 'module3'));

      });

    });

    describe('#createOutputHandler', function () {

      it('should register the method to the IoC container - result and default error logging', function () {

        const obj = new Steeplejack();

        class Strategy extends EventEmitter {
          outputHandler (statusCode, data, request, result) {
            return {
              statusCode,
              data,
              request,
              result,
            };
          }
        }

        const server = new Server({
          port: 3000,
        }, new Strategy());

        /* Set the log */
        server.logger = _.noop;

        const outputHandlerSpy = sinon.spy(server, 'outputHandler');

        const handler = obj.createOutputHandler(server);

        expect(handler).to.be.a('function');

        const req = {
          hello: 'req',
          startTime: new Date(),
        };
        const res = {
          hello: 'res',
        };

        const fn = () => 'result';

        /* Ensure it exits at finally */
        return handler(req, res, fn)
          .then((result) => {

            expect(result).to.be.eql({
              statusCode: 200,
              data: 'result',
              request: req,
              result: res,
            });

            expect(outputHandlerSpy).to.be.calledOnce
              .calledWithExactly(req, res, fn, undefined);

          });

      });

      it('should register the method to the IoC container - result and no error logging', function () {

        const obj = new Steeplejack();

        class Strategy extends EventEmitter {
          outputHandler (statusCode, data, request, result) {
            return {
              statusCode,
              data,
              request,
              result,
            };
          }
        }

        const server = new Server({
          port: 3000,
        }, new Strategy());

        server.logger = _.noop;

        const outputHandlerSpy = sinon.spy(server, 'outputHandler');

        const handler = obj.createOutputHandler(server);

        expect(handler).to.be.a('function');

        const req = { hello: 'req' };
        const res = { hello: 'res' };

        const fn = () => 'result';

        /* Ensure it exits at finally */
        return handler(req, res, fn, false)
          .then((result) => {

            expect(result).to.be.eql({
              statusCode: 200,
              data: 'result',
              request: req,
              result: res,
            });

            expect(outputHandlerSpy).to.be.calledOnce
              .calledWithExactly(req, res, fn, false);

          });

      });

      it('should register the method to the IoC container - err', function () {

        const obj = new Steeplejack();

        class Strategy extends EventEmitter {
          outputHandler (statusCode, data, request, result) {
            return Promise.reject({
              statusCode,
              data,
              request,
              result,
            });
          }
        }

        const server = new Server({
          port: 3000,
        }, new Strategy());

        server.logger = _.noop;

        const handler = obj.createOutputHandler(server);

        expect(handler).to.be.a('function');

        const req = { hello: 'req' };
        const res = { hello: 'res' };

        /* Ensure it exits at finally */
        return handler(req, res, () => {
          throw new Error('oh dear');
        }).then(() => {
          throw new Error('invalid');
        })
        .catch((err) => {

          expect(err).to.be.instanceof(Error);
          expect(err.message).to.be.equal('oh dear');

        });

      });

    });

    describe('#run', function () {

      beforeEach(function () {

        this.server = {
          addRoutes: sinon.stub(),
          addSockets: sinon.stub(),
          close: sinon.spy(),
          middleware: {
            afterUse: [],
            preSend: undefined,
          },
          on: sinon.stub(),
          start: sinon.stub(),
          use: sinon.spy(),
        };

        this.server.addRoutes.returns(this.server);
        this.server.addSockets.returns(this.server);
        this.server.on.returns(this.server);

      });

      it('should throw an error when no function received', function () {

        let fail = false;

        const obj = new Steeplejack();

        try {
          obj.run(null);
        } catch (err) {

          fail = true;

          expect(err).to.be.instanceof(TypeError);
          expect(err.message).to.be.equal('Steeplejack.run must receive a factory to create the server');

        } finally {
          expect(fail).to.be.true;
        }

      });

      it('should not create an outputHandler if already called', function () {

        const obj = new Steeplejack();

        const outputHandler = sinon.spy(obj, 'createOutputHandler');

        obj.injector = {
          getComponent: sinon.stub().returns(true),
          process: sinon.stub()
            .returns(this.server),
          registerComponent: sinon.stub(),
        };

        this.server.start.resolves();

        obj.run([], () => {

        });

        expect(outputHandler).to.not.be.called;

      });

      it('should listen for a start/close events', function () {

        const obj = new Steeplejack();

        obj.injector = {
          getComponent: sinon.stub().returns(),
          process: sinon.stub()
            .returns(this.server),
          registerComponent: sinon.stub(),
        };

        this.server.start.resolves();

        obj.run([], () => {

        });

        obj.on('start', (app) => {

          expect(app).to.be.equal(obj);

          obj.emit('close');

          expect(this.server.close).to.be.calledOnce
            .calledWithExactly();

        });

      });

      it('should register afterUse middleware', function () {

        const m1 = () => ['m1'];
        const m2 = () => ['m2'];

        this.server.middleware.afterUse = [
          m1,
          m2,
        ];

        const obj = new Steeplejack();

        obj.injector = {
          getComponent: sinon.stub().returns(),
          process: sinon.stub()
            .returns(this.server),
          registerComponent: sinon.stub(),
        };

        this.server.start.resolves();

        obj.run([], () => {

        });

        expect(this.server.use).to.be.calledTwice
          .calledWithExactly('m1')
          .calledWithExactly('m2');

      });

    });

  });

  describe('Static methods', function () {

    describe('#app', function () {

      beforeEach(function () {

        /* Set as no CLI arguments by default */
        this.yargs = {
          argv: {
            _: [],
          },
        };

        this.router = {
          discoverRoutes: sinon.stub(),
          getFileList: sinon.stub(),
        };

        this.Steeplejack = proxyquire('../../src/steeplejack', {
          yargs: this.yargs,
          './lib/router': this.router,
        });

      });

      it('should load up the app with no extras - no config', function () {

        const app = this.Steeplejack.app();

        expect(app).to.be.instanceof(this.Steeplejack)
          .instanceof(Base);

        expect(app.config).to.be.eql({});
        expect(app.modules).to.be.eql([]);
        expect(app.routing.routes).to.be.eql([]);
        expect(app.routing.sockets).to.be.eql([]);

      });

      it('should load up the app with no extras', function () {

        const app = Steeplejack.app();

        expect(app).to.be.instanceof(Steeplejack)
          .instanceof(Base);

        expect(app.modules).to.be.eql([]);
        expect(app.routing.routes).to.be.eql([]);
        expect(app.routing.sockets).to.be.eql([]);

      });

      it('should load up the app with no extras if empty object provided', function () {

        const app = this.Steeplejack.app({});

        expect(app).to.be.instanceof(this.Steeplejack)
          .instanceof(Base);

        expect(app.config).to.be.eql({});
        expect(app.modules).to.be.eql([]);
        expect(app.routing.routes).to.be.eql([]);
        expect(app.routing.sockets).to.be.eql([]);

      });

      it('should load up the app with no extras if empty object provided - no config', function () {

        const app = Steeplejack.app({});

        expect(app).to.be.instanceof(Steeplejack)
          .instanceof(Base);

        expect(app.modules).to.be.eql([]);
        expect(app.routing.routes).to.be.eql([]);
        expect(app.routing.sockets).to.be.eql([]);

      });

      it('should load in the config', function () {

        this.yargs.argv._ = [];

        const app = this.Steeplejack.app({
          config: {
            val1: true,
            val2: 'hello',
          },
        });

        expect(app).to.be.instanceof(this.Steeplejack);

        expect(app.config).to.be.eql({
          val1: true,
          val2: 'hello',
        });
        expect(app.modules).to.be.eql([]);
        expect(app.routing.routes).to.be.eql([]);
        expect(app.routing.sockets).to.be.eql([]);

      });

      it('should merge in environment variables to the config', function () {

        this.yargs.argv._ = [];

        process.env.VAL_1_ENVVAR = 'false';
        process.env.VAL_2_ENVVAR = 'goodbye';

        const app = this.Steeplejack.app({
          config: {
            val1: true,
            val2: 'hello',
          },
          env: {
            val1: 'VAL_1_ENVVAR',
            val2: 'VAL_2_ENVVAR',
          },
        });

        expect(app).to.be.instanceof(this.Steeplejack);

        expect(app.config).to.be.eql({
          val1: false,
          val2: 'goodbye',
        });
        expect(app.modules).to.be.eql([]);
        expect(app.routing.routes).to.be.eql([]);
        expect(app.routing.sockets).to.be.eql([]);

      });

      it('should merge in environment variables and command line arguments to the config', function () {

        this.yargs.argv._ = [
          'val2=erm?',
        ];

        process.env.VAL_1_ENVVAR = 'false';
        process.env.VAL_2_ENVVAR = 'goodbye';

        const app = this.Steeplejack.app({
          config: {
            val1: true,
            val2: 'hello',
          },
          env: {
            val1: 'VAL_1_ENVVAR',
            val2: 'VAL_2_ENVVAR',
          },
        });

        expect(app).to.be.instanceof(this.Steeplejack);

        expect(app.config).to.be.eql({
          val1: false,
          val2: 'erm?',
        });
        expect(app.modules).to.be.eql([]);
        expect(app.routing.routes).to.be.eql([]);
        expect(app.routing.sockets).to.be.eql([]);

      });

      it('should pass in modules', function () {

        const spy = sinon.spy(this.Steeplejack.prototype, 'addModule');

        const app = this.Steeplejack.app({
          modules: [
            'module1',
            'module2',
            'module3',
          ],
        });

        expect(app).to.be.instanceof(this.Steeplejack);

        expect(app.config).to.be.eql({});
        expect(app.routing.routes).to.be.eql([]);
        expect(app.routing.sockets).to.be.eql([]);

        expect(app.logger).to.be.equal(_.noop);

        expect(spy).to.be.calledThrice
          .calledWithExactly('module1')
          .calledWithExactly('module2')
          .calledWithExactly('module3');

      });

      it('should use console.log if logger is true', function () {

        const app = this.Steeplejack.app({
          logger: true,
          modules: [
            'module1',
            'module2',
            'module3',
          ],
        });

        expect(app).to.be.instanceof(this.Steeplejack);

        expect(app.config).to.be.eql({});
        expect(app.routing.routes).to.be.eql([]);
        expect(app.routing.sockets).to.be.eql([]);

        expect(app.logger).to.be.a('function')
          .be.equal(console.log);

      });

      it('should assign a logger', function () {

        const spy = sinon.spy(this.Steeplejack.prototype, 'addModule');

        const logger = {
          trigger: sinon.spy(),
        };

        const logPlugin = new Plugin([{
          logger: () => logger,
          inject: {
            export: 'logger',
            name: '$logger',
          },
        }]);

        const app = this.Steeplejack.app({
          logger: '$logger',
          modules: [
            'module1',
            'module2',
            'module3',
            logPlugin,
          ],
        });

        expect(app).to.be.instanceof(this.Steeplejack);

        expect(app.config).to.be.eql({});
        expect(app.routing.routes).to.be.eql([]);
        expect(app.routing.sockets).to.be.eql([]);

        expect(app.logger).to.be.a('function')
          .not.be.equal(_.noop);

        expect(spy).to.be.callCount(4)
          .calledWithExactly('module1')
          .calledWithExactly('module2')
          .calledWithExactly('module3')
          .calledWithExactly(logPlugin);

        app.logger('level', 'msg', 'data', 'arg1', 'arg2');

        expect(logger.trigger).to.be.calledOnce
          .calledWithExactly('level', 'msg', 'data', 'arg1', 'arg2');

      });

      it('should pass in the routes', function () {

        const routesObj = { hello: 'world' };

        this.router.getFileList.returns(routesObj);
        this.router.discoverRoutes.returns({
          foo: 'bar',
        });

        const app = this.Steeplejack.app({
          routesDir: 'test/route/dir',
        });

        expect(app).to.be.instanceof(this.Steeplejack);

        expect(app.config).to.be.eql({});
        expect(app.modules).to.be.eql([]);
        expect(app.routeFactories).to.be.eql({
          foo: 'bar',
        });

        expect(this.router.getFileList).to.be.calledOnce
          .calledWithExactly(path.join(process.cwd(), 'test/route/dir'), '**/*.js');

        expect(this.router.discoverRoutes).to.be.calledOnce
          .calledWithExactly(routesObj);

      });

      it('should pass in an absolute path', function () {

        const routesObj = { spam: 'eggs' };

        this.router.getFileList.returns(routesObj);
        this.router.discoverRoutes.returns({
          food: 'bard',
        });

        const app = this.Steeplejack.app({
          routesDir: '/test/route/dir',
          routesGlob: '**/*.es6',
        });

        expect(app).to.be.instanceof(this.Steeplejack);

        expect(app.config).to.be.eql({});
        expect(app.modules).to.be.eql([]);
        expect(app.routeFactories).to.be.eql({
          food: 'bard',
        });

        expect(this.router.getFileList).to.be.calledOnce
          .calledWithExactly('/test/route/dir', '**/*.es6');

        expect(this.router.discoverRoutes).to.be.calledOnce
          .calledWithExactly(routesObj);

      });

      it('should parse the routes/sockets into a list', function () {

        class Strategy extends EventEmitter {
          addRoute () { return Promise.resolve(); }
          outputHandler (err, data, request, result) {
            return {
              err,
              data,
              request,
              result,
            };
          }
        }

        class SocketStrategy extends EventEmitter {
          connect () {
            return this;
          }
          createSocket () { }
        }

        const fileList = [
          'myFileList',
        ];
        const routesObj = { hello: 'world' };

        this.router.getFileList.returns(fileList);
        this.router.discoverRoutes.returns(routesObj);

        const server = new Server({
          port: 3000,
        }, new Strategy(), new SocketStrategy());
        server.start = sinon.stub();

        server.start.resolves();

        const app = this.Steeplejack.app({
          routesDir: 'route/dir',
        });

        app.run([], () => server);

        expect(app).to.be.instanceof(this.Steeplejack);

        expect(app.routeFactories).to.be.eql(routesObj);

        const routes = [{
          method: 'GET',
          route: '/foo',
        }, {
          method: 'PUT',
          route: '/foo',
        }, {
          method: 'GET',
          route: '/foo/bar',
        }, {
          method: 'DELETE',
          route: '/foo/bar',
        }, {
          method: 'PUT',
          route: '/foo/bar/spam',
        }, {
          method: 'POST',
          route: '/hello/world',
        }];

        const sockets = [{
          socket: '/nsp',
          event: 'event1',
        }, {
          socket: '/nsp',
          event: 'event2',
        }, {
          socket: '/nsp/hello/world',
          event: 'event1',
        }];

        routes.forEach(({ method, route }) => server.emit('routeAdded', method, route));
        sockets.forEach(({ socket, event }) => server.emit('socketAdded', socket, event));

        expect(app.routing.routes).to.be.eql([
          'GET:/foo',
          'PUT:/foo',
          'GET:/foo/bar',
          'DELETE:/foo/bar',
          'PUT:/foo/bar/spam',
          'POST:/hello/world',
        ]);
        expect(app.routing.sockets).to.be.eql([
          '/nsp:event1',
          '/nsp:event2',
          '/nsp/hello/world:event1',
        ]);

        expect(this.router.getFileList).to.be.calledOnce
          .calledWithExactly(path.join(process.cwd(), 'route/dir'), '**/*.js');

        expect(this.router.discoverRoutes).to.be.calledOnce
          .calledWithExactly(fileList);

      });

    });

    describe('#outputHandlerName', function () {

      it('should return $output', function () {

        expect(Steeplejack.outputHandlerName).to.be.equal('$output');

      });

      it('should be a readonly property', function () {
        let fail = false;

        try {
          Steeplejack.outputHandlerName = 'value';
        } catch (err) {
          fail = true;

          expect(err).to.be.instanceof(Error);
          expect(err.message).contains('outputHandlerName');
        } finally {
          expect(fail).to.be.true;
        }
      });

    });

  });

});
