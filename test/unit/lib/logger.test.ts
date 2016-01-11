/**
 * logger.test
 */

/// <reference path="../../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Logger} from "../../../lib/logger";
import {expect, sinon} from "../../helpers/configure";


describe("Logger test", function () {

    describe("Methods", function () {

        var obj: any,
            strategy: any;
        beforeEach(function () {

            let methods = [
                "fatal",
                "error",
                "warn",
                "info",
                "debug",
                "trace"
            ];

            strategy = {};

            methods.forEach((method) => {
                strategy[method] = sinon.spy();
            });

            obj = new Logger(strategy);

        });

        describe("#getLogLevels", function () {

            it("should return the logging levels", function () {

                expect(obj.getLogLevels()).to.be.eql([
                    "fatal",
                    "error",
                    "warn",
                    "info",
                    "debug",
                    "trace"
                ]);

            });

        });

        describe("#setLevel", function () {

            it("should default the level to error when not set", function () {

                expect(obj.level).to.be.equal("error");

            });

            it("should allow a string to be set", function () {

                obj.getLogLevels().forEach((level:string) => {

                    obj.level = level;

                    expect(obj.level).to.be.equal(level);

                });

            });

            it("should keep the existing logLevel if not in the getLogLevels method", function () {

                expect(obj.level).to.be.equal("error");

                obj.level = "missing";

                expect(obj.level).to.be.equal("error");

                obj.level = "fatal";

                expect(obj.level).to.be.equal("fatal");

                obj.level = "spank";

                expect(obj.level).to.be.equal("fatal");

            });

        });

        describe("#fatal", function () {

            it("should send a fatal message", function () {

                expect(obj.fatal("message")).to.be.equal(obj);

                expect(strategy.fatal).to.be.calledOnce
                    .calledWithExactly("message");

            });

        });

        describe("#error", function () {

            it("should send a error message", function () {

                expect(obj.error("message")).to.be.equal(obj);

                expect(strategy.error).to.be.calledOnce
                    .calledWithExactly("message");

            });

        });

        describe("#warn", function () {

            it("should send a warn message", function () {

                expect(obj.warn("message")).to.be.equal(obj);

                expect(strategy.warn).to.be.calledOnce
                    .calledWithExactly("message");

            });

        });

        describe("#info", function () {

            it("should send an info message", function () {

                expect(obj.info("message")).to.be.equal(obj);

                expect(strategy.info).to.be.calledOnce
                    .calledWithExactly("message");

            });

        });

        describe("#debug", function () {

            it("should send a debug message", function () {

                expect(obj.debug("message")).to.be.equal(obj);

                expect(strategy.debug).to.be.calledOnce
                    .calledWithExactly("message");

            });

        });

        describe("#trace", function () {

            it("should send a trace message", function () {

                expect(obj.trace("message")).to.be.equal(obj);

                expect(strategy.trace).to.be.calledOnce
                    .calledWithExactly("message");

            });

        });

    });

});
