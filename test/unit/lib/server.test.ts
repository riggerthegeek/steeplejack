/**
 * server.test
 */

/// <reference path="../../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
let Bluebird = require("bluebird");
import {Promise} from "es6-promise";


/* Files */
import {Server} from "../../../lib/server";
import {Base} from "../../../lib/base";
import {expect, sinon} from "../../helpers/configure";


describe("Server tests", function () {

    beforeEach(function () {
        class Strategy implements IServerStrategy {
            addRoute (httpMethod: string, route: string, fn: Function) {}

            start () {
                return new Promise(function (resolve: any) {
                    resolve();
                });
            }
        }

        this.DefaultStrategy = Strategy;
        this.serverStrategy = new Strategy();
    });

    describe("Methods", function () {

        describe("#constructor", function () {

            it("should receive options and a strategy object", function () {

                let obj = new Server({
                    port: 8080,
                    backlog: 1000,
                    hostname: "192.168.0.100"
                }, new this.DefaultStrategy());

                expect(obj).to.be.instanceof(Server)
                    .instanceof(Base);

            });

            it("should throw an error if it doesn't receive a strategy object", function () {

                let fail = false;

                try {
                    new Server(null, null);
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Server strategy object is required");
                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

        describe("#addRoute", function () {

            let obj: Server;

            beforeEach(function () {

                this.spy = sinon.spy(this.serverStrategy, "addRoute");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should throw an error if httpMethod not a string", function () {

                var fail = false;

                try {
                    obj.addRoute(null, null, null);
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("httpMethod must be a string");

                } finally {

                    expect(fail).to.be.true;

                }

            });

            it("should throw an error if route not a string", function () {

                var fail = false;

                try {
                    obj.addRoute("get", null, null);
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("route must be a string");

                } finally {

                    expect(fail).to.be.true;

                }

            });

            it("should throw an error if fn not a function or array", function () {

                [
                    null
                ].forEach(function (fn) {

                    var fail = false;

                    try {
                        obj.addRoute("get", "/route", fn);
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("fn must be a function or array");

                    } finally {

                        expect(fail).to.be.true;

                    }

                });

            });

            it("should allow a known HTTP method through", function () {

                [
                    "get",
                    "GET",
                    "post",
                    "POST",
                    "DEL",
                    "del",
                    "DELETE",
                    "delete",
                    "head",
                    "HEAD",
                    "patch",
                    "PATCH",
                    "opts",
                    "OPTS",
                    "options",
                    "OPTIONS"
                ].forEach((method, i) => {

                    var fn = function () {};

                    expect(obj.addRoute(method, "/route", fn)).to.be.equal(obj);

                    var httpMethod = method.toUpperCase();

                    /* Check delete and options have been shortened */
                    if (httpMethod === "DEL") {
                        httpMethod = "DELETE";
                    } else if (httpMethod === "OPTS") {
                        httpMethod = "OPTIONS";
                    }

                    expect(this.spy).to.be.callCount(++i)
                        .calledWithExactly(httpMethod, "/route", fn);

                });

            });

            it("should allow a known HTTP method through - array passed in", function () {

                [
                    "get",
                    "GET",
                    "post",
                    "POST",
                    "DEL",
                    "del",
                    "DELETE",
                    "delete",
                    "head",
                    "HEAD",
                    "patch",
                    "PATCH",
                    "opts",
                    "OPTS",
                    "options",
                    "OPTIONS"
                ].forEach((method, i) => {

                    var fn = [
                        function () {}
                    ];

                    expect(obj.addRoute(method, "/route", fn)).to.be.equal(obj);

                    var httpMethod = method.toUpperCase();

                    /* Check delete and options have been shortened */
                    if (httpMethod === "DEL") {
                        httpMethod = "DELETE";
                    } else if (httpMethod === "OPTS") {
                        httpMethod = "OPTIONS";
                    }

                    expect(this.spy).to.be.callCount(++i)
                        .calledWithExactly(httpMethod, "/route", fn);

                });

            });

            it("should add 'all' to each known method", function () {

                var fn = function () {};

                expect(obj.addRoute("all", "/route", fn)).to.be.equal(obj);

                expect(this.spy).to.be.callCount(7)
                    .calledWithExactly("GET", "/route", fn)
                    .calledWithExactly("POST", "/route", fn)
                    .calledWithExactly("PUT", "/route", fn)
                    .calledWithExactly("DELETE", "/route", fn)
                    .calledWithExactly("HEAD", "/route", fn)
                    .calledWithExactly("PATCH", "/route", fn)
                    .calledWithExactly("OPTIONS", "/route", fn);

            });

            it("should throw an error if an unknown HTTP method", function () {

                var fail = false;

                try {
                    obj.addRoute("method", "/route", function () { });
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("HTTP method is unknown: METHOD");
                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

        describe("#start", function () {

            it("should start a server with just the port", function () {

                class Strategy implements IServerStrategy {
                    addRoute (httpMethod: string, route: string, fn: Function) {}
                    start (port: number, hostname: string, backlog: number) {
                        return new Promise(function (resolve: any) {
                            return resolve({
                                port,
                                hostname,
                                backlog
                            });
                        });
                    }

                }

                let obj = new Server({
                    port: 3200
                }, new Strategy());

                return obj.start()
                    .then((result: Object) => {

                        expect(result).to.be.eql({
                            port: 3200,
                            backlog: void 0,
                            hostname: void 0
                        });

                        return result;

                    });

            });

            it("should start a server, returning an ES6 promise", function () {

                class Strategy implements IServerStrategy {
                    addRoute (httpMethod: string, route: string, fn: Function) {}
                    start (port: number, hostname: string, backlog: number) {
                        return new Promise(function (resolve: any) {
                            return resolve({
                                port,
                                hostname,
                                backlog
                            });
                        });
                    }

                }

                let obj = new Server({
                    port: 8080,
                    backlog: 1000,
                    hostname: "192.168.0.100"
                }, new Strategy());

                return obj.start()
                    .then((result: Object) => {

                        expect(result).to.be.eql({
                            port: 8080,
                            backlog: 1000,
                            hostname: "192.168.0.100"
                        });

                        return result;

                    });

            });

            it("should start a server, returning a Bluebird promise", function () {

                class Strategy implements IServerStrategy {
                    addRoute (httpMethod: string, route: string, fn: Function) {}
                    start (port: number, hostname: string, backlog: number) {
                        return Bluebird.try(() => {
                            return {
                                bPort: port,
                                bHostname: hostname,
                                bBacklog: backlog
                            };
                        });
                    }

                }

                let obj = new Server({
                    port: 9999,
                    backlog: 4200,
                    hostname: "193.168.0.100"
                }, new Strategy());

                return obj.start()
                    .then((result: Object) => {

                        expect(result).to.be.eql({
                            bPort: 9999,
                            bBacklog: 4200,
                            bHostname: "193.168.0.100"
                        });


                        return result;

                    });

            });

        });

    });

});
