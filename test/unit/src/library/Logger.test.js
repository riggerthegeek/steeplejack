/**
 * Logger
 */

"use strict";


/* Node modules */
var _ = require("lodash");
var steeplejack = require("steeplejack");


/* Third-party modules */


/* Files */
var Main = rootRequire();

var Base = Main.Base;
var Logger = Main.Logger;


describe("Logger test", function () {


    describe("Methods", function () {

        var obj;
        beforeEach(function () {
            obj = new Logger();

            obj._setLevel = sinon.spy();
            obj._trigger = sinon.spy();
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

                obj.setLevel();

                expect(obj._setLevel).to.be.calledOnce
                    .calledWith("error");

            });

            it("should allow a string to be set", function () {

                _.each([
                    "fatal",
                    "error",
                    "warn",
                    "info",
                    "debug",
                    "trace"
                ], function (level, id) {

                    obj._setLevel(level);

                    expect(obj._setLevel).to.be.called
                        .callCount(id + 1)
                        .calledWith(level);

                });

            });

        });

        describe("#fatal", function () {

            it("should send a fatal message", function () {

                obj.fatal("message");

                expect(obj._trigger).to.be.calledOnce
                    .calledWith(6, "message");

            });

        });

        describe("#error", function () {

            it("should send a error message", function () {

                obj.error("message");

                expect(obj._trigger).to.be.calledOnce
                    .calledWith(5, "message");

            });

        });

        describe("#warn", function () {

            it("should send a warn message", function () {

                obj.warn("message");

                expect(obj._trigger).to.be.calledOnce
                    .calledWith(4, "message");

            });

        });

        describe("#info", function () {

            it("should send an info message", function () {

                obj.info("message");

                expect(obj._trigger).to.be.calledOnce
                    .calledWith(3, "message");

            });

        });

        describe("#debug", function () {

            it("should send a debug message", function () {

                obj.debug("message");

                expect(obj._trigger).to.be.calledOnce
                    .calledWith(2, "message");

            });

        });

        describe("#trace", function () {

            it("should send a trace message", function () {

                obj.trace("message");

                expect(obj._trigger).to.be.calledOnce
                    .calledWith(1, "message");

            });

        });

    });


});
