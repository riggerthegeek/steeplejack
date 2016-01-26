/**
 * routes.test
 */

/// <reference path="../../../typings/tsd.d.ts" />

"use strict";


/* Node modules */
import * as path from "path";


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {expect, proxyquire} from "../../helpers/configure";
import {Router} from "../../../lib/router";


describe("Router test", function () {

    describe("Static methods", function () {

        describe("#discoverRoutes", function () {

            describe("fake files", function () {

                beforeEach(function () {

                    let stubs: any = _.reduce({
                        "/path/to/dir/dir/endpoint": "/path/to/dir/dir/endpoint",
                        "/path/to/dir/dir/endpoint2/index": "/path/to/dir/dir/index",
                        "/path/to/dir/dir/endpoint2/twitter": "/path/to/dir/dir/hello",
                        "/path/to/dir/endpoint/index": "/path/to/dir/endpoint",
                        "/path/to/dir/dir": "/path/to/dir/endpoint",
                        "/path/to/dir/index": "/path/to/dir",
                        "/no/route": "/path/to/dir",
                        "/no/route/fn": "/path/to/dir"
                    }, (result: any, value: string, key: string) => {

                        if (key === "/no/route") {
                            result[key] = value;
                        } else if (key === "/no/route/fn") {
                            result[key] = {
                                route: value
                            };
                        } else {
                            result[key] = {
                                route: () => {
                                    return value;
                                }
                            };
                        }

                        return result;

                    }, {});

                    this.router = proxyquire("../../lib/router", stubs).Router;

                });

                it("should throw an error if no route element", function () {

                    let fail = false;

                    try {
                        this.router.discoverRoutes([{
                            name: "route",
                            path: "/no"
                        }]);
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("A route file must have a function on exports.route");

                    } finally {
                        expect(fail).to.be.true;
                    }

                });

                it("should throw an error if no route function", function () {

                    let fail = false;

                    try {
                        this.router.discoverRoutes([{
                            name: "route/fn",
                            path: "/no"
                        }]);
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("A route file must have a function on exports.route");

                    } finally {
                        expect(fail).to.be.true;
                    }

                });

                it("should discover an array of routes and return back the object", function () {

                    let files = [{
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

                    var obj = this.router.discoverRoutes(files);

                    expect(obj).to.have.keys([
                        "dir/endpoint",
                        "dir/endpoint2/twitter",
                        "dir/endpoint2",
                        "endpoint",
                        "dir",
                        ""
                    ]);

                    expect(obj["dir/endpoint"]()).to.be.equal("/path/to/dir/dir/endpoint");
                    expect(obj["dir/endpoint2/twitter"]()).to.be.equal("/path/to/dir/dir/hello");
                    expect(obj["dir/endpoint2"]()).to.be.equal("/path/to/dir/dir/index");
                    expect(obj["endpoint"]()).to.be.equal("/path/to/dir/endpoint");
                    expect(obj["dir"]()).to.be.equal("/path/to/dir/endpoint");
                    expect(obj[""]()).to.be.equal("/path/to/dir");

                });

                it("should ignore an invalid route file", function () {

                    var obj = this.router.discoverRoutes([{
                        name: "",
                        parent: "/path/to/dir"
                    }]);

                    expect(obj).to.be.eql({});

                });

            });

            describe("real files", function () {

                beforeEach(function () {

                    this.routes = {
                        es6: {
                            childRoute: require(path.join(process.cwd(), "test/routes/child/route.es6")).route,
                            child: require(path.join(process.cwd(), "test/routes/child/index.es6")).route,
                            endpoint: require(path.join(process.cwd(), "test/routes/endpoint.es6")).route,
                            index: require(path.join(process.cwd(), "test/routes/index.es6")).route,
                            route: require(path.join(process.cwd(), "test/routes/route.es6")).route
                        },
                        js: {
                            childRoute: require(path.join(process.cwd(), "test/routes/child/route.js")).route,
                            child: require(path.join(process.cwd(), "test/routes/child/index.js")).route,
                            endpoint: require(path.join(process.cwd(), "test/routes/endpoint.js")).route,
                            index: require(path.join(process.cwd(), "test/routes/index.js")).route,
                            route: require(path.join(process.cwd(), "test/routes/route.js")).route
                        }
                    }

                });

                it("should get the routes with the default glob", function () {

                    let files = Router.getFileList(process.cwd() + "/test/routes");

                    let obj = Router.discoverRoutes(files);

                    expect(obj).to.be.eql({
                        "child/route": this.routes.js.childRoute,
                        child: this.routes.js.child,
                        endpoint: this.routes.js.endpoint,
                        route: this.routes.js.route,
                        "": this.routes.js.index
                    });

                });

                it("should get the routes with a defined glob - **/*.es6", function () {

                    let files = Router.getFileList(process.cwd() + "/test/routes", "**/*.es6");

                    let obj = Router.discoverRoutes(files);

                    expect(obj).to.be.eql({
                        "child/route": this.routes.es6.childRoute,
                        child: this.routes.es6.child,
                        endpoint: this.routes.es6.endpoint,
                        route: this.routes.es6.route,
                        "": this.routes.es6.index
                    });

                });

            });

        });

        describe("#getFileList", function () {

            it("should get the routes with the default glob - **/*.js", function () {

                let arr = Router.getFileList(process.cwd() + "/test/routes");

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

    });

});
