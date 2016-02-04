/**
 * server.test
 */

/// <reference path="../../../typings/main.d.ts" />

"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */
let Bluebird = require("bluebird");
import {Promise} from "es6-promise";


/* Files */
import {Server} from "../../../lib/server";
import {Base} from "../../../lib/base";
import {expect, sinon} from "../../helpers/configure";


describe("Server tests", function () {

    beforeEach(function () {
        class Strategy extends EventEmitter implements IServerStrategy {
            acceptParser (options: any, strict: boolean) { }

            addRoute (httpMethod: string, route: string, fn: Function) { }

            after (fn: Function) { }

            before (fn: Function) { }

            bodyParser () { }

            close () { }

            enableCORS (origins: string[] = ["*"], addHeaders: string[] = []) { }

            getServer () : Object {
                return {
                    method: function () {}
                }
            }

            gzipResponse () : void { }

            outputHandler (err: any, data: any, req: Object, res: Object) { }

            queryParser () : void { }

            start () : Promise<string> {
                return new Promise(function (resolve: any) {
                    resolve();
                });
            }

            uncaughtException (fn: Function) { }

            use (fn: Function | Function[]) { }
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

        describe("#acceptParser", function () {

            let obj: Server;

            beforeEach(function () {

                this.spy = sinon.spy(this.serverStrategy, "acceptParser");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should send to strategy acceptParser method", function () {

                expect(obj.acceptParser("options")).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly("options", false);

            });

            it("should send to strategy acceptParser method in strict mode", function () {

                expect(obj.acceptParser("options", true)).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly("options", true);

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

                    var httpMethod = method.toUpperCase();

                    /* Check delete and options have been shortened */
                    if (httpMethod === "DEL") {
                        httpMethod = "DELETE";
                    } else if (httpMethod === "OPTS") {
                        httpMethod = "OPTIONS";
                    }

                    let emitted = false;

                    obj.once("routeAdded", (emittedMethod: string, emittedRoute: string) => {
                        emitted = true;

                        expect(emittedMethod).to.be.equal(httpMethod);
                        expect(emittedRoute).to.be.equal("/route");
                    });

                    expect(obj.addRoute(method, "/route", fn)).to.be.equal(obj);

                    expect(emitted).to.be.true;

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

                    var httpMethod = method.toUpperCase();

                    /* Check delete and options have been shortened */
                    if (httpMethod === "DEL") {
                        httpMethod = "DELETE";
                    } else if (httpMethod === "OPTS") {
                        httpMethod = "OPTIONS";
                    }

                    let emitted = false;

                    obj.once("routeAdded", (emittedMethod: string, emittedRoute: string) => {
                        emitted = true;

                        expect(emittedMethod).to.be.equal(httpMethod);
                        expect(emittedRoute).to.be.equal("/route");
                    });

                    expect(obj.addRoute(method, "/route", fn)).to.be.equal(obj);

                    expect(emitted).to.be.true;

                    expect(this.spy).to.be.callCount(++i)
                        .calledWithExactly(httpMethod, "/route", fn);

                });

            });

            it("should add 'all' to each known method", function () {

                var fn = function () {};

                let methods = [
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                    "HEAD",
                    "PATCH",
                    "OPTIONS"
                ];

                let emitted: string[] = [];
                let count = 0;
                obj.on("routeAdded", (emittedMethod: string, emittedRoute: string) => {

                    emitted.push(emittedMethod);
                    expect(emittedRoute).to.be.equal("/route");
                    count++;

                });

                expect(obj.addRoute("all", "/route", fn)).to.be.equal(obj);

                expect(count).to.be.equal(methods.length);

                expect(emitted.sort()).to.be.eql(methods.sort()); /* We don't care about order, just values */

                expect(this.spy).to.be.callCount(methods.length);

                methods.forEach((method) => {
                    expect(this.spy).to.be.calledWithExactly(method, "/route", fn);
                });

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

        describe("#addRoutes", function () {

            let obj: Server;

            beforeEach(function () {

                this.spy = sinon.spy(this.serverStrategy, "addRoute");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should go through an objects of objects, passing to the strategy", function () {

                var fn1 = function () {};
                var fn2 = function () {};
                var fn3 = function () {};
                var fn4 = function () {};

                var arr = [fn3, fn4];

                var routes: IAddRoutes = {
                    "/test": {
                        get: fn1,
                        post: fn2
                    },
                    "/test/example": {
                        del: arr
                    }
                };

                let count = 0;
                let emitted: string[] = [];
                obj.on("routeAdded", (emittedMethod: string, emittedRoute: string) => {

                    emitted.push(emittedMethod);
                    if (emittedMethod === "DELETE") {
                        expect(emittedRoute).to.be.equal("/test/example");
                    } else {
                        expect(emittedRoute).to.be.equal("/test");
                    }
                    count++;

                });

                expect(obj.addRoutes(routes)).to.be.equal(obj);

                expect(count).to.be.equal(3);

                expect(this.spy).to.be.calledThrice
                    .calledWith("GET", "/test", fn1)
                    .calledWith("POST", "/test", fn2)
                    .calledWith("DELETE", "/test/example", arr);

            });

            it("should not parse an object of non-objects", function () {

                var routes: any = {
                    "/test1": function () {},
                    "/test2": [2],
                    "/test3": null,
                    "/test4": true,
                    "/test5": false,
                    "/test6": 2.3
                };

                let count = 0;
                obj.on("routeAdded", () => {
                    count++;
                });

                expect(obj.addRoutes(routes)).to.be.equal(obj);

                expect(count).to.be.equal(0);

                expect(this.spy).to.not.be.called;

            });

            it("should not pass a non-object", function () {

                var routes: any = [];

                obj.addRoutes(routes);

                expect(this.spy).to.not.be.called;

            });

        });

        describe("#after", function () {

            let obj: Server;

            beforeEach(function () {

                this.spy = sinon.spy(this.serverStrategy, "after");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should send through to the after method", function () {

                var fn = function () { };

                expect(obj.after(fn)).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWith(fn);

            });

            it("should throw an error if a non-function received", function () {

                var fail = false;

                try {
                    obj.after(null);
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("Server.after must receive a function");

                } finally {

                    expect(fail).to.be.true;

                    expect(this.spy).to.not.be.called;

                }

            });

        });

        describe("#before", function () {

            let obj: Server;

            beforeEach(function () {

                this.spy = sinon.spy(this.serverStrategy, "before");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should send through to the before method", function () {

                var fn = function () { };

                expect(obj.before(fn)).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWith(fn);

            });

            it("should throw an error if a non-function received", function () {

                var fail = false;

                try {
                    obj.before(null);
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("Server.before must receive a function");

                } finally {

                    expect(fail).to.be.true;

                    expect(this.spy).to.not.be.called;

                }

            });

        });

        describe("#bodyParser", function () {

            let obj: Server;

            beforeEach(function () {

                this.spy = sinon.spy(this.serverStrategy, "bodyParser");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should defer to the strategy method", function () {

                expect(obj.bodyParser()).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly();

            });

        });

        describe("#close", function () {

            let obj: Server;

            beforeEach(function () {

                this.spy = sinon.spy(this.serverStrategy, "close");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should defer to the strategy method", function () {

                expect(obj.close()).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly();

            });

        });

        describe("#enableCORS", function () {

            let obj: Server;

            beforeEach(function () {

                this.spy = sinon.spy(this.serverStrategy, "enableCORS");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should defer with the default params", function () {

                expect(obj.enableCORS()).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly(["*"], []);

            });

            it("should defer to the _enableClose method", function () {

                var origins = [
                    "http://example.com"
                ];
                var addHeaders = [
                    "auth"
                ];

                expect(obj.enableCORS(origins, addHeaders)).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly(origins, addHeaders);

            });

        });

        describe("#getServer", function () {

            let obj: Server;

            beforeEach(function () {

                this.stub = sinon.stub(this.serverStrategy, "getServer");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should get the server instance", function () {

                this.stub.returns("server");

                expect(obj.getServer()).to.be.equal("server");

                expect(this.stub).to.be.calledOnce
                    .calledWithExactly();

            });

        });

        describe("#gzipResponse", function () {

            let obj: Server;

            beforeEach(function () {

                this.spy = sinon.spy(this.serverStrategy, "gzipResponse");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should dispatch to the strategy", function () {

                expect(obj.gzipResponse()).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly();

            });

        });

        describe("#outputHandler", function () {

            let obj: Server;

            beforeEach(function () {

                this.stub = sinon.stub(this.serverStrategy, "outputHandler");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should dispatch to the strategy, resolving a promise", function (done: any) {

                let req = {req: true, hello: () => { }};
                let res = {res: true, hello: () => { }};

                this.stub.returns("output");

                return obj.outputHandler(req, res, () => {
                    return "result";
                })
                    .then((data: any) => {

                        expect(data).to.be.equal("output");

                        expect(this.stub).to.be.calledOnce
                            .calledWithExactly(null, "result", req, res);

                    })
                    .finally(done);

            });

            it("should dispatch to the strategy, intercepting a promise", function (done) {

                let req = {req: true, hello: () => { }};
                let res = {res: true, hello: () => { }};

                this.stub.returns("output");

                return obj.outputHandler(req, res, () => {
                    return new Promise((resolve) => {
                        resolve("result");
                    })
                        .then((output: any) => {

                            expect(output).to.be.equal("result");

                            expect(this.stub).to.not.be.called;

                            return output;

                        });
                })
                    .then((data: any) => {

                        expect(data).to.be.equal("output");

                        expect(this.stub).to.be.calledOnce
                            .calledWithExactly(null, "result", req, res);

                    })
                    .finally(done);

            });

            it("should dispatch to the strategy, rejecting a promise", function (done: any) {

                let req = {req: true, hello: () => { }};
                let res = {res: true, hello: () => { }};

                let error = new Error("oooops");

                this.stub.rejects(error);

                let listener = sinon.spy(obj, "emit");

                return obj.outputHandler(req, res, () => {
                    throw error;
                })
                    .then((...args: any[]) => {
                        throw new Error("invalid");
                    })
                    .catch((err: any) => {

                        expect(err).to.be.equal(error);

                        expect(listener).to.be.calledOnce
                            .calledWithExactly("error_log", error);

                        expect(this.stub).to.be.calledOnce
                            .calledWithExactly(error, null, req, res);

                    })
                    .finally(done);

            });

        });

        describe("#queryParser", function () {

            let obj: Server;

            beforeEach(function () {

                this.spy = sinon.spy(this.serverStrategy, "queryParser");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should dispatch to the strategy", function () {

                expect(obj.queryParser()).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly(false);

            });

            it("should dispatch to the strategy - set mapParams to true", function () {

                expect(obj.queryParser(true)).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly(true);

            });

        });

        describe("#start", function () {

            it("should start a server with just the port", function () {

                class Strategy extends EventEmitter implements IServerStrategy {
                    acceptParser (options: any, strict: boolean) { }
                    after (fn: Function) { }
                    before (fn: Function) { }
                    bodyParser () { }
                    close () { }
                    enableCORS (origins: string[] = ["*"], addHeaders: string[] = []) { }
                    gzipResponse () : void { }
                    queryParser () : void { }
                    uncaughtException (fn: Function) { }
                    use (fn: Function | Function[]) { }
                    addRoute (httpMethod: string, route: string, fn: Function) {}
                    getServer () : Object { return {}; }
                    outputHandler (err: any, data: any, req: Object, res: Object) { }
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

                class Strategy extends EventEmitter implements IServerStrategy {
                    acceptParser (options: any, strict: boolean) { }
                    after (fn: Function) { }
                    before (fn: Function) { }
                    bodyParser () { }
                    close () { }
                    enableCORS (origins: string[] = ["*"], addHeaders: string[] = []) { }
                    gzipResponse () : void { }
                    queryParser () : void { }
                    uncaughtException (fn: Function) { }
                    use (fn: Function | Function[]) { }
                    addRoute (httpMethod: string, route: string, fn: Function) {}
                    getServer () : Object { return {}; }
                    outputHandler (err: any, data: any, req: Object, res: Object) { }
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

            it("should start a server, returning a Bluebird promise", function (done: any) {

                class Strategy extends EventEmitter implements IServerStrategy {
                    acceptParser (options: any, strict: boolean) { }
                    after (fn: Function) { }
                    before (fn: Function) { }
                    bodyParser () { }
                    close () { }
                    enableCORS (origins: string[] = ["*"], addHeaders: string[] = []) { }
                    gzipResponse () : void { }
                    queryParser () : void { }
                    uncaughtException (fn: Function) { }
                    use (fn: Function | Function[]) { }
                    addRoute (httpMethod: string, route: string, fn: Function) {}
                    getServer () : Object { return {}; }
                    outputHandler (err: any, data: any, req: Object, res: Object) { }
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

                    })
                    .finally(done);

            });

        });

        describe("#uncaughtException", function () {

            let obj: Server;

            beforeEach(function () {

                this.spy = sinon.spy(this.serverStrategy, "uncaughtException");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should send through to the uncaughtException method", function () {

                var fn = function () { };

                expect(obj.uncaughtException(fn)).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWith(fn);

            });

            it("should throw an error if a non-function received", function () {

                var fail = false;

                try {
                    obj.uncaughtException(null);
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("Server.uncaughtException must receive a function");

                } finally {

                    expect(fail).to.be.true;

                    expect(this.spy).to.not.be.called;

                }

            });

        });

        describe("#use", function () {

            let obj: Server;

            beforeEach(function () {

                this.spy = sinon.spy(this.serverStrategy, "use");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should do one function", function () {

                var fn = function () { };

                expect(obj.use(fn)).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly(fn);

            });

            it("should do an array of functions", function () {

                var fn1 = function () { };
                var fn2 = function () { };

                expect(obj.use([fn1, fn2])).to.be.equal(obj);

                expect(this.spy).to.be.calledTwice
                    .calledWithExactly(fn1)
                    .calledWithExactly(fn2);

            });

            it("should throw an error when a non-function sent", function () {

                var fail = false;

                try {
                    obj.use(null);
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("Server.use must receive a function or array of functions");

                } finally {

                    expect(fail).to.be.true;

                    expect(this.spy).to.not.be.called;

                }

            });

        });

    });

});
