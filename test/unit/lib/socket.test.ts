/**
 * socket.test
 */

/// <reference path="../../../typings/main.d.ts" />

"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */
import {Promise} from "es6-promise";


/* Files */
import {Base} from "../../../lib/base";
import {Socket, CONNECT_FLAG, MIDDLEWARE_FLAG} from "../../../lib/socket";
import {expect, proxyquire, sinon} from "../../helpers/configure";
import {IAddSocket} from "../../../interfaces/addSocket";


describe("socket test", function () {

    describe("flags", function () {

        it("should ensure the CONNECT_FLAG is set to connect", function () {
            expect(CONNECT_FLAG).to.be.equal("connect");
        });

        it("should ensure MIDDLEWARE_FLAG is set to __middleware", function () {
            expect(MIDDLEWARE_FLAG).to.be.equal("__middleware");
        });

    });

    describe("methods", function () {

        beforeEach(function () {

            this.strategy = {
                broadcast: sinon.spy(),
                connect: sinon.spy(),
                createSocket: sinon.spy(),
                getSocketId: sinon.stub(),
                joinChannel: sinon.spy(),
                leaveChannel: sinon.spy(),
                listen: sinon.spy()
            };

        });

        describe("#constructor", function () {

            it("should set the socket strategy", function () {

                let obj = new Socket(this.strategy);

                expect(obj).to.be.instanceof(Socket)
                    .instanceof(Base);

                expect((<any> obj)._strategy).to.be.equal(this.strategy);

            });

            it("should throw an error if strategy not an object", function () {

                let fail = false;

                try {
                    new Socket(null);
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Socket strategy object is required");

                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

        describe("#listen", function () {

            it("should listen, set the params and dispatch to the socketFn, resolving the promise", function (done: any) {

                let request = {
                    emit: sinon.spy(),
                    broadcast: sinon.spy(),
                    disconnect: sinon.spy(),
                    getId: sinon.spy(),
                    joinChannel: sinon.spy(),
                    leaveChannel: sinon.spy(),
                    socket: "socket",
                    params: <any[]> [],
                    data: {}
                };

                this.strategy.listen = (socket: any, event: any, iterator: (...params: any[]) => Promise<any>) => {

                    expect(socket).to.be.equal("socket");
                    expect(event).to.be.equal("hello");
                    expect(iterator).to.be.a("function");

                    iterator("arg1", "arg2", "arg3")
                        .then((result: any) => {
                            expect(result).to.be.equal("bumtitty");
                            done();
                        })
                        .catch((err: any) => {
                            done(err);
                        });

                };

                let obj = new Socket(this.strategy);

                obj.listen(request, "hello", (req: any) => {

                    expect(req).to.be.equal(request);
                    expect(req.params).to.be.eql([
                        "arg1",
                        "arg2",
                        "arg3"
                    ]);

                    return "bumtitty";
                });

            });

            it("should listen, set the params and dispatch to the socketFn, rejecting the promise", function (done: any) {

                let request = {
                    emit: sinon.spy(),
                    broadcast: sinon.spy(),
                    disconnect: sinon.spy(),
                    getId: sinon.spy(),
                    joinChannel: sinon.spy(),
                    leaveChannel: sinon.spy(),
                    socket: "sockety",
                    params: <any[]> [],
                    data: {}
                };

                this.strategy.listen = (socket: any, event: any, iterator: (...params: any[]) => Promise<any>) => {

                    expect(socket).to.be.equal("sockety");
                    expect(event).to.be.equal("hello");
                    expect(iterator).to.be.a("function");

                    iterator("arg1", "arg2")
                        .then(() => {
                            throw new Error("invalid error");
                        })
                        .catch((err: any) => {
                            expect(err).to.be.instanceof(Error);
                            expect(err.message).to.be.equal("some error");

                            done();
                        });

                };

                let obj = new Socket(this.strategy);

                obj.listen(request, "hello", (req: any) => {

                    expect(req).to.be.equal(request);
                    expect(req.params).to.be.eql([
                        "arg1",
                        "arg2"
                    ]);

                    return Promise.reject(new Error("some error"));
                });

            });

            it("should listen, set the params and dispatch to the socketFn, throwing an error", function (done: any) {

                let request = {
                    emit: sinon.spy(),
                    broadcast: sinon.spy(),
                    disconnect: sinon.spy(),
                    getId: sinon.spy(),
                    joinChannel: sinon.spy(),
                    leaveChannel: sinon.spy(),
                    socket: "sockety",
                    params: <any[]> [],
                    data: {}
                };

                this.strategy.listen = (socket: any, event: any, iterator: (...params: any[]) => Promise<any>) => {

                    expect(socket).to.be.equal("sockety");
                    expect(event).to.be.equal("hello");
                    expect(iterator).to.be.a("function");

                    iterator("arg1", "arg2")
                        .then(() => {
                            throw new Error("invalid error");
                        })
                        .catch((err: any) => {
                            expect(err).to.be.instanceof(Error);
                            expect(err.message).to.be.equal("some thrown error");

                            done();
                        });

                };

                let obj = new Socket(this.strategy);

                obj.listen(request, "hello", (req: any) => {

                    expect(req).to.be.equal(request);
                    expect(req.params).to.be.eql([
                        "arg1",
                        "arg2"
                    ]);

                    throw new Error("some thrown error");

                });

            });

        });

        describe("#namespace", function () {

            beforeEach(function () {

                this.socketRequest = sinon.stub();

                this.stub = proxyquire("../../lib/socket", {
                    "./socketRequest": {
                        SocketRequest: this.socketRequest
                    }
                }).Socket;

            });

            it("should wrap the namespace with some events, no connect or middleware", function (done: any) {

                let socketRequestInst = {
                    on: (event: string, listener: any) => {

                        expect(event).to.be.equal("broadcast");
                        expect(listener).to.be.a("function");

                        listener("broadcast");

                    }
                };

                this.socketRequest.returns(socketRequestInst);

                this.strategy.connect = (nsp: any, mid: any) => {

                    expect(nsp).to.be.equal("namespace");
                    expect(mid).to.be.eql([]);

                    let emitter = new EventEmitter();

                    setTimeout(() => {
                        emitter.emit("connected", "socketConnection");
                    }, 1);

                    return emitter;

                };

                let obj = new this.stub(this.strategy);

                let listener = sinon.spy(obj, "listen");
                let emitter = sinon.spy(obj, "emit");

                setTimeout(() => {

                    expect(listener).to.be.calledTwice;

                    expect(emitter).to.be.calledTwice
                        .calledWithExactly("socketAdded", "namespace", "event1")
                        .calledWithExactly("socketAdded", "namespace", "event2");

                    expect(this.socketRequest).to.be.calledOnce
                        .calledWithNew
                        .calledWithExactly("socketConnection", (<any> obj)._strategy);

                    expect(this.strategy.broadcast).to.be.calledOnce
                        .calledWithExactly(socketRequestInst, "broadcast");

                    done();

                }, 10);

                let event: IAddSocket = {
                    event1: () => {},
                    event2: () => {}
                };

                expect(obj.namespace("namespace", event)).to.be.equal(obj);

            });

            it("should wrap the namespace with some events, connect and middleware", function (done: any) {

                let socketRequestInst = {
                    on: (event: string, listener: any) => {

                        expect(event).to.be.equal("broadcast");
                        expect(listener).to.be.a("function");

                        listener("broadcast");

                    }
                };

                let event: IAddSocket = {
                    connect: sinon.spy(),
                    __middleware: [
                        () => {},
                        () => {}
                    ],
                    event1: () => {},
                    event2: () => {}
                };

                this.socketRequest.returns(socketRequestInst);

                this.strategy.connect = (nsp: any, mid: any) => {

                    expect(nsp).to.be.equal("namespace");
                    expect(mid).to.be.equal(event.__middleware);

                    let emitter = new EventEmitter();

                    setTimeout(() => {
                        emitter.emit("connected", "socketConnection");
                    });

                    return emitter;

                };

                let obj = new this.stub(this.strategy);

                let listener = sinon.spy(obj, "listen");
                let emitter = sinon.spy(obj, "emit");

                setTimeout(() => {

                    expect(listener).to.be.calledTwice;

                    expect(emitter).to.be.calledTwice
                        .calledWithExactly("socketAdded", "namespace", "event1")
                        .calledWithExactly("socketAdded", "namespace", "event2");

                    expect(this.socketRequest).to.be.calledOnce
                        .calledWithNew
                        .calledWithExactly("socketConnection", (<any> obj)._strategy);

                    expect(this.strategy.broadcast).to.be.calledOnce
                        .calledWithExactly(socketRequestInst, "broadcast");

                    expect(event.connect).to.be.calledOnce
                        .calledWithExactly(socketRequestInst);

                    done();

                }, 10);

                expect(obj.namespace("namespace", event)).to.be.equal(obj);

            });

        });

    });

});
