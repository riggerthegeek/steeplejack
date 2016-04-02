/**
 * socketRequest.test
 */

/// <reference path="../../../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */
import {Promise} from "es6-promise";


/* Files */
import {Base} from "../../../lib/base";
import {SocketRequest} from "../../../lib/socketRequest";
import {ISocketRequest} from "../../../interfaces/socketRequest";
import {ISocketBroadcast} from "../../../interfaces/socketBroadcast";
import {IServerStrategy} from "../../../interfaces/serverStrategy";
import {expect, sinon} from "../../helpers/configure";


describe("socketRequest test", function () {

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

        this.socket = {
            my: "socket"
        };

        this.obj = new SocketRequest(this.socket, this.strategy);

        expect(this.obj).to.be.instanceof(SocketRequest)
            .instanceof(Base);

        expect(this.obj.socket).to.be.equal(this.socket);
        expect((<any> this.obj)._strategy).to.be.equal(this.strategy);

    });

    describe("methods", function () {

        describe("#constructor", function () {

            it("should set the socket and strategy to the class", function () {

                expect(this.obj.params).to.be.eql([]);

                this.obj.params = [
                    "hello"
                ];

                expect(this.obj.params).to.be.eql([
                    "hello"
                ]);

            });

        });

        describe("#broadcast", function () {

            it("should emit a broadcast event", function (done: any) {

                this.obj.on("broadcast", (broadcast: ISocketBroadcast) => {

                    try {

                        expect(broadcast).to.be.eql({
                            event: "myEvent",
                            data: [
                                "this",
                                "is",
                                "some data"
                            ],
                            target: {
                                hello: "world"
                            }
                        });

                        done();

                    } catch (err) {
                        done(err);
                    }

                });

                expect(this.obj.broadcast({
                    event: "myEvent",
                    data: [
                        "this",
                        "is",
                        "some data"
                    ],
                    target: {
                        hello: "world"
                    }
                })).to.be.equal(this.obj);

            });

        });

        describe("#getId", function () {

            it("should get the ID from the strategy", function () {

                this.strategy.getSocketId.returns("1234567890");

                expect(this.obj.getId()).to.be.equal("1234567890");

                expect(this.strategy.getSocketId).to.be.calledOnce
                    .calledWithExactly(this.obj.socket);

            });

        });

        describe("#joinChannel", function () {

            it("should call the strategy's joinChannel method", function () {

                expect(this.obj.joinChannel("some channel")).to.be.equal(this.obj);

                expect(this.strategy.joinChannel).to.be.calledOnce
                    .calledWithExactly(this.socket, "some channel");

            });

        });

        describe("#leaveChannel", function () {

            it("should call the strategy's leaveChannel method", function () {

                expect(this.obj.leaveChannel("some other channel")).to.be.equal(this.obj);

                expect(this.strategy.leaveChannel).to.be.calledOnce
                    .calledWithExactly(this.socket, "some other channel");

            });

        });

    });

});
