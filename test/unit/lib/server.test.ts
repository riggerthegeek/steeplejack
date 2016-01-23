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
import {expect} from "../../helpers/configure";


describe("Server tests", function () {

    beforeEach(function () {
        class Strategy implements IServerStrategy {
            start () {
                return new Promise(function (resolve: any) {
                    resolve();
                });
            }
        }

        this.DefaultStrategy = Strategy;
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

        describe("#start", function () {

            it("should start a server with just the port", function () {

                class Strategy implements IServerStrategy {

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
