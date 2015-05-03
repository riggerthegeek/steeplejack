/**
 * steeplejack
 */

"use strict";


/* Node modules */
var path = require("path");


/* Third-party modules */
var proxyquire = require("proxyquire");


/* Files */
var Main = rootRequire();
var Base = rootRequire("/src/library/Base");
var Router = rootRequire("src/library/Router");


describe("Main test", function () {

    describe("Instantiation method", function () {

        describe("constructor", function () {

            it("should register the config to the IOC container", function () {

                var stub = sinon.stub(Main.prototype, "getInjector");

                var registerSingleton = sinon.stub();

                stub.returns({
                    registerSingleton: registerSingleton
                });

                var obj = new Main({
                    config: "value"
                });

                expect(registerSingleton).to.be.calledOnce
                    .calledWithExactly("$config", {
                        config: "value"
                    });

                stub.restore();

            });

        });

    });

    describe("Methods", function () {

        describe("#_getNameInstance", function () {

            beforeEach(function () {

                this.obj = new Main();

            });

            it("should throw an error when a non-object is passed in", function () {

                var fail = false;

                try {
                    this.obj._getNameInstance("string");
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Invalid module formatting");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should throw an error when an array is passed in", function () {

                var fail = false;

                try {
                    this.obj._getNameInstance(["string"]);
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Invalid module formatting");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should throw an error when an empty object is passed in", function () {

                var fail = false;

                try {
                    this.obj._getNameInstance({});
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Invalid module formatting");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should throw an error when an object with 2 keys is passed in", function () {

                var fail = false;

                try {
                    this.obj._getNameInstance({
                        something: "here",
                        somethingelse: "here"
                    });
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Invalid module formatting");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should correctly return the name and instance", function () {

                expect(this.obj._getNameInstance({
                    name: "instance"
                }))
                    .to.be.eql({
                        name: "name",
                        inst: "instance"
                    });

            });

        });

        describe("#_registerModule", function () {

        });

        describe("#addModule", function () {

        });

        describe("#getInjector", function () {

            it("should return the injector instance", function () {

                var obj = new Main();

                expect(obj.getInjector()).to.be.equal(obj._injector);

            });

        });

        describe("#registerConfig", function () {

        });

        describe("#registerConstant", function () {

        });

        describe("#registerFactory", function () {

        });

        describe("#registerSingleton", function () {

        });

        describe("#run", function () {

        });

        describe("#setRoutes", function () {

        });

    });

    describe("Static methods", function () {

        describe("#app", function () {

            beforeEach(function () {

                proxyquire.noCallThru();

                this.optimist = {
                    argv: {
                        _: []
                    }
                };

                this.router = {
                    discoverRoutes: sinon.stub()
                };

                this.Main = proxyquire("../../../", {
                    optimist: this.optimist,
                    "./library/Router": this.router
                });

            });

            it("should load up the app with no extras", function () {

                this.optimist.argv._ = [];

                var app = this.Main.app();

                expect(app).to.be.instanceof(this.Main);

                expect(app._config).to.be.eql({});
                expect(app._modules).to.be.eql([]);
                expect(app._routes).to.be.eql({});

            });

            it("should load in the config", function () {

                this.optimist.argv._ = [];

                var app = this.Main.app({
                    config: {
                        val1: true,
                        val2: "hello"
                    }
                });

                expect(app).to.be.instanceof(this.Main);

                expect(app._config).to.be.eql({
                    val1: true,
                    val2: "hello"
                });
                expect(app._modules).to.be.eql([]);
                expect(app._routes).to.be.eql({});

            });

            it("should merge in environment variables to the config", function () {

                this.optimist.argv._ = [];

                var stub = sinon.sandbox.create().stub(process.env);

                stub.VAL_1_ENVVAR = "false";
                stub.VAL_2_ENVVAR = "goodbye";

                var app = this.Main.app({
                    config: {
                        val1: true,
                        val2: "hello"
                    },
                    env: {
                        val1: "VAL_1_ENVVAR",
                        val2: "VAL_2_ENVVAR"
                    }
                });

                expect(app).to.be.instanceof(this.Main);

                expect(app._config).to.be.eql({
                    val1: false,
                    val2: "goodbye"
                });
                expect(app._modules).to.be.eql([]);
                expect(app._routes).to.be.eql({});

            });

            it("should merge in environment variables and command line arguments to the config", function () {

                this.optimist.argv._ = [
                    "val2=erm?"
                ];

                var stub = sinon.sandbox.create().stub(process.env);

                stub.VAL_1_ENVVAR = "false";
                stub.VAL_2_ENVVAR = "goodbye";

                var app = this.Main.app({
                    config: {
                        val1: true,
                        val2: "hello"
                    },
                    env: {
                        val1: "VAL_1_ENVVAR",
                        val2: "VAL_2_ENVVAR"
                    }
                });

                expect(app).to.be.instanceof(this.Main);

                expect(app._config).to.be.eql({
                    val1: false,
                    val2: "erm?"
                });
                expect(app._modules).to.be.eql([]);
                expect(app._routes).to.be.eql({});

            });

            it("should pass in modules", function () {

                var spy = sinon.spy(this.Main.prototype, "addModule");

                var app = this.Main.app({
                    modules: [
                        "module1",
                        "module2",
                        "module3"
                    ]
                });

                expect(app).to.be.instanceof(this.Main);

                expect(app._config).to.be.eql({});
                expect(app._routes).to.be.eql({});

                expect(spy).to.be.called
                    .calledWith([
                        "module1",
                        "module2",
                        "module3"
                    ]);

            });

            it("should pass in the routes", function () {

                var spy = sinon.spy(this.Main.prototype, "setRoutes");

                this.router.discoverRoutes.returns("routes");

                var app = this.Main.app({
                    routeDir: "route/dir"
                });

                expect(app).to.be.instanceof(this.Main);

                expect(app._config).to.be.eql({});
                expect(app._modules).to.be.eql([]);

                expect(spy).to.be.calledOnce
                    .calledWith("routes");

                expect(this.router.discoverRoutes).to.be.calledOnce
                    .calledWith(path.join(process.cwd(), "route/dir"));

            });

        });

        describe("#Base", function () {

            it("should be the same as the Base object", function (done) {

                expect(Main.Base).to.be.equal(Base);

                done();

            });

        });

        describe("#Collection", function () {

            it("should be the same as the Collection object", function (done) {

                expect(Main.Collection).to.be.equal(require("../../../src/library/Collection"));

                done();

            });

        });

        describe("#Exceptions", function () {

            it("should present an object of exceptions", function (done) {

                var Exceptions = Main.Exceptions;

                expect(Exceptions.Exception).to.be.equal(require("../../../src/error/Exception"));
                expect(Exceptions.Fatal).to.be.equal(require("../../../src/error/Fatal"));
                expect(Exceptions.Validation).to.be.equal(require("../../../src/error/Validation"));

                done();

            });

        });

        describe("#Injector", function () {

            it("should present the Injector object", function () {

                expect(Main.Injector).to.be.equal(require("../../../src/library/Injector"));

            });

        });

        describe("#Model", function () {

            it("should be the same as the DomainModel object", function (done) {

                expect(Main.Model).to.be.equal(require("../../../src/library/DomainModel"));

                done();

            });

        });

        describe("#Router", function () {

            it("should be the same as the Router", function () {
                expect(Main.Router).to.be.equal(require("../../../src/library/Router"));
            });

        });

    });

});
