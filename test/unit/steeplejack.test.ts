/**
 * steeplejack.test
 */

/// <reference path="../../typings/main.d.ts" />

"use strict";


/* Node modules */
import {EventEmitter} from "events";
import * as path from "path";


/* Third-party modules */


/* Files */
import {
    expect,
    proxyquire,
    sinon
} from "../helpers/configure";
import {Inject} from "../../decorators/inject";
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

                class Strategy extends EventEmitter implements IServerStrategy {
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
                handler(req, res, () => {
                    return "result";
                })
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

                class Strategy extends EventEmitter implements IServerStrategy {
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
                handler(req, res, () => {
                    throw new Error("oh dear");
                })
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

                @Inject({
                    name: "Test"
                })
                class Test {
                    constructor (public $output: any) {}
                }

                this.Test = Test;

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
                            config: sinon.spy(),
                            name: "mod3"
                        }
                    },
                    module4: {
                        __constant: {
                            constant: {
                                hello: "world"
                            },
                            name: "mod4"
                        }
                    },
                    module5: {
                        Test: this.Test
                    }
                };

                this.Steeplejack = proxyquire("../../steeplejack", {
                    module1: this.modules.module1,
                    module2: this.modules.module2,
                    module3: this.modules.module3,
                    module4: this.modules.module4,
                    module5: this.modules.module5
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

                expect(this.obj.server).to.be.undefined;

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

            it("should run the steeplejack server successfully - $output created automatically", function (done) {

                /* Put in the modules and routes manually */
                this.obj.modules = [
                    "module1",
                    "module2",
                    "module3"
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
                    .calledWithExactly(this.modules.module1.__factory.name, this.modules.module1.__factory.factory);

                expect(this.process).to.be.calledTwice
                    .calledWithExactly(createServer)
                    .calledWithExactly("routeFn");

                expect(this.registerSingleton).to.be.calledThrice
                    .calledWithExactly("$server", this.server)
                    .calledWithExactly(this.modules.module2.__singleton.name, this.modules.module2.__singleton.singleton)
                    .calledWith(this.modules.module3.__config.name);

                expect(this.modules.module3.__config.config).to.be.calledOnce
                    .calledWithExactly({
                        config: "value"
                    });

                expect(this.getComponent).to.be.calledOnce
                    .calledWithExactly("$output");

                expect(this.obj.server).to.be.equal(this.server);

            });

            it("should run the steeplejack server successfully - $output already registered", function (done) {

                /* Put in the modules and routes manually */
                this.obj.modules = [
                    "module1",
                    "module2",
                    "module3"
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

                this.getComponent.returns({});

                expect(this.obj.run(createServer)).to.be.equal(this.obj);

                expect(this.createOutputHandler).to.be.not.be.called;

                expect(this.registerFactory).to.be.calledOnce
                    .calledWithExactly(this.modules.module1.__factory.name, this.modules.module1.__factory.factory);

                expect(this.process).to.be.calledTwice
                    .calledWithExactly(createServer)
                    .calledWithExactly("routeFn");

                expect(this.registerSingleton).to.be.calledThrice
                    .calledWithExactly("$server", this.server)
                    .calledWithExactly(this.modules.module2.__singleton.name, this.modules.module2.__singleton.singleton)
                    .calledWith(this.modules.module3.__config.name);

                expect(this.modules.module3.__config.config).to.be.calledOnce
                    .calledWithExactly({
                        config: "value"
                    });

                expect(this.getComponent).to.be.calledOnce
                    .calledWithExactly("$output");

            });

            it("should add in a plugin module", function (done) {

                let fn = () => {};

                /* Put in the modules and routes manually */
                this.obj.modules = [
                    {
                        __factory: {
                            factory: fn,
                            name: "plugin"
                        }
                    }
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

                expect(this.registerFactory).to.be.calledOnce
                    .calledWithExactly("plugin", fn);

            });

            it("should ignore when unknown register module passed in - required", function () {

                /* Put in the modules and routes manually */
                this.obj.modules = [
                    "module4"
                ];

                this.server.start.resolves();

                var createServer = function () {};

                this.getComponent.returns(null);

                this.obj.run(createServer);

                expect(this.registerFactory).to.not.be.called;

                expect(this.registerSingleton).to.be.calledOnce
                    .calledWithExactly("$server", this.server);

            });

            it("should ignore when unknown register module passed in - plugin", function () {

                /* Put in the modules and routes manually */
                this.obj.modules = [{
                    factory: {
                        factory: () => {},
                        name: "invalid"
                    }
                }];

                this.server.start.resolves();

                var createServer = function () {};

                this.getComponent.returns(null);

                this.obj.run(createServer);

                expect(this.registerFactory).to.not.be.called;

                expect(this.registerSingleton).to.be.calledOnce
                    .calledWithExactly("$server", this.server);

            });

            it("should register a factory", function (done) {

                /* Put in the modules and routes manually */
                this.obj.modules = [
                    "module5"
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
                    .calledWith("Test");

                expect(this.process).to.be.calledTwice
                    .calledWithExactly(createServer)
                    .calledWithExactly("routeFn");

                expect(this.getComponent).to.be.calledOnce
                    .calledWithExactly("$output");

                expect(this.obj.server).to.be.equal(this.server);


            });

            describe("registering classes", function () {

                it("should inspect the registration of non-factory class and no constructor dependencies", function (done) {

                    class S extends Steeplejack {
                        registerClass(module:any):Steeplejack {
                            return this._registerClass(module);
                        }
                    }

                    let obj = new S();

                    /* Override the injector register factory */
                    (<any>obj.injector).registerFactory = (moduleName:any, dependencies:any[]) => {

                        expect(moduleName).to.be.equal("TestClass");
                        expect(dependencies).to.be.an("array")
                            .have.length(1);

                        expect(dependencies[0]).to.be.a("function");

                        dependencies[0]();

                    };

                    @Inject({
                        name: "TestClass"
                    })
                    class TestClass {

                        constructor(...args:any[]) {
                            expect(args).to.be.eql([]);
                            done();
                        }

                    }

                    expect(obj.registerClass(TestClass)).to.be.equal(obj);

                });

                it("should inspect the registration of non-factory class and some constructor dependencies", function (done) {

                    class S extends Steeplejack {
                        registerClass(module:any):Steeplejack {
                            return this._registerClass(module);
                        }
                    }

                    let obj = new S();

                    /* Override the injector register factory */
                    (<any>obj.injector).registerFactory = (moduleName:any, dependencies:any[]) => {

                        expect(moduleName).to.be.equal("TestClass");
                        expect(dependencies).to.be.an("array")
                            .have.length(3);

                        expect(dependencies[0]).to.be.equal("hello");
                        expect(dependencies[1]).to.be.equal("goodbye");
                        expect(dependencies[2]).to.be.a("function");

                        dependencies[2]("arg1", "arg2");

                    };

                    @Inject({
                        name: "TestClass"
                    })
                    class TestClass {

                        constructor(hello:any, goodbye:any, ...args:any[]) {
                            expect(hello).to.be.equal("arg1");
                            expect(goodbye).to.be.equal("arg2");
                            expect(args).to.be.eql([]);
                            done();
                        }

                    }

                    expect(obj.registerClass(TestClass)).to.be.equal(obj);

                });

                it("should inspect the registration of non-factory class and no array dependencies", function (done) {

                    class S extends Steeplejack {
                        registerClass(module:any):Steeplejack {
                            return this._registerClass(module);
                        }
                    }

                    let obj = new S();

                    /* Override the injector register factory */
                    (<any>obj.injector).registerFactory = (moduleName:any, dependencies:any[]) => {

                        expect(moduleName).to.be.equal("TestClass");
                        expect(dependencies).to.be.an("array")
                            .have.length(1);

                        expect(dependencies[0]).to.be.a("function");

                        dependencies[0]();

                    };

                    @Inject({
                        name: "TestClass",
                        deps: []
                    })
                    class TestClass {

                        constructor(dep1: any, ...args: any[]) {
                            expect(dep1).to.be.undefined;
                            expect(args).to.be.eql([]);
                            done();
                        }

                    }

                    expect(obj.registerClass(TestClass)).to.be.equal(obj);

                });

                it("should inspect the registration of non-factory class and some array dependencies", function (done) {

                    class S extends Steeplejack {
                        registerClass(module:any):Steeplejack {
                            return this._registerClass(module);
                        }
                    }

                    let obj = new S();

                    /* Override the injector register factory */
                    (<any>obj.injector).registerFactory = (moduleName:any, dependencies:any[]) => {

                        expect(moduleName).to.be.equal("TestClass");
                        expect(dependencies).to.be.an("array")
                            .have.length(3);

                        expect(dependencies[0]).to.be.equal("goodbye");
                        expect(dependencies[1]).to.be.equal("hello");
                        expect(dependencies[2]).to.be.a("function");

                        dependencies[2]("arg1", "arg2");

                    };

                    @Inject({
                        name: "TestClass",
                        deps: [
                            "goodbye",
                            "hello"
                        ]
                    })
                    class TestClass {

                        constructor(hello1: any, goodbye1: any, ...args: any[]) {
                            expect(hello1).to.be.equal("arg1");
                            expect(goodbye1).to.be.equal("arg2");
                            expect(args).to.be.eql([]);
                            done();
                        }

                    }

                    expect(obj.registerClass(TestClass)).to.be.equal(obj);

                });

                it("should inspect the registration of factory class and fix a non-array as deps", function (done) {

                    class S extends Steeplejack {
                        registerClass(module:any):Steeplejack {
                            return this._registerClass(module);
                        }
                    }

                    let obj = new S();

                    @Inject({
                        name: "TestClass",
                        factory: true,
                        deps: null
                    })
                    class TestClass {
                        public static __INJECT__: any;
                    }

                    TestClass.__INJECT__.deps = null;

                    /* Override the injector register factory */
                    (<any>obj.injector).registerFactory = (moduleName:any, dependencies:any[]) => {

                        expect(moduleName).to.be.equal("TestClass");
                        expect(dependencies).to.be.an("array")
                            .have.length(1);

                        expect(dependencies[0]).to.be.a("function");

                        let module = dependencies[0]();

                        expect(module).to.be.equal(TestClass);

                        done();

                    };

                    expect(obj.registerClass(TestClass)).to.be.equal(obj);

                });

                it("should inspect the registration of factory class and no constructor dependencies", function (done) {

                    class S extends Steeplejack {
                        registerClass(module:any):Steeplejack {
                            return this._registerClass(module);
                        }
                    }

                    let obj = new S();

                    @Inject({
                        name: "TestClass",
                        factory: true
                    })
                    class TestClass {

                    }

                    /* Override the injector register factory */
                    (<any>obj.injector).registerFactory = (moduleName:any, dependencies:any[]) => {

                        expect(moduleName).to.be.equal("TestClass");
                        expect(dependencies).to.be.an("array")
                            .have.length(1);

                        expect(dependencies[0]).to.be.a("function");

                        let module = dependencies[0]();

                        expect(module).to.be.equal(TestClass);

                        done();

                    };

                    expect(obj.registerClass(TestClass)).to.be.equal(obj);

                });

                it("should inspect the registration of factory class and some constructor dependencies", function (done) {

                    class S extends Steeplejack {
                        registerClass(module:any):Steeplejack {
                            return this._registerClass(module);
                        }
                    }

                    let obj = new S();

                    @Inject({
                        name: "TestClass",
                        factory: true
                    })
                    class TestClass {

                        constructor(hello: any, goodbye: any, ...args: any[]) {
                            expect(hello).to.be.equal("arg1");
                            expect(goodbye).to.be.equal("arg2");
                            expect(args).to.be.eql([]);
                            done();
                        }

                    }

                    /* Override the injector register factory */
                    (<any>obj.injector).registerFactory = (moduleName:any, dependencies:any[]) => {

                        expect(moduleName).to.be.equal("TestClass");
                        expect(dependencies).to.be.an("array")
                            .have.length(1);

                        let module = dependencies[0]();

                        expect(module).to.be.equal(TestClass);

                        new module("arg1", "arg2");

                    };

                    expect(obj.registerClass(TestClass)).to.be.equal(obj);

                });

                it("should inspect the registration of factory class and no array dependencies", function (done) {

                    class S extends Steeplejack {
                        registerClass(module:any):Steeplejack {
                            return this._registerClass(module);
                        }
                    }

                    let obj = new S();

                    @Inject({
                        name: "TestClass",
                        deps: [],
                        factory: true
                    })
                    class TestClass {

                        constructor(dep1: any, ...args: any[]) {
                            expect(dep1).to.be.undefined;
                            expect(args).to.be.eql([]);
                            done();
                        }

                    }

                    /* Override the injector register factory */
                    (<any>obj.injector).registerFactory = (moduleName:any, dependencies:any[]) => {

                        expect(moduleName).to.be.equal("TestClass");
                        expect(dependencies).to.be.an("array")
                            .have.length(1);

                        let module = dependencies[0]();

                        expect(module).to.be.equal(TestClass);

                        new module();

                    };

                    expect(obj.registerClass(TestClass)).to.be.equal(obj);

                });

                it("should inspect the registration of factory class and some array dependencies", function (done) {

                    class S extends Steeplejack {
                        registerClass(module:any):Steeplejack {
                            return this._registerClass(module);
                        }
                    }

                    let obj = new S();

                    @Inject({
                        name: "TestClass2",
                        deps: [
                            "goodbye",
                            "hello"
                        ],
                        factory: true
                    })
                    class TestClass {

                        public goodbye: any;
                        public hello: any;

                        constructor(hello1: any, goodbye1: any, ...args: any[]) {
                            expect(hello1).to.be.equal("arg1");
                            expect(goodbye1).to.be.equal("arg2");
                            expect(args).to.be.eql([]);
                            done();
                        }

                    }

                    /* Override the injector register factory */
                    (<any>obj.injector).registerFactory = (moduleName:any, dependencies:any[]) => {

                        expect(moduleName).to.be.equal("TestClass2");
                        expect(dependencies).to.be.an("array")
                            .have.length(3);

                        expect(dependencies[0]).to.be.equal("goodbye");
                        expect(dependencies[1]).to.be.equal("hello");
                        expect(dependencies[2]).to.be.a("function");

                        /* This injection is handled automatically */
                        let module = dependencies[2]("goodbye", "hello");

                        expect(module).to.be.equal(TestClass);

                        expect(module.goodbye).to.be.equal("goodbye");
                        expect(module.hello).to.be.equal("hello");

                        new module("arg1", "arg2");

                    };

                    expect(obj.registerClass(TestClass)).to.be.equal(obj);

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
