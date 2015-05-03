/**
 * Routing
 */

"use strict";


/* Node modules */


/* Third-party modules */


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
