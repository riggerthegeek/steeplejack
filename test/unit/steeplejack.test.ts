/**
 * steeplejack.test
 */

/// <reference path="../../typings/main.d.ts" />

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
import {Plugin} from "../../lib/plugin";
import {Server} from "../../lib/server";


describe("Steeplejack test", function () {

    describe("Methods", function () {

        describe("#constructor", function () {

            it("should create with no input", function () {

                let obj = new Steeplejack();

                expect(obj).to.be.instanceof(Steeplejack)
                    .instanceof(Base);

                expect(obj.injector).to.be.instanceof(Injector);

                /* Check injector registered to itthis */
                expect(obj.injector.getComponent("$injector").instance).to.be.equal(obj.injector);

                /* Check config registered */
                expect(obj.injector.getComponent("$config").instance).to.be.eql({});

            });

            it("should ignore a non-object config", function () {

                let obj = new Steeplejack(null);

                expect(obj).to.be.instanceof(Steeplejack)
                    .instanceof(Base);

                expect(obj.injector).to.be.instanceof(Injector);

                /* Check injector registered to itthis */
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

                /* Check injector registered to itthis */
                expect(obj.injector.getComponent("$injector").instance).to.be.equal(obj.injector);

                /* Check config registered */
                expect(obj.injector.getComponent("$config").instance).to.be.eql({
                    config: "value"
                });

            });

        });

        describe("#addModule", function () {

            beforeEach(function () {

                this.glob = {
                    sync: sinon.stub()
                };

                this.Steeplejack = proxyquire("../../steeplejack", {
                    glob: this.glob
                }).Steeplejack;

                this.obj = new this.Steeplejack();

            });

            it("should register a single string", function () {

                this.glob.sync.returns([
                    "/path/to/module1",
                    "/path/to/module2"
                ]);

                this.obj.addModule("module1");

                expect(this.obj.modules).to.be.eql([
                    "/path/to/module1",
                    "/path/to/module2"
                ]);

                expect(this.glob.sync).to.be.calledOnce
                    .calledWith(path.join(process.cwd(), "module1"));

            });

            it("should register many modules", function () {

                this.glob.sync.onCall(0).returns([
                    "/path/to/module1",
                    "/path/to/module1a"
                ]);

                this.glob.sync.onCall(1).returns([
                    "/path/to/module2",
                    "/path/to/module2a",
                    "/path/to/module2b"
                ]);

                this.glob.sync.onCall(2).returns([
                    "/path/to/module3"
                ]);

                this.glob.sync.onCall(3).returns([
                    "/module4"
                ]);

                [
                    "module1",
                    "module2",
                    "module3",
                    "/module4" // absolute path
                ].forEach(module => {
                    expect(this.obj.addModule(module)).to.be.equal(this.obj);
                });

                expect(this.obj.modules).to.be.eql([
                    "/path/to/module1",
                    "/path/to/module1a",
                    "/path/to/module2",
                    "/path/to/module2a",
                    "/path/to/module2b",
                    "/path/to/module3",
                    "/module4"
                ]);

                expect(this.glob.sync).to.be.callCount(4)
                    .calledWith(path.join(process.cwd(), "module1"))
                    .calledWith(path.join(process.cwd(), "module2"))
                    .calledWith(path.join(process.cwd(), "module3"))
                    .calledWith(path.join("/module4"));

            });

            it("should throw an error if a non-string is passed in with the array", function () {

                var fail = false;

                try {
                    this.obj.addModule(2);
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be
                        .equal("Steeplejack.addModule can only accept a string or a Plugin instance");

                } finally {

                    expect(fail).to.be.true;

                    expect(this.glob.sync).to.not.be.called;

                }

            });

            it("should allow registration of a single Plugin", function () {

                var plugin = new Plugin();

                expect(this.obj.addModule(plugin)).to.be.equal(this.obj);

                expect(this.glob.sync).to.not.be.called;

            });

            it("should allow registration of mixed Plugins and files", function () {

                var plugin1 = new Plugin([
                    "plugin1-1",
                    "plugin1-2"
                ]);
                var plugin2 = new Plugin([
                    "plugin2-1",
                    "plugin2-2",
                    "plugin2-3",
                    {}
                ]);

                this.glob.sync.onCall(0).returns([
                    "/path/to/module1",
                    "/path/to/module1a"
                ]);

                this.glob.sync.onCall(1).returns([
                    "/path/to/module2",
                    "/path/to/module2a",
                    "/path/to/module2b"
                ]);

                this.glob.sync.onCall(2).returns([
                    "/path/to/module3"
                ]);

                [
                    plugin1,
                    "module1",
                    "module2",
                    plugin2,
                    "module3"
                ].forEach(module => {
                    expect(this.obj.addModule(module)).to.be.equal(this.obj);
                });

                expect(this.obj.modules).to.be.eql([
                    "plugin1-1",
                    "plugin1-2",
                    "/path/to/module1",
                    "/path/to/module1a",
                    "/path/to/module2",
                    "/path/to/module2a",
                    "/path/to/module2b",
                    "plugin2-1",
                    "plugin2-2",
                    "plugin2-3",
                    {},
                    "/path/to/module3"
                ]);

                expect(this.glob.sync).to.be.calledThrice
                    .calledWith(path.join(process.cwd(), "module1"))
                    .calledWith(path.join(process.cwd(), "module2"))
                    .calledWith(path.join(process.cwd(), "module3"));

            });

        });

        describe("#createOutputHandler", function () {

            it("should register the method to the IOC container - result", function (done) {

                var obj = new Steeplejack();

                class Strategy implements IServerStrategy {
                    acceptParser: (options: any, strict: boolean) => void;
                    addRoute: (httpMethod: string, route: string, fn: Function | Function[]) => void;
                    after: (fn: Function) => void;
                    before: (fn: Function) => void;
                    bodyParser: () => void;
                    close: () => void;
                    enableCORS: (origins: string[], addHeaders: string[]) => void;
                    getServer: () => Object;
                    gzipResponse: () => void;
                    queryParser: (mapParser: boolean) => void;
                    start: (port: number, hostname: string, backlog: number) => any;
                    uncaughtException: (fn: Function) => void;
                    use: (fn: Function | Function[]) => void;

                    outputHandler (err: any, data: any, request: Object, result: Object) : any {
                        return {
                            err,
                            data,
                            request,
                            result
                        };
                    }
                }

                let server = new Server({
                    port: 3000
                }, new Strategy());

                let handler = obj.createOutputHandler(server);

                expect(handler).to.be.a("function");

                let req = {hello:"req"};
                let res = {hello:"res"};

                /* Ensure it exits at finally */
                handler(() => {
                    return "result";
                }, req, res)
                    .then((result: any) => {

                        expect(result).to.be.eql({
                            err: null,
                            data: "result",
                            request: req,
                            result: res
                        });

                    })
                    .finally(done);

            });

            it("should register the method to the IOC container - err", function (done) {

                var obj = new Steeplejack();

                class Strategy implements IServerStrategy {
                    acceptParser: (options: any, strict: boolean) => void;
                    addRoute: (httpMethod: string, route: string, fn: Function | Function[]) => void;
                    after: (fn: Function) => void;
                    before: (fn: Function) => void;
                    bodyParser: () => void;
                    close: () => void;
                    enableCORS: (origins: string[], addHeaders: string[]) => void;
                    getServer: () => Object;
                    gzipResponse: () => void;
                    //outputHandler: (err: any, data: any, request: Object, result: Object) => any;
                    queryParser: (mapParser: boolean) => void;
                    start: (port: number, hostname: string, backlog: number) => any;
                    uncaughtException: (fn: Function) => void;
                    use: (fn: Function | Function[]) => void;

                    outputHandler (err: any, data: any, request: Object, result: Object) : any {
                        throw {
                            err,
                            data,
                            request,
                            result
                        };
                    }
                }

                let server = new Server({
                    port: 3000
                }, new Strategy());

                let handler = obj.createOutputHandler(server);

                expect(handler).to.be.a("function");

                let req = {hello:"req"};
                let res = {hello:"res"};

                /* Ensure it exits at finally */
                handler(() => {
                    throw new Error("oh dear");
                }, req, res)
                    .then(() => {
                        throw new Error("invalid");
                    })
                    .catch((err: any) => {

                        expect(err).to.have.keys([
                            "err",
                            "data",
                            "request",
                            "result"
                        ]);

                        expect(err.err).to.be.instanceof(Error);
                        expect(err.err.message).to.be.equal("oh dear");
                        expect(err.data).to.be.null;
                        expect(err.request).to.be.equal(req);
                        expect(err.result).to.be.equal(res);

                    })
                    .finally(done);

            });

        });

        describe("#run", function () {

            beforeEach(function () {

                this.modules = {
                    module1: {
                        __factory: {
                            factory: () => {},
                            name: "mod1"
                        }
                    },
                    module2: {
                        __singleton: {
                            singleton: {
                                hello: "world"
                            },
                            name: "mod2"
                        }
                    },
                    module3: {
                        __config: {
                            config: () => {},
                            name: "mod2"
                        }
                    },
                    module4: {
                        __constant: {
                            constant: {
                                hello: "world"
                            },
                            name: "mod2"
                        }
                    }
                };

                this.Steeplejack = proxyquire("../../steeplejack", {
                    module1: this.modules.module1,
                    module2: this.modules.module2,
                    module3: this.modules.module3,
                    module4: this.modules.module4,
                }).Steeplejack;

                this.obj = new this.Steeplejack({
                    config: "value"
                });

                this.createOutputHandler = sinon.stub(this.obj, "createOutputHandler");

                this.server = {
                    addRoutes: sinon.spy(),
                    close: sinon.spy(),
                    outputHandler: sinon.spy(),
                    start: sinon.stub()
                };

                this.getComponent = sinon.stub();
                this.registerSingleton = sinon.spy();
                this.registerFactory = sinon.spy();
                this.process = sinon.stub()
                    .returns(this.server);

                this.obj.injector = {
                    getComponent: this.getComponent,
                    registerSingleton: this.registerSingleton,
                    registerFactory: this.registerFactory,
                    process: this.process
                };

            });

            it("should throw an error when no function received", function () {

                let fail = false;

                let obj = new Steeplejack();

                try {
                    obj.run(null);
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("Steeplejack.run must receive a factory to create the server");

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it.only("should run the steeplejack server successfully - $output created automatically", function (done) {

                /* Put in the modules and routes manually */
                this.obj.modules = [
                    "module1",
                    "module2",
                    "module3",
                    //"module4"
                ];

                this.obj.routes = {
                    "/route": "routeFn"
                };

                /* Wait for the start emitter */
                this.obj.on("start", (inst: Steeplejack) => {

                    expect(inst).to.be.equal(this.obj);

                    /* Emit close event */
                    this.obj.emit("close");

                    expect(this.server.close).to.be.calledOnce;

                    done();

                });

                this.server.start.resolves();

                var createServer = function () {};

                this.getComponent.returns(null);

                expect(this.obj.run(createServer)).to.be.equal(this.obj);

                expect(this.createOutputHandler).to.be.calledOnce
                    .calledWithExactly(this.server);

                expect(this.registerFactory).to.be.calledOnce
                    .calledWithExactly(this.modules.module1.name, this.modules.module1.__factory);

                expect(this.process).to.be.calledTwice
                    .calledWithExactly(createServer)
                    .calledWithExactly("routeFn");

                expect(this.registerSingleton).to.be.calledThrice
                    .calledWithExactly("$server", this.server)
                    .calledWithExactly(this.modules.module2.name, this.modules.module2.__singleton)
                    .calledWith(this.module.module3.name);

                expect(this.getComponent).to.be.calledOnce
                    .calledWithExactly("$output");

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
