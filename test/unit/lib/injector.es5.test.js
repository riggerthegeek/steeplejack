/**
 * injector.es5.test
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var Base = require("../../../lib/base").Base;
var Injector = require("../../../lib/injector").Injector;
var expect = require("../../helpers/configure").expect;


describe("Injector ES5 test", function () {

    var obj;
    beforeEach(function () {
        obj = new Injector();
    });

    describe("test dependencies", function () {

        it("should process test dependencies wrapped in underscores", function () {

            var target = Base.extend({
                _construct:function (_topLevel_,
                                     _topLevel2_,
                                     _$config_,
                                     __config_,
                                     topLevel,
                                     topLevel2,
                                     $config,
                                     _config) {

                    this.exec = _topLevel_;
                    this.exec2 = _topLevel2_;
                    this.exec3 = _$config_;
                    this.exec4 = __config_;

                    this.match = _topLevel_ === topLevel;
                    this.match2 = _topLevel2_ === topLevel2;
                    this.match3 = _$config_ === $config;
                    this.match4 = __config_ === _config;

                }
            });

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

            var target = Base.extend({
                _construct: function (topLevel, topLevel2) {

                    this.exec = topLevel;
                    this.exec2 = topLevel2;

                }
            });

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

            var myClass = Base.extend({
                _construct: function (topLevel, topLevel2, $config, $config2) {

                    this.exec = topLevel;
                    this.exec2 = topLevel2;
                    this.exec3 = $config;
                    this.exec4 = $config2;

                }
            });

            /* Use array to pass linting */
            var target = [
                "_topLevel",
                "topLevel2_",
                "$_config",
                "_$config",
                myClass];

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

    describe("Methods", function () {

        describe("#process", function () {

            describe("ES5 class", function () {

                it("should process a target that has no dependencies", function () {

                    var Target = Base.extend({});

                    expect(obj.process(Target)).to.be.instanceof(Target);

                });

                it("should process a target that has a top-level dependency", function () {

                    var Target = Base.extend({
                        _construct: function (topLevel) {
                            this.exec = topLevel;
                        }
                    });

                    obj.registerSingleton("topLevel", function topLevel () {
                        return "hello";
                    });
                    obj.registerSingleton("ignore", function () {
                        throw new Error("ignored");
                    });

                    var objTarget = obj.process(Target);
                    expect(objTarget.exec()).to.be.equal("hello");

                });

                it("should process a target that has a multiple top-level dependencies", function () {

                    var Target = Base.extend({
                        _construct: function (topLevel, otherFunc) {

                            this.exec = topLevel;
                            this.otherFunc = otherFunc;
                        }
                    });

                    obj.registerSingleton("topLevel", function () {
                        return "hello";
                    });
                    obj.registerSingleton("otherFunc", function () {
                        return "otherFunc";
                    });

                    var objTarget = obj.process(Target);
                    expect(objTarget.exec()).to.be.equal("hello");
                    expect(objTarget.otherFunc()).to.be.equal("otherFunc");

                });

                it("should get a constructor dependency", function () {

                    var Target = Base.extend({
                        _construct: function (topLevel) {
                            this.exec = topLevel;
                        }
                    });

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

                    var Target = Base.extend({
                        _construct: function (topLevel) {
                            this.exec = topLevel;
                        }
                    });

                    obj.registerFactory("topLevel", function (bottomLevel) {
                        return bottomLevel;
                    });
                    obj.registerSingleton("bottomLevel", function () {
                        return "lowerLevel";
                    });

                    var objTarget = obj.process(Target);

                    expect(objTarget.exec()).to.be.equal("lowerLevel");

                });

                it("should replace underscored variables if it's a test", function () {

                    var Target = Base.extend({
                        _construct: function (_topLevel_) {
                            this.exec = _topLevel_;
                        }
                    });

                    obj.registerFactory("topLevel", function (bottomLevel) {
                        return bottomLevel;
                    });
                    obj.registerSingleton("bottomLevel", function () {
                        return "lowerLevel";
                    });

                    var objTarget = obj.process(Target, true);

                    expect(objTarget.exec()).to.be.equal("lowerLevel");

                });

                it("should throw an error if dependency is missing", function () {

                    var Target = Base.extend({
                        _construct: function (topLevel, otherFunc) {
                            this.exec = topLevel;
                            this.otherFunc = otherFunc;
                        }
                    });

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

    });

});
