/**
 * Routing
 */

"use strict";


/* Node modules */
var path = require("path");


/* Third-party modules */
var proxyquire = require("proxyquire");


/* Files */
var Main = rootRequire();
var Base = Main.Base;
var datatypes = Main.datatypes;
var Injector = Main.Injector;
var Router = Main.Router;

var fn = function () {};


describe("Routing test", function () {

    describe("Instantiation tests", function () {

        it("should create an instance with no routes", function (done) {

            var obj = Router.create();

            expect(obj).to.be.instanceof(Router);
            expect(obj.getRoutes()).to.be.eql({});

            done();

        });

        it("should create an instance with some routes", function (done) {

            var obj = Router.create({
                "/": {
                    get: fn
                },
                test: {
                    get: fn,
                    post: fn
                }
            });

            expect(obj).to.be.instanceof(Router);
            expect(obj.getRoutes()).to.be.eql({
                "/": {
                    get: fn
                },
                "/test": {
                    get: fn,
                    post: fn
                }
            });

            done();

        });

    });

    describe("Methods", function () {

        describe("#setRoute", function () {

            var obj;
            beforeEach(function () {
                obj = Router.create();
            });

            it("should add in a single route", function (done) {

                obj.setRoute({
                    "/path": {
                        get: fn
                    }
                });

                expect(obj.getRoutes()).to.be.eql({
                    "/path": {
                        get: fn
                    }
                });

                done();

            });

            it("should add in a series of single routes", function (done) {

                obj.setRoute({
                    "/path": {
                        get: fn
                    }
                });

                expect(obj.getRoutes()).to.be.eql({
                    "/path": {
                        get: fn
                    }
                });

                obj.setRoute({
                    "/path": {
                        post: fn
                    }
                });

                expect(obj.getRoutes()).to.be.eql({
                    "/path": {
                        get: fn,
                        post: fn
                    }
                });

                done();

            });

            it("should add paths with inconsistent slashes", function (done) {

                obj.setRoute({
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

                expect(obj.getRoutes()).to.be.eql({
                    "/path/innerPath/finalPath": {
                        get: fn
                    },
                    "/otherPath/innerPath": {
                        post: fn
                    }
                });

                done();

            });

            it("should add paths that doesn't have nested paths", function (done) {

                obj.setRoute({
                    "path/innerPath": {
                        get: fn
                    },
                    "path/otherPath": {
                        get: fn
                    }
                });

                expect(obj.getRoutes()).to.be.eql({
                    "/path/innerPath": {
                        get: fn
                    },
                    "/path/otherPath": {
                        get: fn
                    }
                });

                done();

            });

            it("should receive a non-alphanumeric - Express variable handling", function (done) {

                obj.setRoute({
                    "path/innerPath/:id": {
                        get: fn
                    },
                    "path/otherPath": {
                        get: fn
                    }
                });

                expect(obj.getRoutes()).to.be.eql({
                    "/path/innerPath/:id": {
                        get: fn
                    },
                    "/path/otherPath": {
                        get: fn
                    }
                });

                done();

            });

            describe("Error handling", function () {

                it("should throw an error when trying to overwrite a route", function (done) {

                    obj.setRoute({
                        path: {
                            get: fn
                        }
                    });

                    var fail = false;

                    try {
                        obj.setRoute({
                            path: {
                                get: fn
                            }
                        });
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(SyntaxError);
                        expect(err.route).to.be.equal("/path");
                        expect(err.key).to.be.equal("get");
                    }

                    expect(fail).to.be.true;

                    done();

                });

            });

        });

    });

    describe("Static methods", function () {

        describe("#discoverRoutes", function () {

            beforeEach(function () {

                proxyquire.noCallThru();

                this.router = proxyquire("../../../../src/library/Router", {
                    "/path/to/dir/dir/endpoint": "/path/to/dir/dir/endpoint",
                    "/path/to/dir/dir/endpoint2": "/path/to/dir/dir/index",
                    "/path/to/dir/endpoint": "/path/to/dir/endpoint",
                    "/path/to/dir/dir": "/path/to/dir/endpoint"
                });
            });

            it("should discover an array of routes and return back the object", function () {

                var stub = sinon.stub(this.router, "getRouteFiles");

                stub.returns([{
                    name: "dir/endpoint",
                    parent: "/path/to/dir"
                }, {
                    name: "dir/endpoint2/index",
                    parent: "/path/to/dir"
                }, {
                    name: "endpoint/index",
                    parent: "/path/to/dir"
                }, {
                    name: "dir",
                    parent: "/path/to/dir"
                }]);

                var obj = this.router.discoverRoutes("/path/to/dir");

                expect(stub).to.be.calledOnce
                    .calledWith("/path/to/dir");

                expect(obj).to.be.eql({
                    "dir/endpoint": '/path/to/dir/dir/endpoint',
                    "dir/endpoint2": '/path/to/dir/dir/index',
                    endpoint: '/path/to/dir/endpoint',
                    dir: '/path/to/dir/endpoint'
                });

                stub.restore();

            });

            it("should ignore an invalid route file", function () {

                var stub = sinon.stub(this.router, "getRouteFiles");

                stub.returns([{
                    name: "",
                    parent: "/path/to/dir"
                }]);

                var obj = this.router.discoverRoutes("/path/to/dir");

                expect(stub).to.be.calledOnce
                    .calledWith("/path/to/dir");

                expect(obj).to.be.eql({});

                stub.restore();

            });

        });

        describe("#getRouteFiles", function () {

            it("should throw an error if empty parent sent in", function () {

                var fail = false;

                try {
                    Router.getRouteFiles();
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("parent is a required argument");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should discover the route files", function () {

                var routes = Router.getRouteFiles(path.join(process.cwd(), "/test/routes"));

                expect(routes).to.be.eql([{
                    name: "endpoint.js",
                    parent: "/Users/SimonEmms/Documents/Development/SlashDevSlashNull/steeplejack/test/routes"
                }, {
                    name: "route.js",
                    parent: "/Users/SimonEmms/Documents/Development/SlashDevSlashNull/steeplejack/test/routes"
                }, {
                    name: "index.js",
                    parent: "/Users/SimonEmms/Documents/Development/SlashDevSlashNull/steeplejack/test/routes"
                }]);

            });

        });

    });

});
