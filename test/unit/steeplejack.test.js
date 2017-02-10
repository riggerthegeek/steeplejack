/**
 * steeplejack.test
 */

/* Node modules */
import { EventEmitter } from 'events';
import path from 'path';

/* Third-party modules */
import { _ } from 'lodash';
import { Base } from '@steeplejack/core';
import Injector from '@steeplejack/injector';

/* Files */
import { expect, proxyquire, sinon } from '../helpers/configure';
import Steeplejack from '../../src/steeplejack';
import Logger from '../../src/lib/logger';
import Plugin from '../../src/lib/plugin';
import Server from '../../src/lib/server';


describe('Steeplejack test', function () {

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

      it('should assign a logger', function () {

        const spy = sinon.spy(this.Steeplejack.prototype, 'addModule');

        const logger = () => {};

        const logPlugin = new Plugin([{
          logger,
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
