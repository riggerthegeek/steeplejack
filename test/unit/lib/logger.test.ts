/**
 * logger.test
 */

/// <reference path="../../../typings/index.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Logger} from "../../../lib/logger";
import {expect, sinon} from "../../helpers/configure";
import {ILoggerStrategy} from "../../../interfaces/loggerStrategy";


describe("Logger test", function () {

    describe("Methods", function () {

        var obj: Logger,
            strategy: any;
        beforeEach(function () {

            let methods = [
                "level",
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

        describe("#setLevel", function () {

            it("should default the level to error when not set", function () {

                expect(obj.level).to.be.undefined;

            });

            it("should allow a string to be set", function () {

                let x = 1;

                Logger.getLogLevels().forEach((level:string) => {

                    obj.level = level;

                    expect(obj.level).to.be.equal(level);
                    expect(strategy.level).to.be.callCount(x++)
                        .calledWithExactly(level);

                });

            });

            it("should keep the existing logLevel if not in the getLogLevels method", function () {

                expect(obj.level).to.be.undefined;

                expect(strategy.level).to.not.be.called;

                obj.level = "missing";

                expect(obj.level).to.be.undefined;

                expect(strategy.level).to.not.be.called;

                obj.level = "fatal";

                expect(obj.level).to.be.equal("fatal");

                expect(strategy.level).to.be.calledOnce
                    .calledWithExactly("fatal");

                obj.level = "spank";

                expect(obj.level).to.be.equal("fatal");

                expect(strategy.level).to.be.calledOnce;

            });

        });

        describe("#fatal", function () {

            it("should send a fatal message", function () {

                let err = new Error("This is an error");

                expect(obj.fatal("message", err, 2)).to.be.equal(obj);

                expect(strategy.fatal).to.be.calledOnce
                    .calledWithExactly("message", err, 2);

            });

        });

        describe("#error", function () {

            it("should send a error message", function () {

                let err = new Error("This is an error");

                expect(obj.error("message", err, 3)).to.be.equal(obj);

                expect(strategy.error).to.be.calledOnce
                    .calledWithExactly("message", err, 3);

            });

        });

        describe("#warn", function () {

            it("should send a warn message", function () {

                let err = new Error("This is an error");

                expect(obj.warn("message", err, 4)).to.be.equal(obj);

                expect(strategy.warn).to.be.calledOnce
                    .calledWithExactly("message", err, 4);

            });

        });

        describe("#info", function () {

            it("should send an info message", function () {

                let err = new Error("This is an error");

                expect(obj.info("message", err, 5)).to.be.equal(obj);

                expect(strategy.info).to.be.calledOnce
                    .calledWithExactly("message", err, 5);

            });

        });

        describe("#debug", function () {

            it("should send a debug message", function () {

                let err = new Error("This is an error");

                expect(obj.debug("message", err, 6)).to.be.equal(obj);

                expect(strategy.debug).to.be.calledOnce
                    .calledWithExactly("message", err, 6);

            });

        });

        describe("#trace", function () {

            it("should send a trace message", function () {

                let err = new Error("This is an error");

                expect(obj.trace("message", err, 7)).to.be.equal(obj);

                expect(strategy.trace).to.be.calledOnce
                    .calledWithExactly("message", err, 7);

            });

        });

    });

    describe("Static method", function () {

        describe("#getLogLevels", function () {

            it("should return the logging levels", function () {

                expect(Logger.getLogLevels()).to.be.eql([
                    "fatal",
                    "error",
                    "warn",
                    "info",
                    "debug",
                    "trace"
                ]);

            });

        });

    });

});
