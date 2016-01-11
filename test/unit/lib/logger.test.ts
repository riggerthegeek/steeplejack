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


describe("Logger test", () => {

    describe("Methods", () => {

        var obj: any,
            strategy: any;
        beforeEach(() => {

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

        describe("#getLogLevels", () => {

            it("should return the logging levels", () => {

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

        describe("#setLevel", () => {

            it("should default the level to error when not set", () => {

                expect(obj.level).to.be.equal("error");

            });

            it("should allow a string to be set", () => {

                obj.getLogLevels().forEach((level:string) => {

                    obj.level = level;

                    expect(obj.level).to.be.equal(level);

                });

            });

            it("should keep the existing logLevel if not in the getLogLevels method", () => {

                expect(obj.level).to.be.equal("error");

                obj.level = "missing";

                expect(obj.level).to.be.equal("error");

                obj.level = "fatal";

                expect(obj.level).to.be.equal("fatal");

                obj.level = "spank";

                expect(obj.level).to.be.equal("fatal");

            });

        });

        describe("#fatal", () => {

            it("should send a fatal message", () => {

                expect(obj.fatal("message")).to.be.equal(obj);

                expect(strategy.fatal).to.be.calledOnce
                    .calledWithExactly("message");

            });

        });

        describe("#error", () => {

            it("should send a error message", () => {

                expect(obj.error("message")).to.be.equal(obj);

                expect(strategy.error).to.be.calledOnce
                    .calledWithExactly("message");

            });

        });

        describe("#warn", () => {

            it("should send a warn message", () => {

                expect(obj.warn("message")).to.be.equal(obj);

                expect(strategy.warn).to.be.calledOnce
                    .calledWithExactly("message");

            });

        });

        describe("#info", () => {

            it("should send an info message", () => {

                expect(obj.info("message")).to.be.equal(obj);

                expect(strategy.info).to.be.calledOnce
                    .calledWithExactly("message");

            });

        });

        describe("#debug", () => {

            it("should send a debug message", () => {

                expect(obj.debug("message")).to.be.equal(obj);

                expect(strategy.debug).to.be.calledOnce
                    .calledWithExactly("message");

            });

        });

        describe("#trace", () => {

            it("should send a trace message", () => {

                expect(obj.trace("message")).to.be.equal(obj);

                expect(strategy.trace).to.be.calledOnce
                    .calledWithExactly("message");

            });

        });

    });

});
