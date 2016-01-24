/**
 * steeplejack.test
 */

/// <reference path="../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {
    expect,
    proxyquire,
    sinon
} from "../helpers/configure";
import {Steeplejack} from "../../steeplejack";
import {Base} from "../../lib/base";


describe("Steeplejack test", function () {

    describe("Static methods", function () {

        describe("#app", function () {

            beforeEach(function () {

                /* Set as no CLI arguments by default */
                this.yargs = {
                    argv: {
                        _: []
                    }
                };

                this.Steeplejack = proxyquire("../../steeplejack", {
                    yargs: this.yargs
                }).Steeplejack;

            });

            it("should load up the app with no extras", function () {

                var app = this.Steeplejack.app();

                expect(app).to.be.instanceof(this.Steeplejack)
                    .instanceof(Base);

                expect(app.config).to.be.eql({});
                expect(app.modules).to.be.eql([]);
                expect(app.routes).to.be.eql({});

            });

            it("should load in the config", function () {

                this.yargs.argv._ = [];

                var app = this.Steeplejack.app({
                    config: {
                        val1: true,
                        val2: "hello"
                    }
                });

                expect(app).to.be.instanceof(this.Steeplejack);

                expect(app.config).to.be.eql({
                    val1: true,
                    val2: "hello"
                });
                expect(app.modules).to.be.eql([]);
                expect(app.routes).to.be.eql({});

            });

            it("should merge in environment variables to the config", function () {

                this.yargs.argv._ = [];

                process.env.VAL_1_ENVVAR = "false";
                process.env.VAL_2_ENVVAR = "goodbye";

                var app = this.Steeplejack.app({
                    config: {
                        val1: true,
                        val2: "hello"
                    },
                    env: {
                        val1: "VAL_1_ENVVAR",
                        val2: "VAL_2_ENVVAR"
                    }
                });

                expect(app).to.be.instanceof(this.Steeplejack);

                expect(app.config).to.be.eql({
                    val1: false,
                    val2: "goodbye"
                });
                expect(app.modules).to.be.eql([]);
                expect(app.routes).to.be.eql({});

            });

            it("should merge in environment variables and command line arguments to the config", function () {

                this.yargs.argv._ = [
                    "val2=erm?"
                ];

                process.env.VAL_1_ENVVAR = "false";
                process.env.VAL_2_ENVVAR = "goodbye";

                var app = this.Steeplejack.app({
                    config: {
                        val1: true,
                        val2: "hello"
                    },
                    env: {
                        val1: "VAL_1_ENVVAR",
                        val2: "VAL_2_ENVVAR"
                    }
                });

                expect(app).to.be.instanceof(this.Steeplejack);

                expect(app.config).to.be.eql({
                    val1: false,
                    val2: "erm?"
                });
                expect(app.modules).to.be.eql([]);
                expect(app.routes).to.be.eql({});

            });

        });

    });

});
