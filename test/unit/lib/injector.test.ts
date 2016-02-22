/**
 * injector.test
 */

"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */


/* Files */
import {Base} from "../../../lib/base";
import {Injector} from "../../../lib/injector";
import {expect, sinon} from "../../helpers/configure";


describe("Injector library", function () {

    describe("Instantiation", function () {

        it("should be the correct instances", function () {

            var obj = new Injector();

            expect(obj).to.be.instanceof(Injector)
                .to.be.instanceof(Base)
                .to.be.instanceof(EventEmitter);

            expect(obj.getComponent("non-existent")).to.be.null;

        });

    });

    describe("test dependencies", function () {

        var obj: Injector;
        beforeEach(function () {
            obj = new Injector();
        });

        describe("function", function () {

            it("should process test dependencies wrapped in underscores", function () {

                var target = function (_topLevel_:any,
                                       _topLevel2_:any,
                                       _$config_:any,
                                       __config_:any,
                                       topLevel:any,
                                       topLevel2:any,
                                       $config:any,
                                       _config:any) {

                    this.exec = _topLevel_;
                    this.exec2 = _topLevel2_;
                    this.exec3 = _$config_;
                    this.exec4 = __config_;

                    this.match = _topLevel_ === topLevel;
                    this.match2 = _topLevel2_ === topLevel2;
                    this.match3 = _$config_ === $config;
                    this.match4 = __config_ === _config;

                };

                obj.registerFactory("topLevel", function () {
                        return {
                            key: "value"
                        };
                    })
                    .registerFactory("topLevel2", function () {
                        return {
                            key: "value2"
                        };
                    })
                    .registerFactory("$config", function () {
                        return {
                            key: "value3"
                        };
                    })
                    .registerFactory("_config", function () {
                        return {
                            key: "value4"
                        };
                    });

                var objTarget = obj.process(target, true);

                expect(objTarget.exec).to.be.eql({
                    key: "value"
                });

                expect(objTarget.match).to.be.true;

                expect(objTarget.exec2).to.be.eql({
                    key: "value2"
                });

                expect(objTarget.match2).to.be.true;

                expect(objTarget.exec3).to.be.eql({
                    key: "value3"
                });

                expect(objTarget.match3).to.be.true;

                expect(objTarget.exec4).to.be.eql({
                    key: "value4"
                });

                expect(objTarget.match4).to.be.true;

            });

            it("should process alnum dependencies with no underscores", function () {

                var target = function (topLevel:any, topLevel2:any) {

                    this.exec = topLevel;
                    this.exec2 = topLevel2;

                };

                obj.registerFactory("topLevel", function () {
                        return {
                            key: "value"
                        }
                    })
                    .registerFactory("topLevel2", function () {
                        return {
                            key: "value2"
                        }
                    });

                var objTarget = obj.process(target, true);

                expect(objTarget.exec).to.be.eql({
                    key: "value"
                });

                expect(objTarget.exec2).to.be.eql({
                    key: "value2"
                });

            });

            it("should process test dependencies wrapped in non-wrapping underscores", function () {

                /* Use array to pass linting */
                var target = [
                    "_topLevel",
                    "topLevel2_",
                    "$_config",
                    "_$config",
                    function (topLevel:any, topLevel2:any, $config:any, $config2:any) {

                        this.exec = topLevel;
                        this.exec2 = topLevel2;
                        this.exec3 = $config;
                        this.exec4 = $config2;

                    }];

                obj.registerFactory("_topLevel", function () {
                        return {
                            key: "value"
                        }
                    })
                    .registerFactory("topLevel2_", function () {
                        return {
                            key: "value2"
                        }
                    })
                    .registerFactory("$_config", function () {
                        return {
                            key: "value3"
                        }
                    })
                    .registerFactory("_$config", function () {
                        return {
                            key: "value4"
                        }
                    });

                var objTarget = obj.process(target, true);

                expect(objTarget.exec).to.be.eql({
                    key: "value"
                });

                expect(objTarget.exec2).to.be.eql({
                    key: "value2"
                });

                expect(objTarget.exec3).to.be.eql({
                    key: "value3"
                });

                expect(objTarget.exec4).to.be.eql({
                    key: "value4"
                });

            });

        });

        describe("class", function () {

            it("should process test dependencies wrapped in underscores", function () {

                class target {
                    public exec: any;
                    public exec2: any;
                    public exec3: any;
                    public exec4: any;
                    public match: any;
                    public match2: any;
                    public match3: any;
                    public match4: any;
                    constructor(_topLevel_:any,
                                _topLevel2_:any,
                                _$config_:any,
                                __config_:any,
                                topLevel:any,
                                topLevel2:any,
                                $config:any,
                                _config:any) {

                        this.exec = _topLevel_;
                        this.exec2 = _topLevel2_;
                        this.exec3 = _$config_;
                        this.exec4 = __config_;

                        this.match = _topLevel_ === topLevel;
                        this.match2 = _topLevel2_ === topLevel2;
                        this.match3 = _$config_ === $config;
                        this.match4 = __config_ === _config;

                    }
                }

                obj.registerFactory("topLevel", function () {
                        return {
                            key: "value"
                        };
                    })
                    .registerFactory("topLevel2", function () {
                        return {
                            key: "value2"
                        };
                    })
                    .registerFactory("$config", function () {
                        return {
                            key: "value3"
                        };
                    })
                    .registerFactory("_config", function () {
                        return {
                            key: "value4"
                        };
                    });

                var objTarget = obj.process(target, true);

                expect(objTarget.exec).to.be.eql({
                    key: "value"
                });

                expect(objTarget.match).to.be.true;

                expect(objTarget.exec2).to.be.eql({
                    key: "value2"
                });

                expect(objTarget.match2).to.be.true;

                expect(objTarget.exec3).to.be.eql({
                    key: "value3"
                });

                expect(objTarget.match3).to.be.true;

                expect(objTarget.exec4).to.be.eql({
                    key: "value4"
                });

                expect(objTarget.match4).to.be.true;

            });

            it("should process alnum dependencies with no underscores", function () {

                class target {
                    public exec: any;
                    public exec2: any;
                    constructor (topLevel:any, topLevel2:any) {
                        this.exec = topLevel;
                        this.exec2 = topLevel2;
                    }
                }

                obj.registerFactory("topLevel", function () {
                        return {
                            key: "value"
                        }
                    })
                    .registerFactory("topLevel2", function () {
                        return {
                            key: "value2"
                        }
                    });

                var objTarget = obj.process(target, true);

                expect(objTarget.exec).to.be.eql({
                    key: "value"
                });

                expect(objTarget.exec2).to.be.eql({
                    key: "value2"
                });

            });

            it("should process test dependencies wrapped in non-wrapping underscores", function () {

                /* Use array to pass linting */
                var target = [
                    "_topLevel",
                    "topLevel2_",
                    "$_config",
                    "_$config",
                    class MyClass {
                        public exec: any;
                        public exec2: any;
                        public exec3: any;
                        public exec4: any;
                        constructor (topLevel:any, topLevel2:any, $config:any, $config2:any) {

                            this.exec = topLevel;
                            this.exec2 = topLevel2;
                            this.exec3 = $config;
                            this.exec4 = $config2;

                        }
                    }
                ];

                obj.registerFactory("_topLevel", function () {
                        return {
                            key: "value"
                        }
                    })
                    .registerFactory("topLevel2_", function () {
                        return {
                            key: "value2"
                        }
                    })
                    .registerFactory("$_config", function () {
                        return {
                            key: "value3"
                        }
                    })
                    .registerFactory("_$config", function () {
                        return {
                            key: "value4"
                        }
                    });

                var objTarget = obj.process(target, true);

                expect(objTarget.exec).to.be.eql({
                    key: "value"
                });

                expect(objTarget.exec2).to.be.eql({
                    key: "value2"
                });

                expect(objTarget.exec3).to.be.eql({
                    key: "value3"
                });

                expect(objTarget.exec4).to.be.eql({
                    key: "value4"
                });

            });

        });

    });

    describe("methods", function () {

        describe("#process", function () {

            var obj: Injector;
            beforeEach(function () {
                obj = new Injector();
            });

            describe("dependencies gotten from the function", function () {

                describe("function", function () {

                    it("should process a target that has no dependencies", function () {

                        var target = function () {
                        };

                        expect(obj.process(target)).to.be.instanceof(target);

                    });

                    it("should process a target that has a top-level dependency", function () {

                        var target = function (topLevel:any) {

                            this.exec = topLevel;

                        };

                        obj.registerSingleton("topLevel", function () {
                            return "hello";
                        });
                        obj.registerSingleton("ignore", function () {
                            throw new Error("ignored");
                        });

                        let objTarget = obj.process(target);
                        expect(objTarget).to.be.instanceof(target);
                        expect(objTarget.exec()).to.be.equal("hello");

                    });

                    it("should process a target that has a multiple top-level dependencies", function () {

                        var target = function (topLevel:any, otherFunc:any) {

                            this.exec = topLevel;
                            this.otherFunc = otherFunc;

                        };

                        obj.registerSingleton("topLevel", function () {
                            return "hello";
                        });
                        obj.registerSingleton("otherFunc", function () {
                            return "otherFunc";
                        });

                        var objTarget = obj.process(target);
                        expect(objTarget).to.be.instanceof(target);
                        expect(objTarget.exec()).to.be.equal("hello");
                        expect(objTarget.otherFunc()).to.be.equal("otherFunc");

                    });

                    it("should get a constructor dependency", function () {

                        var target = function (topLevel:any) {

                            this.exec = topLevel;

                        };

                        obj.registerFactory("topLevel", function () {
                            return {
                                key: "value"
                            }
                        });

                        var objTarget = obj.process(target);

                        expect(objTarget.exec).to.be.eql({
                            key: "value"
                        });

                    });

                    it("should process stacked dependencies", function () {

                        var target = function (topLevel:any) {

                            this.exec = topLevel;

                        };

                        obj.registerFactory("topLevel", function (bottomLevel:any) {
                            return bottomLevel;
                        });
                        obj.registerSingleton("bottomLevel", function () {
                            return "lowerLevel";
                        });

                        var objTarget = obj.process(target);

                        expect(objTarget.exec()).to.be.equal("lowerLevel");

                    });

                    it("should replace underscored variables if it's a test", function () {

                        var target = function (_topLevel_:any) {

                            this.exec = _topLevel_;

                        };

                        obj.registerFactory("topLevel", function (bottomLevel:any) {
                            return bottomLevel;
                        });
                        obj.registerSingleton("bottomLevel", function () {
                            return "lowerLevel";
                        });

                        var objTarget = obj.process(target, true);

                        expect(objTarget.exec()).to.be.equal("lowerLevel");

                    });

                    it("should throw an error if dependency is missing", function () {

                        var target = function (topLevel:any, otherFunc:any) {

                            this.exec = topLevel;
                            this.otherFunc = otherFunc;

                        };

                        obj.registerSingleton("topLevel", function () {
                            return "hello";
                        });

                        var fail = false;
                        try {
                            var objTarget = obj.process(target);
                        } catch (err) {
                            fail = true;

                            expect(err).to.be.instanceof(Error);
                            expect(err.message).to.be.equal("Missing dependency: otherFunc");
                        }

                        expect(fail).to.be.true;

                    });

                });

                describe("class", function () {

                    it("should process a target that has no dependencies", function () {

                        class Target {
                            constructor () {
                            }
                        }

                        expect(obj.process(Target)).to.be.instanceof(Target);

                    });

                    it("should process a target that has a top-level dependency", function () {

                        class Target {
                            public exec: any;
                            constructor (topLevel: any) {
                                this.exec = topLevel;
                            }
                        }

                        obj.registerSingleton("topLevel", function () {
                            return "hello";
                        });
                        obj.registerSingleton("ignore", function () {
                            throw new Error("ignored");
                        });

                        let objTarget = obj.process(Target);
                        expect(objTarget).to.be.instanceof(Target);
                        expect(objTarget.exec()).to.be.equal("hello");

                    });

                    it("should process a target that has a multiple top-level dependencies", function () {

                        class Target {
                            public exec: any;
                            public otherFunc : any;
                            constructor(topLevel:any, otherFunc:any) {

                                this.exec = topLevel;
                                this.otherFunc = otherFunc;
                            }
                        }

                        obj.registerSingleton("topLevel", function () {
                            return "hello";
                        });
                        obj.registerSingleton("otherFunc", function () {
                            return "otherFunc";
                        });

                        var objTarget = obj.process(Target);
                        expect(objTarget).to.be.instanceof(Target);
                        expect(objTarget.exec()).to.be.equal("hello");
                        expect(objTarget.otherFunc()).to.be.equal("otherFunc");

                    });

                    it("should get a constructor dependency", function () {

                        class Target {
                            exec: any;
                            constructor (topLevel: any) {
                                this.exec = topLevel;
                            }
                        }

                        obj.registerFactory("topLevel", function () {
                            return {
                                key: "value"
                            }
                        });

                        var objTarget = obj.process(Target);

                        expect(objTarget.exec).to.be.eql({
                            key: "value"
                        });

                    });

                    it("should process stacked dependencies", function () {

                        class Target {
                            public exec: any;
                            constructor (topLevel: any) {
                                this.exec = topLevel;
                            }
                        }

                        obj.registerFactory("topLevel", function (bottomLevel: any) {
                            return bottomLevel;
                        });
                        obj.registerSingleton("bottomLevel", function () {
                            return "lowerLevel";
                        });

                        var objTarget = obj.process(Target);

                        expect(objTarget.exec()).to.be.equal("lowerLevel");

                    });

                    it("should replace underscored variables if it's a test", function () {

                        class Target {
                            public exec: any;
                            constructor (_topLevel_: any) {
                                this.exec = _topLevel_;
                            }
                        }

                        obj.registerFactory("topLevel", function (bottomLevel: any) {
                            return bottomLevel;
                        });
                        obj.registerSingleton("bottomLevel", function () {
                            return "lowerLevel";
                        });

                        var objTarget = obj.process(Target, true);

                        expect(objTarget.exec()).to.be.equal("lowerLevel");

                    });

                    it("should throw an error if dependency is missing", function () {

                        class Target {
                            public exec:any;
                            public otherFunc:any;

                            constructor(topLevel:any, otherFunc:any) {
                                this.exec = topLevel;
                                this.otherFunc = otherFunc;
                            }
                        }

                        obj.registerSingleton("topLevel", function () {
                            return "hello";
                        });

                        var fail = false;
                        try {
                            var objTarget = obj.process(Target);
                        } catch (err) {
                            fail = true;

                            expect(err).to.be.instanceof(Error);
                            expect(err.message).to.be.equal("Missing dependency: otherFunc");
                        }

                        expect(fail).to.be.true;

                    });

                });

            });

            describe("dependencies defined in an array", function () {

                it("should process a target that has a top-level dependency and is not instance of Base", function () {

                    var target = ["topLevel", function (a: any) {

                        this.exec = a;

                    }];

                    obj.registerSingleton("topLevel", function () {
                        return "hello";
                    });

                    var objTarget = obj.process(target);

                    expect(objTarget).to.be.instanceof(target[1]);
                    expect(objTarget.exec()).to.be.equal("hello");

                });

                it("should process a target that had a top-level dependency and a function", function () {

                    var target = ["topLevel", function (a: any) {

                        this.exec = a;

                    }];

                    obj.registerFactory("topLevel", ["bottomLevel", function (b: any) {
                        return b;
                    }]);
                    obj.registerSingleton("bottomLevel", function () {
                        return "lowerLevel";
                    });

                    var objTarget = obj.process(target);

                    expect(objTarget.exec()).to.be.equal("lowerLevel");

                });

                it("should replace underscored variables if it's a test", function () {

                    var target = ["_topLevel_", function (a: any) {

                        this.exec = a;

                    }];

                    obj.registerFactory("topLevel", ["bottomLevel", function (b: any) {
                        return b;
                    }]);
                    obj.registerSingleton("bottomLevel", function () {
                        return "lowerLevel";
                    });

                    var objTarget = obj.process(target, true);

                    expect(objTarget.exec()).to.be.equal("lowerLevel");

                });

                it("should throw an error if the final array item is not a function", function () {

                    var target = ["item1", "item2"];

                    var fail = false;

                    try {
                        obj.process(target);
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(SyntaxError);
                        expect(err.message).to.be.equal("No constructor function in injector array");

                    } finally {
                        expect(fail).to.be.true;
                    }

                });

                it("should throw an error if non-array or non-function passed into process", function () {

                    [
                        2,
                        2.3,
                        "hello",
                        {hello: "world"},
                        null,
                        undefined
                    ].forEach(function (item) {

                        var fail = false;

                        try {
                            obj.process(item);
                        } catch (err) {

                            fail = true;

                            expect(err).to.be.instanceof(TypeError);
                            expect(err.message).to.be.equal("Injectable constructor must be an array or function");

                        } finally {
                            expect(fail).to.be.true;
                        }

                    });

                });

            });

        });

        describe("#_registerComponent", function () {

            var obj: any;
            beforeEach(function () {

                class TestInjector extends Injector {

                    regComp (name: string, factory: any, instance: any) {
                        return this._registerComponent(name, factory, instance);
                    }

                }

                obj = new TestInjector();
            });

            it("should throw an error if a name isn't set", function () {

                let fail = false;

                try {
                    obj.regComp();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("Name is required to register a component");
                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should throw an error if neither factory or instance sent in", function () {

                let fail = false;

                try {
                    obj.regComp("item");
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("Either one of factory and instance must be registered");
                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should throw an error if both factory and instance sent in", function () {

                let fail = false;

                try {
                    obj.regComp("item", function () { }, {});
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("Cannot register both factory and instance");
                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

        describe("#registerFactory", function () {

            var obj: Injector;
            beforeEach(function () {
                obj = new Injector();
            });

            it("should register a factory function", function () {

                expect(obj.registerFactory("date", Date)).to.be.equal(obj);

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    factory: Date,
                    instance: null
                });

            });

            it("should throw an error if name already registered", function () {

                obj.registerFactory("date", Date);

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    factory: Date,
                    instance: null
                });

                var fail = false;

                try {
                    obj.registerFactory("date", Date);
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("Component 'date' is already registered");
                }

                expect(fail).to.be.true;

            });

            it("should throw an error if non-function passed", function () {

                var fail = false;
                try {
                    obj.registerFactory("date", new Date());
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("Factory 'date' can only accept a function or an array");
                }

                expect(fail).to.be.true;

            });

        });

        describe("#registerSingleton", function () {

            var obj: Injector,
                date: Date;
            beforeEach(function () {
                obj = new Injector();
                date = new Date();
            });

            it("should register a singleton function", function () {

                expect(obj.registerSingleton("date", date)).to.be.equal(obj);

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    factory: null,
                    instance: date
                });

            });

            it("should throw an error if name already registered", function () {

                obj.registerSingleton("date", date);

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    factory: null,
                    instance: date
                });

                var fail = false;

                try {
                    obj.registerSingleton("date", date);
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("Component 'date' is already registered");
                }

                expect(fail).to.be.true;

            });

            it("should accept a string", function () {

                obj.registerSingleton("date", "some date");

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    factory: null,
                    instance: "some date"
                });


            });

            it("should accept a boolean", function () {

                obj.registerSingleton("date", true);

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    factory: null,
                    instance: true
                });


            });

            it("should accept a number", function () {

                obj.registerSingleton("date", 34.5);

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    factory: null,
                    instance: 34.5
                });


            });

        });

        describe("#remove", function () {

            var obj: Injector;
            beforeEach(function () {
                obj = new Injector();
            });

            it("should return this when module not registered", function () {

                expect(obj.remove("module")).to.be.equal(obj);

            });

            it("should remove a factory that's registered", function () {

                obj.registerFactory("module", function () { })
                    .registerFactory("module2", function () { });

                expect(obj.getComponent("module")).to.not.be.null;
                expect(obj.getComponent("module2")).to.not.be.null;

                expect(obj.remove("module")).to.be.equal(obj);

                expect(obj.getComponent("module")).to.be.null;
                expect(obj.getComponent("module2")).to.not.be.null;

            });

            it("should remove a singleton that's registered", function () {

                obj.registerSingleton("singleton", "hello")
                    .registerSingleton("singleton2", "hello");

                expect(obj.getComponent("singleton")).to.not.be.null;
                expect(obj.getComponent("singleton2")).to.not.be.null;

                expect(obj.remove("singleton")).to.be.equal(obj);

                expect(obj.getComponent("singleton")).to.be.null;
                expect(obj.getComponent("singleton2")).to.not.be.null;

            });

        });

        describe("#replace", function () {

            var obj: any;
            beforeEach(function () {

                class TestInjector extends Injector {

                    updateComponents (name: string, data: IInjectorComponentItem) {
                        this._components[name] = data;
                    }

                }

                obj = new TestInjector();
                sinon.stub(obj, "registerFactory");
                sinon.stub(obj, "registerSingleton");
                sinon.stub(obj, "remove");

            });

            it("should replace a module with a new module", function () {

                /* Register directly as stubbing the register functions */
                obj.updateComponents("module", {
                    factory: function Old () {},
                    instance: null
                });

                var fn = function New () { };

                expect(obj.replace("module", fn)).to.be.equal(obj);

                expect(obj.registerFactory).to.be.calledOnce
                    .calledWithExactly("module", fn);

                expect(obj.remove).to.be.calledOnce
                    .calledWithExactly("module");

                expect(obj.registerSingleton).to.not.be.called;

            });

            it("should replace a singleton with a new singleton", function () {

                /* Register directly as stubbing the register functions */
                obj.updateComponents("module", {
                    factory: null,
                    instance: "old"
                });

                expect(obj.replace("module", "new")).to.be.equal(obj);

                expect(obj.registerSingleton).to.be.calledOnce
                    .calledWithExactly("module", "new");

                expect(obj.remove).to.be.calledOnce
                    .calledWithExactly("module");

                expect(obj.registerFactory).to.not.be.called;

            });

            it("should throw an error when trying to register something that doesn't exist", function () {

                var fail = false;

                try {
                    obj.replace("module");
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be
                        .equal("Component 'module' cannot be replaced as it's not currently registered");

                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

    });

    describe("static methods", function () {

        describe("#getTargetDependencies", function () {

            it("should throw an error when a non-function/array passed in", function () {

                let fail = false;

                try {
                    Injector.getTargetDependencies("string");
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("Injectable constructor must be an array or function");
                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should throw an error if ES5 constructor not a function", function () {

                function Test () {}

                Test.prototype._construct = "fail";

                let fail = false;

                try {
                    Injector.getTargetDependencies([Test]);
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("No constructor function in injector array");
                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should throw an error if constructor not a function", function () {

                let fail = false;

                try {
                    Injector.getTargetDependencies(["string"]);
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("No constructor function in injector array");
                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should use array dependencies", function () {

                class Test {}

                expect(Injector.getTargetDependencies([
                    "",
                    " hello ",
                    "    ohMe",
                    "   ",
                    Test
                ])).to.be.eql({
                    dependencies: [
                        "hello",
                        "ohMe"
                    ],
                    target: Test
                });

            });

            it("should get dependencies in an ES5 constructor", function () {

                function Test () {}

                Test.prototype._construct = (hello: any, goodbye: any) => {};

                expect(Injector.getTargetDependencies(Test)).to.be.eql({
                    dependencies: [
                        "hello",
                        "goodbye"
                    ],
                    target: Test.prototype._construct
                });

            });

            it("should get dependencies in a class constructor", function () {

                class Test {
                    constructor (ohMe: any, ohMy: any) {}
                }

                expect(Injector.getTargetDependencies(Test)).to.be.eql({
                    dependencies: [
                        "ohMe",
                        "ohMy"
                    ],
                    target: Test
                });

            });

        });

    });

});
