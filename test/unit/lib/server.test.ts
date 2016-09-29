/**
 * server.test
 */

/// <reference path="../../../typings/index.d.ts" />

"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */
let Bluebird = require("bluebird");
import {Promise} from "es6-promise";


/* Files */
import {Server} from "../../../lib/server";
import {Base} from "../../../lib/base";
import {IAddRoutes} from "../../../interfaces/addRoutes";
import {IServerStrategy} from "../../../interfaces/serverStrategy";
import {ISocketStrategy} from "../../../interfaces/socketStrategy";
import {ISocketRequest} from "../../../interfaces/socketRequest";
import {ISocketBroadcast} from "../../../interfaces/socketBroadcast";
import {expect, proxyquire, sinon} from "../../helpers/configure";


describe("Server tests", function () {

    beforeEach(function () {
        class Strategy extends EventEmitter implements IServerStrategy {
            acceptParser (options: any, strict: boolean) { }

            addRoute (httpMethod: string, route: string, iterator: (request: any, response: any) => Promise<any>) { }

            after (fn: Function) { }

            before (fn: Function) { }

            bodyParser () { }

            close () { }

            enableCORS (origins: string[] = ["*"], addHeaders: string[] = []) { }

            getRawServer: () => Object;

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

            staticDir () { }

            uncaughtException (fn: Function) { }

            use (fn: Function | Function[]) { }
        }

        class SocketStrategy extends EventEmitter implements ISocketStrategy {
            broadcast: (request: ISocketRequest, broadcast: ISocketBroadcast) => void;
            connect (namespace: string, middleware: Function[]) {
                return this;
            };

            createSocket (server: IServerStrategy) {

            }
            disconnect: (socket: any) => void;
            getSocketId: (socket: any) => string;
            joinChannel: (socket: any, channel: string) => void;
            leaveChannel: (socket: any, channel: string) => void;
            listen: (socket: any, event: string, fn: () => void) => void;
        }

        this.DefaultStrategy = Strategy;
        this.serverStrategy = new Strategy();

        this.DefaultSocketStrategy = SocketStrategy;
        this.socketStrategy = new SocketStrategy;
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

            it("should receive options, a strategy object and socket strategy", function () {

                let obj = new Server({
                    port: 8080,
                    backlog: 1000,
                    hostname: "192.168.0.100"
                }, new this.DefaultStrategy(), new this.DefaultSocketStrategy());

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

        describe("#_addRoute", function () {

            beforeEach(function () {

                this.spy = sinon.stub(this.serverStrategy, "addRoute");
                this.outputHandler = sinon.stub(this.serverStrategy, "outputHandler");

                this.obj = (<any> new Server({
                    port: 8080
                }, this.serverStrategy));

            });

            it("should execute a single function", function () {

                this.outputHandler.resolves("outputResult");

                let fns = [
                    (req: any, res: any) => {

                        expect(req).to.be.equal("req");
                        expect(res).to.be.equal("res");

                        return "result1";

                    }
                ];

                return this.obj._addRoute("req", "res", fns)
                    .then((result: any) => {

                        expect(result).to.be.equal("outputResult");

                        expect(this.outputHandler).to.be.calledOnce
                            .calledWithExactly(200, "result1", "req", "res");

                    });

            });

            it("should execute multiple functions in order", function () {

                this.outputHandler.resolves("outputResult");

                let order: number[] = [];

                let fns = [
                    (req: any, res: any) => {

                        expect(req).to.be.equal("req");
                        expect(res).to.be.equal("res");

                        return new Promise(resolve => {
                            setTimeout(() => {
                                order.push(0);
                                resolve("result1");
                            }, 200);
                        });

                    },
                    (req: any, res: any) => {

                        expect(req).to.be.equal("req");
                        expect(res).to.be.equal("res");

                        return new Promise(resolve => {
                            setTimeout(() => {
                                order.push(1);
                                resolve("result2");
                            }, 100);
                        });

                    },
                ];

                return this.obj._addRoute("req", "res", fns)
                    .then((result: any) => {

                        expect(result).to.be.equal("outputResult");

                        expect(order).to.be.eql([
                            0,
                            1
                        ]);

                        expect(this.outputHandler).to.be.calledOnce
                            .calledWithExactly(200, "result2", "req", "res");

                    });

            });

            it("should stop when executing multiple functions if a previous one fails - Error", function () {

                const spy = sinon.spy(console, "error");

                this.outputHandler.resolves("outputResult");

                let fail = false;

                let fns = [
                    (req: any, res: any) => {

                        expect(req).to.be.equal("req");
                        expect(res).to.be.equal("res");

                        throw new Error("some error");

                    },
                    () => {

                        /* Test that this isn't called */
                        fail = true;

                        return "result2";

                    },
                ];

                return this.obj._addRoute("req", "res", fns)
                    .then(() => {
                        throw new Error("invalid error");
                    })
                    .catch((err: any) => {

                        expect(err).to.be.instanceof(Error);
                        expect(err.message).to.be.equal("some error");

                        expect(spy).to.be.calledTwice
                            .calledWithExactly("--- UNCAUGHT EXCEPTION ---")
                            .calledWithExactly(err.stack);

                        expect(this.outputHandler).to.not.be.called;

                        expect(fail).to.be.false;

                        spy.restore();

                    });

            });

            it("should stop when executing multiple functions if a previous one fails - non-Error", function () {

                const spy = sinon.spy(console, "error");

                this.outputHandler.resolves("outputResult");

                let fail = false;

                let fns = [
                    (req: any, res: any) => {

                        expect(req).to.be.equal("req");
                        expect(res).to.be.equal("res");

                        throw "some error";

                    },
                    () => {

                        /* Test that this isn't called */
                        fail = true;

                        return "result2";

                    },
                ];

                return this.obj._addRoute("req", "res", fns)
                    .then(() => {
                        throw new Error("invalid error");
                    })
                    .catch((err: any) => {

                        expect(err).to.be.equal("some error");

                        expect(spy).to.be.calledTwice
                            .calledWithExactly("--- UNCAUGHT EXCEPTION ---")
                            .calledWithExactly(err);

                        expect(this.outputHandler).to.not.be.called;

                        expect(fail).to.be.false;

                        spy.restore();

                    });

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
                        .calledWith(httpMethod, "/route");

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
                        .calledWith(httpMethod, "/route");

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
                    expect(this.spy).to.be.calledWith(method, "/route");
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

                this.addRoute = sinon.stub(this.serverStrategy, "addRoute");
                this.strategyOutput = sinon.spy(this.serverStrategy, "outputHandler");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

                this.outputHandler = sinon.spy(obj, "outputHandler");

            });

            it("should go through an objects of objects, passing to the strategy", function (done: any) {

                var fn1 = function () {
                    return "fn1";
                };
                var fn2 = function () {
                    return "fn2";
                };
                var fn3 = function () {
                    return "fn3";
                };
                var fn4 = function () {
                    return "fn4";
                };

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

                let req = {
                    req: true
                };
                let res = {
                    res: true
                };

                this.addRoute.yields(req, res);

                expect(obj.addRoutes(routes)).to.be.equal(obj);

                expect(count).to.be.equal(3);

                expect(this.outputHandler).to.be.calledThrice
                    .calledWith(req, res);

                expect(this.addRoute).to.be.calledThrice
                    .calledWith("GET", "/test")
                    .calledWith("POST", "/test")
                    .calledWith("DELETE", "/test/example");

                setTimeout(() => {

                    expect(this.strategyOutput).to.be.calledThrice
                        .calledWithExactly(200, "fn1", req, res)
                        .calledWithExactly(200, "fn2", req, res)
                        .calledWithExactly(200, "fn4", req, res);

                    done();

                }, 10);

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

                expect(this.addRoute).to.not.be.called;

            });

            it("should not pass a non-object", function () {

                var routes: any = [];

                obj.addRoutes(routes);

                expect(this.addRoute).to.not.be.called;

            });

        });

        describe("#addSockets", function () {

            beforeEach(function () {

                this.listen = sinon.spy();

                this.socketStrategy = {
                    connect: (<any> sinon.stub()).resolves(),
                    createSocket: sinon.spy(),
                    listen: sinon.spy()
                };

                this.socketInst = {
                    namespace: sinon.stub()
                };

                this.socketInst.namespace.returns(this.socketInst);

                this.socket = sinon.stub().returns(this.socketInst);

                this.SServer = proxyquire("../../lib/server", {
                    "./socket": {
                        Socket: this.socket
                    }
                }).Server;

                this.sockets = {
                    socket1: {
                        event1: () => {},
                        event2: () => {}
                    },
                    socket2: {
                        event1: () => {}
                    }
                }

            });

            it("should not add any sockets if not socket strategy defined", function () {

                let obj = new this.SServer({
                    port: 8080,
                    backlog: 1000,
                    hostname: "192.168.0.100"
                }, new this.DefaultStrategy());

                expect(obj.addSockets(this.sockets)).to.be.equal(obj);

                expect(this.socketInst.namespace).to.not.be.called;

            });

            it("should add sockets if the socket strategy is defined", function () {

                let obj = new this.SServer({
                    port: 8080,
                    backlog: 1000,
                    hostname: "192.168.0.100"
                }, new this.DefaultStrategy(), this.socketStrategy);

                let ons: any[] = [];

                obj.on("socketAdded", (nsp: string, eventName: string) => {
                    ons.push({
                        nsp,
                        eventName
                    });
                });

                expect(obj.addSockets(this.sockets)).to.be.equal(obj);

                expect(this.socketInst.namespace).to.be.calledTwice
                    .calledWithExactly("socket1", this.sockets.socket1)
                    .calledWithExactly("socket2", this.sockets.socket2);

                expect(ons).to.have.length(3);

                expect(ons[0].nsp).to.be.equal("socket1");
                expect(ons[1].nsp).to.be.equal("socket1");
                expect(ons[2].nsp).to.be.equal("socket2");

                expect(ons[0].eventName).to.be.equal("event1");
                expect(ons[1].eventName).to.be.equal("event2");
                expect(ons[2].eventName).to.be.equal("event1");

            });

        });

        describe("#after", function () {

            let obj: Server;

            beforeEach(function () {

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

            });

            it("should send through to the after method", function () {

                var fn = function () { };
                var fn2 = function () { };
                var fn3 = function () { };

                expect(obj.afterUse).to.be.an("array")
                    .to.have.length(0);

                expect(obj.after(fn)).to.be.equal(obj);

                expect(obj.afterUse).to.be.an("array")
                    .to.have.length(1);

                expect(obj.afterUse[0]()).to.be.eql([
                    fn
                ]);

                expect(obj.after(fn2, fn3)).to.be.equal(obj);

                expect(obj.afterUse).to.be.an("array")
                    .to.have.length(2);

                expect(obj.afterUse[0]()).to.be.eql([
                    fn
                ]);
                expect(obj.afterUse[1]()).to.be.eql([
                    fn2,
                    fn3
                ]);

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

        describe("#outputHandler", function () {

            let obj: Server;

            beforeEach(function () {

                this.req = {req: true, hello: () => {}};
                this.res = {res: true, hello: () => {}};

                this.stub = sinon.stub(this.serverStrategy, "outputHandler");

                obj = new Server({
                    port: 8080
                }, this.serverStrategy);

                this.emit = sinon.spy(obj, "emit");

            });

            describe("successful response", function () {

                afterEach(function () {
                    expect(this.emit).to.not.be.called;
                });

                it("should dispatch to the strategy, resolving a promise", function () {

                    this.stub.returns("output");

                    return obj.outputHandler(this.req, this.res, () => {
                            return "result";
                        })
                        .then((data:any) => {

                            expect(data).to.be.equal("output");

                            expect(this.stub).to.be.calledOnce
                                .calledWithExactly(200, "result", this.req, this.res);

                        });

                });

                it("should return the status code and empty output", function () {

                    this.stub.returns("output");

                    return obj.outputHandler(this.req, this.res, () => {
                            return 201;
                        })
                        .then((data:any) => {

                            expect(data).to.be.equal("output");

                            expect(this.stub).to.be.calledOnce
                                .calledWithExactly(201, void 0, this.req, this.res);

                        });

                });

                it("should call the getData function", function () {

                    this.stub.returns("output");

                    return obj.outputHandler(this.req, this.res, () => {
                            return {
                                getData: () => {
                                    return "getDataOutput";
                                }
                            };
                        })
                        .then((data:any) => {

                            expect(data).to.be.equal("output");

                            expect(this.stub).to.be.calledOnce
                                .calledWithExactly(200, "getDataOutput", this.req, this.res);

                        });

                });

                it("return empty data and set the status code to 204", function () {

                    this.stub.returns("output");

                    return obj.outputHandler(this.req, this.res, () => {
                            return "";
                        })
                        .then((data: any) => {

                            expect(data).to.be.equal("output");

                            expect(this.stub).to.be.calledOnce
                                .calledWithExactly(204, void 0, this.req, this.res);

                        });

                });

                it("should return an empty object", function () {

                    this.stub.returns("output");

                    return obj.outputHandler(this.req, this.res, () => {
                        return {};
                    })
                        .then((data: any) => {

                            expect(data).to.be.equal("output");

                            expect(this.stub).to.be.calledOnce
                                .calledWithExactly(200, {}, this.req, this.res);

                        });

                });

                it("return undefined data and set the status code to 204", function () {

                    this.stub.returns("output");

                    return obj.outputHandler(this.req, this.res, () => {
                            return;
                        })
                        .then((data: any) => {

                            expect(data).to.be.equal("output");

                            expect(this.stub).to.be.calledOnce
                                .calledWithExactly(204, void 0, this.req, this.res);

                        });

                });

                it("return null data and set the status code to 204", function () {

                    this.stub.returns("output");

                    return obj.outputHandler(this.req, this.res, () => {
                            return null;
                        })
                        .then((data: any) => {

                            expect(data).to.be.equal("output");

                            expect(this.stub).to.be.calledOnce
                                .calledWithExactly(204, void 0, this.req, this.res);

                        });

                });

                it("return numeric data and not set the status code to 204", function () {

                    this.stub.returns("output");

                    return obj.outputHandler(this.req, this.res, () => {
                            return 2;
                        })
                        .then((data: any) => {

                            expect(data).to.be.equal("output");

                            expect(this.stub).to.be.calledOnce
                                .calledWithExactly(200, 2, this.req, this.res);

                        });

                });

                it("should send to the preSend function", function () {

                    let calledPreSend = false;

                    obj.preSend((statusCode: number, output: any, req: any, res: any) : any => {

                        calledPreSend = true;

                        expect(statusCode).to.be.equal(200);
                        expect(output).to.be.eql({
                            hello: "world"
                        });
                        expect(req).to.be.equal(this.req);
                        expect(res).to.be.equal(this.res);

                        return {
                            statusCode: 201,
                            output: "output"
                        };

                    });

                    this.stub.returns("some output");

                    return obj.outputHandler(this.req, this.res, () => {
                        return {
                            hello: "world"
                        };
                    }).then((data: any) => {

                        expect(data).to.be.equal("some output");

                        expect(calledPreSend).to.be.true;

                        expect(this.stub).to.be.calledOnce
                            .calledWithExactly(201, "output", this.req, this.res);

                    });

                });

            });

            describe("failed response", function () {

                describe("no uncaught exception listeners", function () {

                    it("should not call the preSend if it's an error response", function () {

                        let callPreSend = false;

                        obj.preSend((statusCode: number, output: any, req: any, res: any) : any => {
                            callPreSend = true;
                        });

                        return obj.outputHandler(this.req, this.res, () => {
                            return Promise.reject("rejected promise");
                        }).then(() => {
                            throw new Error("invalid");
                        })
                        .catch((err: Error) => {

                            expect(callPreSend).to.be.false;

                            expect(err).to.be.equal("rejected promise");

                        });

                    });

                    it("should handle an error in the strategy, emitting to uncaughtException listener after resolved promise", function () {

                        this.stub.rejects("output");

                        return obj.outputHandler(this.req, this.res, () => {
                            return "result";
                        })
                            .then(() => {
                                throw new Error("invalid");
                            })
                            .catch((err:Error) => {

                                expect(err).to.be.instanceof(Error)
                                expect(err.message).to.be.equal("output");

                                expect(this.stub).to.be.calledOnce
                                    .calledWithExactly(200, "result", this.req, this.res);

                                expect(this.emit).to.not.be.called;

                            });

                    });

                    it("should handle an error in the function, emitting to uncaughtException listener", function () {

                        const spy = sinon.spy(console, "error");

                        return obj.outputHandler(this.req, this.res, () => {
                            throw new Error("output");
                        })
                            .then(() => {
                                throw new Error("invalid");
                            })
                            .catch((err:Error) => {

                                expect(err).to.be.instanceof(Error);
                                expect(err.message).to.be.equal("output");

                                expect(this.stub).to.not.be.called;

                                expect(this.emit).to.not.be.called;

                                expect(spy).to.be.calledTwice
                                    .calledWithExactly("--- UNCAUGHT EXCEPTION ---")
                                    .calledWithExactly(err.stack);

                                spy.restore();

                            });

                    });

                    it("should handle a rejected promise in the function, emitting to uncaughtException listener", function () {

                        const spy = sinon.spy(console, "error");

                        return obj.outputHandler(this.req, this.res, () => {
                            return Promise.reject({
                                hello: "world"
                            })
                        })
                            .then(() => {
                                throw new Error("invalid");
                            })
                            .catch((err:Error) => {

                                expect(err).to.be.eql({
                                    hello: "world"
                                });

                                expect(this.stub).to.not.be.called;

                                expect(this.emit).to.not.be.called;

                                expect(spy).to.be.calledTwice
                                    .calledWithExactly("--- UNCAUGHT EXCEPTION ---")
                                    .calledWithExactly(err);

                                spy.restore();

                            });

                    });

                    it("should return the status code and empty output", function () {

                        this.stub.returns("output");

                        return obj.outputHandler(this.req, this.res, () => {
                            return Promise.reject(506);
                        })
                            .then((data:any) => {

                                expect(data).to.be.equal("output");

                                expect(this.stub).to.be.calledOnce
                                    .calledWithExactly(506, void 0, this.req, this.res);

                                expect(this.emit).to.be.calledOnce
                                    .calledWithExactly("error_log", 506);

                            });

                    });

                    it("should handle a validation error - no errors", function () {

                        this.stub.returns("output");

                        let err = {
                            type: "errcode",
                            message: "errmessage",
                            hasErrors: () => {
                                return false;
                            }
                        };

                        return obj.outputHandler(this.req, this.res, () => {
                            return Promise.reject(err);
                        })
                            .then((data:any) => {

                                expect(data).to.be.equal("output");

                                expect(this.stub).to.be.calledOnce
                                    .calledWithExactly(400, {
                                        code: "errcode",
                                        message: "errmessage"
                                    }, this.req, this.res);

                                expect(this.emit).to.be.calledOnce
                                    .calledWithExactly("error_log", err);

                            });

                    });

                    it("should handle a validation error - some errors", function () {

                        this.stub.returns("output");

                        let err = {
                            type: "errcode2",
                            message: "errmessage2",
                            getErrors: () => {
                                return "err list";
                            },
                            hasErrors: () => {
                                return true;
                            }
                        };

                        return obj.outputHandler(this.req, this.res, () => {
                            return Promise.reject(err);
                        })
                            .then((data:any) => {

                                expect(data).to.be.equal("output");

                                expect(this.stub).to.be.calledOnce
                                    .calledWithExactly(400, {
                                        code: "errcode2",
                                        message: "errmessage2",
                                        error: "err list"
                                    }, this.req, this.res);

                                expect(this.emit).to.be.calledOnce
                                    .calledWithExactly("error_log", err);

                            });

                    });

                    it("should handle an ordinary error and not emit it", function () {

                        let err = {
                            type: "errcode2",
                            message: "errmessage2",
                            getErrors: () => {
                                return "err list";
                            },
                            hasErrors: () => {
                                return true;
                            }
                        };

                        this.stub.resolves("output");

                        return obj.outputHandler(this.req, this.res, () => {
                            return Promise.reject(err);
                        }, false)
                            .then((data: any) => {

                                expect(data).to.be.equal("output");

                                expect(this.stub).to.be.calledOnce
                                    .calledWithExactly(400, {
                                        code: "errcode2",
                                        message: "errmessage2",
                                        error: "err list"
                                    }, this.req, this.res);

                                expect(this.emit).to.not.be.called;

                            });

                    });

                    it("should handle an ordinary error - getHttpCode and getDetail methods", function () {

                        this.stub.returns("output");

                        let err = new Error("uh-oh crap");
                        (<any> err).getHttpCode = () => {
                            return 401;
                        };
                        (<any> err).getDetail = () => {
                            return "detail";
                        };

                        return obj.outputHandler(this.req, this.res, () => {
                            return Promise.reject(err);
                        })
                            .then((data:any) => {

                                expect(data).to.be.equal("output");

                                expect(this.stub).to.be.calledOnce
                                    .calledWithExactly(401, "detail", this.req, this.res);

                                expect(this.emit).to.be.calledOnce
                                    .calledWithExactly("error_log", err);

                            });

                    });

                });

                describe("an uncaught exception listener", function () {

                    it("should handle an error in the strategy, emitting to uncaughtException listener after resolved promise", function (done: any) {

                        obj.on("uncaughtException", (req: any, res: any, err: Error) => {

                            try {

                                expect(req).to.be.equal(this.req);
                                expect(res).to.be.equal(this.res);
                                expect(err).to.be.eql(new Error("output"));

                                done();

                            } catch (err) {
                                done(err);
                            }

                        });

                        this.stub.rejects("output");

                        obj.outputHandler(this.req, this.res, () => {
                            return "result";
                        })
                            .then((result: any) => {

                                try {

                                    expect(result).to.be.undefined;

                                    expect(this.stub).to.be.calledOnce
                                        .calledWithExactly(200, "result", this.req, this.res);

                                    expect(this.emit).to.be.calledOnce
                                        .calledWithExactly("uncaughtException", this.req, this.res, new Error("output"));

                                } catch (err) {
                                    done(err);
                                }

                            });

                    });

                    it("should handle an error in the function, emitting to uncaughtException listener", function (done: any) {

                        obj.on("uncaughtException", (req: any, res: any, err: Error) => {

                            expect(req).to.be.equal(this.req);
                            expect(res).to.be.equal(this.res);
                            expect(err).to.be.eql(new Error("output"));

                            done()
                        });

                        const spy = sinon.spy(console, "error");

                        obj.outputHandler(this.req, this.res, () => {
                            throw new Error("output");
                        })
                            .then((result: any) => {

                                expect(result).to.be.undefined;

                                expect(this.stub).to.not.be.called;

                                expect(this.emit).to.be.calledOnce
                                    .calledWithExactly("uncaughtException", this.req, this.res, new Error("output"));

                                expect(spy).to.not.be.called;

                                spy.restore();

                            });

                    });

                });

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
                    getRawServer: () => Object;
                    gzipResponse () : void { }
                    queryParser () : void { }
                    uncaughtException (fn: Function) { }
                    use (fn: Function | Function[]) { }
                    addRoute (httpMethod: string, route: string, iterator: (request: any, response: any) => Promise<any>) { }
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
                    getRawServer: () => Object;
                    gzipResponse () : void { }
                    queryParser () : void { }
                    uncaughtException (fn: Function) { }
                    use (fn: Function | Function[]) { }
                    addRoute (httpMethod: string, route: string, iterator: (request: any, response: any) => Promise<any>) { }
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
                    getRawServer: () => Object;
                    gzipResponse () : void { }
                    queryParser () : void { }
                    uncaughtException (fn: Function) { }
                    use (fn: Function | Function[]) { }
                    addRoute (httpMethod: string, route: string, iterator: (request: any, response: any) => Promise<any>) { }
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

                obj.start()
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

                this.onSpy = sinon.spy(obj, "on");

            });

            it("should send through to the uncaughtException method", function () {

                var fn = function () { };

                expect(obj.uncaughtException(fn)).to.be.equal(obj);

                expect(this.onSpy).to.be.calledOnce
                    .calledWithExactly("uncaughtException", fn);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly(fn);

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

            it("should do many args", function () {

                var fn = function () { };

                expect(obj.use(fn, 2, 3, "hello")).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly(fn, 2, 3, "hello");

            });

            it("should do an array of functions", function () {

                var fn1 = function () { };
                var fn2 = function () { };

                expect(obj.use([fn1, fn2])).to.be.equal(obj);

                expect(this.spy).to.be.calledOnce
                    .calledWithExactly([
                        fn1,
                        fn2
                    ]);

            });

        });

    });

});
