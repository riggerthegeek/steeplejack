/**
 * steeplejack.test
 */

/// <reference path="../../typings/tsd.d.ts" />

"use strict";


/* Node modules */
import * as path from "path";


/* Third-party modules */


/* Files */
import {
    expect,
    proxyquire,
    sinon
} from "../helpers/configure";
import {Steeplejack} from "../../steeplejack";
import {Base} from "../../lib/base";
import {Injector} from "../../lib/injector";


describe("Steeplejack test", function () {

    describe("Methods", function () {

        describe("#constructor", function () {

            it("should create with no input", function () {

                let obj = new Steeplejack();

                expect(obj).to.be.instanceof(Steeplejack)
                    .instanceof(Base);

                expect(obj.injector).to.be.instanceof(Injector);

                /* Check injector registered to itself */
                expect(obj.injector.getComponent("$injector").instance).to.be.equal(obj.injector);

                /* Check config registered */
                expect(obj.injector.getComponent("$config").instance).to.be.eql({});

            });

            it("should ignore a non-object config", function () {

                let obj = new Steeplejack(null);

                expect(obj).to.be.instanceof(Steeplejack)
                    .instanceof(Base);

                expect(obj.injector).to.be.instanceof(Injector);

                /* Check injector registered to itself */
                expect(obj.injector.getComponent("$injector").instance).to.be.equal(obj.injector);

                /* Check config registered */
                expect(obj.injector.getComponent("$config").instance).to.be.eql({});

            });

            it("should register the config to the IOC container", function () {

                var obj = new Steeplejack({
                    config: "value"
                });

                expect(obj).to.be.instanceof(Steeplejack)
                    .instanceof(Base);

                expect(obj.injector).to.be.instanceof(Injector);

                /* Check injector registered to itself */
                expect(obj.injector.getComponent("$injector").instance).to.be.equal(obj.injector);

                /* Check config registered */
                expect(obj.injector.getComponent("$config").instance).to.be.eql({
                    config: "value"
                });

            });

        });


    });

    describe("Static methods", function () {

        describe("#app", function () {

            beforeEach(function () {

                /* Set as no CLI arguments by default */
                this.yargs = {
                    argv: {
                        _: []
                    }
                };

                this.router = {
                    discoverRoutes: sinon.stub(),
                    getFileList: sinon.stub()
                };

                this.Steeplejack = proxyquire("../../steeplejack", {
                    yargs: this.yargs,
                    "./lib/router": { Router: this.router }
                }).Steeplejack;

            });

            it("should load up the app with no extras - no config", function () {

                var app = this.Steeplejack.app();

                expect(app).to.be.instanceof(this.Steeplejack)
                    .instanceof(Base);

                expect(app.config).to.be.eql({});
                expect(app.modules).to.be.eql([]);
                expect(app.routes).to.be.eql({});

            });

            it("should load up the app with no extras", function () {

                var app = Steeplejack.app();

                expect(app).to.be.instanceof(Steeplejack)
                    .instanceof(Base);

                expect(app.modules).to.be.eql([]);
                expect(app.routes).to.be.eql({});

            });

            it("should load up the app with no extras if empty object provided", function () {

                var app = this.Steeplejack.app({});

                expect(app).to.be.instanceof(this.Steeplejack)
                    .instanceof(Base);

                expect(app.config).to.be.eql({});
                expect(app.modules).to.be.eql([]);
                expect(app.routes).to.be.eql({});

            });

            it("should load up the app with no extras if empty object provided - no config", function () {

                var app = Steeplejack.app({});

                expect(app).to.be.instanceof(Steeplejack)
                    .instanceof(Base);

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

            it("should pass in modules", function () {

                var spy = sinon.spy(this.Steeplejack.prototype, "addModule");

                var app = this.Steeplejack.app({
                    modules: [
                        "module1",
                        "module2",
                        "module3"
                    ]
                });

                expect(app).to.be.instanceof(this.Steeplejack);

                expect(app.config).to.be.eql({});
                expect(app.routes).to.be.eql({});

                expect(spy).to.be.calledThrice
                    .calledWithExactly("module1")
                    .calledWithExactly("module2")
                    .calledWithExactly("module3");

            });

            it("should pass in the routes", function () {

                let routesObj = {hello: "world"};

                this.router.getFileList.returns(routesObj);
                this.router.discoverRoutes.returns({
                    foo: "bar"
                });

                var app = this.Steeplejack.app({
                    routesDir: "route/dir"
                });

                expect(app).to.be.instanceof(this.Steeplejack);

                expect(app.config).to.be.eql({});
                expect(app.modules).to.be.eql([]);
                expect(app.routes).to.be.eql({
                    foo: "bar"
                });

                expect(this.router.getFileList).to.be.calledOnce
                    .calledWithExactly(path.join(process.cwd(), "route/dir"), "**/*.js");

                expect(this.router.discoverRoutes).to.be.calledOnce
                    .calledWithExactly(routesObj);

            });

            it("should pass in an absolute path", function () {

                let routesObj = {spam: "eggs"};

                this.router.getFileList.returns(routesObj);
                this.router.discoverRoutes.returns({
                    food: "bard"
                });

                var app = this.Steeplejack.app({
                    routesDir: "/route/dir",
                    routesGlob: "**/*.es6"
                });

                expect(app).to.be.instanceof(this.Steeplejack);

                expect(app.config).to.be.eql({});
                expect(app.modules).to.be.eql([]);
                expect(app.routes).to.be.eql({
                    food: "bard"
                });

                expect(this.router.getFileList).to.be.calledOnce
                    .calledWithExactly("/route/dir", "**/*.es6");

                expect(this.router.discoverRoutes).to.be.calledOnce
                    .calledWithExactly(routesObj);

            });

        });

    });

});
