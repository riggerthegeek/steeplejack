/**
 * routes.test
 */

/* Node modules */
import path from "path";

/* Third-party modules */
import {_} from "lodash";
import {Base} from '@steeplejack/core';

/* Files */
import {expect, proxyquire} from "../../helpers/configure";
import Router from "../../../src/lib/router";

describe("Router test", function () {

  describe("Methods", function () {

    describe("#constructor", function () {

      it("should create an instance with no routes", function () {

        let obj = new Router();

        expect(obj).to.be.instanceof(Router)
          .instanceof(Base);

        expect(obj.routes).to.be.eql({});

      });

      it("should create an instance with some routes", function () {

        let fn = () => {
        };

        let obj = new Router({
          "/": {
            get: [fn]
          },
          test: {
            get: fn,
            post: fn
          }
        });

        expect(obj.routes).to.be.eql({
          "/": {
            get: [fn]
          },
          "/test": {
            get: fn,
            post: fn
          }
        });

      });

    });

    describe("#addRoute", function () {

      let obj,
        fn;
      beforeEach(function () {
        obj = new Router;
        fn = () => {};
      });

      it("should add in a single route", function () {

        obj.addRoute({
          "/path": {
            get: fn
          }
        });

        expect(obj.routes).to.be.eql({
          "/path": {
            get: fn
          }
        });

      });

      it("should add in a series of single routes", function () {

        obj.addRoute({
          "/path": {
            get: fn
          }
        });

        expect(obj.routes).to.be.eql({
          "/path": {
            get: fn
          }
        });

        obj.addRoute({
          "/path": {
            post: fn
          }
        });

        expect(obj.routes).to.be.eql({
          "/path": {
            get: fn,
            post: fn
          }
        });

      });

      it("should add paths with inconsistent slashes", function () {

        obj.addRoute({
          path: {
            "//innerPath": {
              "\\finalPath": {
                get: fn
              }
            }
          },
          otherPath: {
            innerPath: {
              post: fn
            }
          }
        });

        expect(obj.routes).to.be.eql({
          "/path/innerPath/finalPath": {
            get: fn
          },
          "/otherPath/innerPath": {
            post: fn
          }
        });

      });

      it("should add paths that doesn't have nested paths", function () {

        obj.addRoute({
          "path/innerPath": {
            get: fn
          },
          "path/otherPath": {
            get: fn
          }
        });

        expect(obj.routes).to.be.eql({
          "/path/innerPath": {
            get: fn
          },
          "/path/otherPath": {
            get: fn
          }
        });

      });

      it("should receive a non-alphanumeric - Express variable handling", function () {

        obj.addRoute({
          "path/innerPath/:id": {
            get: fn
          },
          "path/otherPath": {
            get: fn
          }
        });

        expect(obj.routes).to.be.eql({
          "/path/innerPath/:id": {
            get: fn
          },
          "/path/otherPath": {
            get: fn
          }
        });

      });

      it("should throw an error when trying to overwrite a route", function () {

        obj.addRoute({
          path: {
            get: fn
          }
        });

        var fail = false;

        try {
          obj.addRoute({
            path: {
              get: fn
            }
          });
        } catch (err) {
          fail = true;

          expect(err).to.be.instanceof(SyntaxError);
          expect(err.route).to.be.equal("/path");
          expect(err.key).to.be.equal("get");
        } finally {
          expect(fail).to.be.true;
        }

      });

    });

  });

  describe("Static methods", function () {

    describe("#discoverRoutes", function () {

      beforeEach(function () {

        let stubs = _.reduce({
          "/path/to/dir/v1-0/path/var/:id/endpoint": "/path/to/dir/v1-0/path/var/:id/endpoint",
          "/path/to/dir/v1-0/path/dir/endpoint": "/path/to/dir/v1-0/path/dir/endpoint",
          "/path/to/dir/v1_0/path/dir/endpoint": "/path/to/dir/v1_0/path/dir/endpoint",
          "/path/to/dir/v1.0/path/dir/endpoint": "/path/to/dir/v1.0/path/dir/endpoint",
          "/path/to/dir/dir/endpoint": "/path/to/dir/dir/endpoint",
          "/path/to/dir/dir/endpoint2/index": "/path/to/dir/dir/index",
          "/path/to/dir/dir/endpoint2/twitter": "/path/to/dir/dir/hello",
          "/path/to/dir/endpoint/index": "/path/to/dir/endpoint",
          "/path/to/dir/dir": "/path/to/dir/endpoint",
          "/path/to/dir/index": "/path/to/dir",
          "/path/to/dir/route/only": "/path/to/dir/route/only",
          "/path/to/dir/socket/only": "/path/to/dir/socket/only",
          "/no/route": "/path/to/dir",
          "/no/route/fn": "/path/to/dir",
          "/no/inject": "/path/to/dir"
        }, (result, value, key) => {

          if (key === '/no/inject') {
            result[key] = {
              route: () => {},
              socket: () => {}
            }
          } else if (key === "/no/route") {
            result[key] = {
              inject: value
            };
          } else if (key === "/no/route/fn") {
            result[key] = {
              inject: {
                route: value,
                socket: value
              }
            };
          } else if (key === "/path/to/dir/route/only") {
            result[key] = {
              default: () => value,
              inject: {
                route: {
                  export: 'default'
                }
              }
            };
          } else if (key === "/path/to/dir/socket/only") {
            result[key] = {
              socket: () => value,
              inject: {
                socket: {
                  export: 'socket'
                }
              }
            };
          } else {
            result[key] = {
              inject: {
                route: {
                  export: () => value
                },
                socket: {
                  export: () => value
                }
              }
            };
          }

          return result;

        }, {});

        this.router = proxyquire("../../src/lib/router", stubs);

      });

      it('should throw an error if no inject object', function () {

        let fail = false;

        try {
          this.router.discoverRoutes([{
            name: "inject",
            path: "/no"
          }]);
        } catch (err) {

          fail = true;

          expect(err).to.be.instanceof(SyntaxError);
          expect(err.message).to.be.equal("No inject exported from file: /no/inject");

        } finally {
          expect(fail).to.be.true;
        }

      });

      it("should throw an error if no route or socket element", function () {

        let fail = false;

        try {
          this.router.discoverRoutes([{
            name: "route",
            path: "/no"
          }]);
        } catch (err) {

          fail = true;

          expect(err).to.be.instanceof(SyntaxError);
          expect(err.message).to.be.equal("No route or socket exported from file: /no/route");

        } finally {
          expect(fail).to.be.true;
        }

      });

      it("should throw an error if no route or socket function", function () {

        let fail = false;

        try {
          this.router.discoverRoutes([{
            name: "route/fn",
            path: "/no"
          }]);
        } catch (err) {

          fail = true;

          expect(err).to.be.instanceof(SyntaxError);
          expect(err.message).to.be.equal("No route or socket exported from file: /no/route/fn");

        } finally {
          expect(fail).to.be.true;
        }

      });

      it("should discover an array of routes and return back the object", function () {

        let files = [{
          name: "route/only",
          path: "/path/to/dir"
        }, {
          name: "socket/only",
          path: "/path/to/dir"
        }, {
          name: "v1-0/path/var/:id/endpoint",
          path: "/path/to/dir"
        }, {
          name: "v1_0/path/dir/endpoint",
          path: "/path/to/dir"
        }, {
          name: "v1-0/path/dir/endpoint",
          path: "/path/to/dir"
        }, {
          name: "v1.0/path/dir/endpoint",
          path: "/path/to/dir"
        }, {
          name: "dir/endpoint",
          path: "/path/to/dir"
        }, {
          name: "dir/endpoint2/twitter",
          path: "/path/to/dir"
        }, {
          name: "dir/endpoint2/index",
          path: "/path/to/dir"
        }, {
          name: "endpoint/index",
          path: "/path/to/dir"
        }, {
          name: "dir",
          path: "/path/to/dir"
        }, {
          name: "index",
          path: "/path/to/dir"
        }];

        const obj = this.router.discoverRoutes(files);

        expect(obj).to.have.keys([
          "route/only",
          "socket/only",
          "v1_0/path/dir/endpoint",
          "v1-0/path/var/:id/endpoint",
          "v1-0/path/dir/endpoint",
          "v1.0/path/dir/endpoint",
          "dir/endpoint",
          "dir/endpoint2/twitter",
          "dir/endpoint2",
          "endpoint",
          "dir",
          ""
        ]);

        expect(obj["route/only"].route.factory()).to.be.equal("/path/to/dir/route/only");
        expect(obj["route/only"].socket).to.be.null;

        expect(obj["socket/only"].route).to.be.null;
        expect(obj["socket/only"].socket.factory()).to.be.equal("/path/to/dir/socket/only");

        expect(obj["v1_0/path/dir/endpoint"].route.factory()).to.be.equal("/path/to/dir/v1_0/path/dir/endpoint");
        expect(obj["v1_0/path/dir/endpoint"].socket.factory()).to.be.equal("/path/to/dir/v1_0/path/dir/endpoint");

        expect(obj["v1-0/path/var/:id/endpoint"].route.factory()).to.be.equal("/path/to/dir/v1-0/path/var/:id/endpoint");
        expect(obj["v1-0/path/var/:id/endpoint"].socket.factory()).to.be.equal("/path/to/dir/v1-0/path/var/:id/endpoint");

        expect(obj["v1-0/path/dir/endpoint"].route.factory()).to.be.equal("/path/to/dir/v1-0/path/dir/endpoint");
        expect(obj["v1-0/path/dir/endpoint"].socket.factory()).to.be.equal("/path/to/dir/v1-0/path/dir/endpoint");

        expect(obj["v1.0/path/dir/endpoint"].route.factory()).to.be.equal("/path/to/dir/v1.0/path/dir/endpoint");
        expect(obj["v1.0/path/dir/endpoint"].socket.factory()).to.be.equal("/path/to/dir/v1.0/path/dir/endpoint");

        expect(obj["dir/endpoint"].route.factory()).to.be.equal("/path/to/dir/dir/endpoint");
        expect(obj["dir/endpoint"].socket.factory()).to.be.equal("/path/to/dir/dir/endpoint");

        expect(obj["dir/endpoint2/twitter"].route.factory()).to.be.equal("/path/to/dir/dir/hello");
        expect(obj["dir/endpoint2/twitter"].socket.factory()).to.be.equal("/path/to/dir/dir/hello");

        expect(obj["dir/endpoint2"].route.factory()).to.be.equal("/path/to/dir/dir/index");
        expect(obj["dir/endpoint2"].socket.factory()).to.be.equal("/path/to/dir/dir/index");

        expect(obj["endpoint"].route.factory()).to.be.equal("/path/to/dir/endpoint");
        expect(obj["endpoint"].socket.factory()).to.be.equal("/path/to/dir/endpoint");

        expect(obj["dir"].route.factory()).to.be.equal("/path/to/dir/endpoint");
        expect(obj["dir"].socket.factory()).to.be.equal("/path/to/dir/endpoint");

        expect(obj[""].route.factory()).to.be.equal("/path/to/dir");
        expect(obj[""].socket.factory()).to.be.equal("/path/to/dir");

      });

      it("should ignore an invalid route file", function () {

          var obj = this.router.discoverRoutes([{
            name: "",
            parent: "/path/to/dir"
          }]);

          expect(obj).to.be.eql({});

        });

    });

    describe("#getFileList", function () {

      it("should get the routes with the defined glob - **/*.js", function () {

        let arr = Router.getFileList(process.cwd() + "/test/routes", "**/*.js");

        expect(arr).to.be.eql([{
          name: "child/route.js",
          path: path.join(process.cwd(), "/test/routes")
        }, {
          name: "child/index.js",
          path: path.join(process.cwd(), "/test/routes")
        }, {
          name: "endpoint.js",
          path: path.join(process.cwd(), "/test/routes")
        }, {
          name: "route.js",
          path: path.join(process.cwd(), "/test/routes")
        }, {
          name: "index.js",
          path: path.join(process.cwd(), "/test/routes")
        }]);

      });

      it("should get the routes with a defined glob - **/*.es6", function () {

        let arr = Router.getFileList(process.cwd() + "/test/routes", "**/*.es6");

        expect(arr).to.be.eql([{
          name: "child/route.es6",
          path: path.join(process.cwd(), "/test/routes")
        }, {
          name: "child/index.es6",
          path: path.join(process.cwd(), "/test/routes")
        }, {
          name: "endpoint.es6",
          path: path.join(process.cwd(), "/test/routes")
        }, {
          name: "route.es6",
          path: path.join(process.cwd(), "/test/routes")
        }, {
          name: "index.es6",
          path: path.join(process.cwd(), "/test/routes")
        }]);

      });

    });

    describe('#parseModule', function () {

      it('should set the factory if export is a function - no dependencies', function () {

        const route = () => {};

        expect(Router.parseModule('route', {
          inject: {
            route: {
              export: route,
            }
          }
        })).to.be.eql({
          factory: route,
          deps: [
          ]
        });

      });

      it('should set the factory if export is a function - some dependencies', function () {

        const route = () => {};

        expect(Router.parseModule('route', {
          inject: {
            route: {
              export: route,
              deps: [
                'dep1',
                'dep2'
              ]
            }
          }
        })).to.be.eql({
          factory: route,
          deps: [
            'dep1',
            'dep2'
          ]
        });

      });

      it('should set the factory if export is route has a function with that name - no dependencies', function () {

        const route = () => {};

        expect(Router.parseModule('route', {
          route,
          inject: {
            route: {
              export: 'route',
            }
          }
        })).to.be.eql({
          factory: route,
          deps: [
          ]
        });

      });

      it('should set the factory if export is route has a function with that name -  some dependencies', function () {

        const route = () => {};

        expect(Router.parseModule('route', {
          route,
          inject: {
            route: {
              export: 'route',
              deps: [
                'dep1',
                'dep2'
              ]
            }
          }
        })).to.be.eql({
          factory: route,
          deps: [
            'dep1',
            'dep2'
          ]
        });

      });

      it('should set the factory to null if nothing set', function () {

        expect(Router.parseModule('route', {
          inject: {
            route: {}
          }
        })).to.be.null;

      });

      it('should set the factory to null if export set wrongly', function () {

        expect(Router.parseModule('route', {
          inject: {
            route: {
              export: true
            }
          }
        })).to.be.null;

      });

    });

  });

});
