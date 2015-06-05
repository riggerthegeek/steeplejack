/**
 * Injector
 */

"use strict";


/* Node modules */
var EventEmitter = require("events").EventEmitter;


/* Third-party modules */


/* Files */
var Injector = rootRequire("src/library/Injector");
var Base = rootRequire("src/library/Base");


describe("Injector test", function () {

    describe("Instantiation", function () {

        it("should be the correct instances", function (done) {

            var obj = new Injector();

            expect(obj).to.be.instanceof(Injector).to.be.instanceof(Base).to.be.instanceof(EventEmitter);

            expect(obj.getComponent("non-existent")).to.be.null;
            expect(obj.getComponent({})).to.be.null;

            done();

        });

    });

    describe("Processing", function () {

        var obj;
        beforeEach(function () {
            obj = new Injector();
        });

        it("should process a target that has no dependencies", function (done) {

            var target = function () {

            };

            expect(obj.process(target)).to.be.instanceof(target);

            done();

        });

        it("should process a target that has a top-level dependency and is instanceof Base", function (done) {

            var target = Base.extend({

                _construct: function (topLevel) {

                    this.exec = topLevel;

                }

            });

            obj.registerSingleton("topLevel", function () {
                return "hello";
            });

            var objTarget = obj.process(target);

            expect(objTarget).to.be.instanceof(target);
            expect(objTarget.exec()).to.be.equal("hello");

            done();

        });

        it("should process a target that has a top-level dependency and on a custom scope", function () {

            var target = function () {

                return this;

            };

            expect(obj.process(target, {
                value: "2"
            })).to.be.eql({
                    value: "2"
                });

        });

        it("should process a target that has a top-level dependency", function (done) {

            var target = function (topLevel) {

                this.exec = topLevel;

            };

            obj.registerSingleton("topLevel", function () {
                return "hello";
            })
            obj.registerSingleton("ignore", function () {
                throw new Error("ignored");
            })

            var objTarget = obj.process(target);
            expect(objTarget).to.be.instanceof(target);
            expect(objTarget.exec()).to.be.equal("hello");

            done();

        });

        it("should process a target that has a multiple top-level dependencies", function (done) {

            var target = function (topLevel, otherFunc) {

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

            done();

        });

        it("should process a target that has a multiple top-level dependencies and is instanceof Base", function (done) {

            var target = Base.extend({

                _construct: function (topLevel, otherFunc) {

                    this.exec = topLevel;
                    this.otherFunc = otherFunc;

                }

            });

            obj.registerSingleton("topLevel", function () {
                return "hello";
            })
            obj.registerSingleton("otherFunc", function () {
                return "otherFunc";
            });

            var objTarget = obj.process(target);

            expect(objTarget).to.be.instanceof(target);
            expect(objTarget.exec()).to.be.equal("hello");
            expect(objTarget.otherFunc()).to.be.equal("otherFunc");

            done();

        });

        it("should get a constructor dependency", function (done) {

            var target = function (topLevel) {

                this.exec = topLevel;

            };

            obj.register("topLevel", function () {
                return {
                    key: "value"
                }
            });

            var objTarget = obj.process(target);

            expect(objTarget.exec).to.be.eql({
                key: "value"
            });

            done();

        });

        it("should process stacked dependencies", function (done) {

            var target = function (topLevel) {

                this.exec = topLevel;

            };

            obj.register("topLevel", function (bottomLevel) {
                return bottomLevel;
            });
            obj.registerSingleton("bottomLevel", function () {
                return "lowerLevel";
            })

            var objTarget = obj.process(target);

            expect(objTarget.exec()).to.be.equal("lowerLevel");

            done();

        });

        it("should throw an error if dependency is missing", function (done) {

            var target = function (topLevel, otherFunc) {

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

            done();

        });

    });

    describe("Registration", function () {

        var obj;
        beforeEach(function () {
            obj = new Injector();
        });

        describe("Constructor functions", function () {

            it("should register a constructor function", function (done) {

                expect(obj.register("date", Date)).to.be.equal(obj);

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    constructor: Date,
                    instance: null
                });

                done();

            });

            it("should throw an error if name already registered", function (done) {

                obj.register("date", Date);

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    constructor: Date,
                    instance: null
                });

                var fail = false;

                try {
                    obj.register("date", Date);
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("Component 'date' already registered");
                }

                expect(fail).to.be.true;

                done();

            });

            it("should throw an error if non-function passed", function (done) {

                var fail = false;
                try {
                    obj.register("date", new Date());
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("Component 'date' is not a function");
                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe("Singleton functions", function () {

            var date = new Date();

            it("should register a singleton function", function (done) {

                expect(obj.registerSingleton("date", date)).to.be.equal(obj);

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    constructor: null,
                    instance: date
                });

                done();

            });

            it("should throw an error if name already registered", function (done) {

                obj.registerSingleton("date", date);

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    constructor: null,
                    instance: date
                });

                var fail = false;

                try {
                    obj.registerSingleton("date", date);
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("Singleton 'date' already registered");
                }

                expect(fail).to.be.true;

                done();

            });

            it("should accept a string", function () {

                obj.registerSingleton("date", "some date");

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    constructor: null,
                    instance: "some date"
                });


            });

            it("should accept a boolean", function () {

                obj.registerSingleton("date", true);

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    constructor: null,
                    instance: true
                });


            });

            it("should accept a number", function () {

                obj.registerSingleton("date", 34.5);

                expect(obj.getComponent("date")).to.be.an("object").to.be.eql({
                    constructor: null,
                    instance: 34.5
                });


            });

        });

    });

    describe("Static methods", function () {

        describe("#Parser", function () {

            var func;
            beforeEach(function () {
                func = function testFunction () {
                }
            });

            describe("input only", function () {

                it("should output an empty object when nothing passed in", function () {

                    var obj = Injector.Parser();

                    expect(obj).to.be.eql({});

                });

                it("should output the object with a single-level input object", function () {

                    var obj = Injector.Parser({
                        key1: func,
                        key2: func
                    });

                    expect(obj).to.be.eql({
                        key1: func,
                        key2: func
                    });

                });

                it("should receive a multi-layered input object", function () {

                    var obj = Injector.Parser({
                        key1: func,
                        key2: {
                            inner1: func,
                            inner2: func
                        }
                    });

                    expect(obj).to.be.eql({
                        key1: func,
                        key2Inner1: func,
                        key2Inner2: func
                    });

                });

            });

            describe("Input and prefix", function () {

                it("should output the object with a single-level input object", function () {

                    var obj = Injector.Parser({
                        key1: func,
                        key2: func
                    }, "$");

                    expect(obj).to.be.eql({
                        "$key1": func,
                        "$key2": func
                    });

                });

                it("should receive a multi-layered input object", function () {

                    var obj = Injector.Parser({
                        key1: func,
                        key2: {
                            inner1: func,
                            inner2: func
                        }
                    }, "$");

                    expect(obj).to.be.eql({
                        "$key1": func,
                        "$key2Inner1": func,
                        "$key2Inner2": func
                    });

                });

                it("should ignore a non-string prefix", function () {

                    [
                        null,
                        undefined,
                        {},
                        [],
                        new Date()
                    ].forEach(function (prefix) {
                        var obj = Injector.Parser({
                            key1: func,
                            key2: {
                                inner1: func,
                                inner2: func
                            }
                        }, prefix);

                        expect(obj).to.be.eql({
                            key1: func,
                            key2Inner1: func,
                            key2Inner2: func
                        });

                    });

                });

            });

            describe("Input and suffix", function () {

                it("should output the object with a single-level input object", function () {

                    var obj = Injector.Parser({
                        key1: func,
                        key2: func
                    }, null, "end");

                    expect(obj).to.be.eql({
                        key1End: func,
                        key2End: func
                    });

                });

                it("should receive a multi-layered input object", function () {

                    var obj = Injector.Parser({
                        key1: func,
                        key2: {
                            inner1: func,
                            inner2: func
                        }
                    }, null, "end");

                    expect(obj).to.be.eql({
                        key1End: func,
                        key2Inner1End: func,
                        key2Inner2End: func
                    });

                });

                it("should ignore a non-string suffix", function () {

                    [
                        null,
                        undefined,
                        {},
                        [],
                        new Date()
                    ].forEach(function (suffix) {
                        var obj = Injector.Parser({
                            key1: func,
                            key2: {
                                inner1: func,
                                inner2: func
                            }
                        }, null, suffix);

                        expect(obj).to.be.eql({
                            key1: func,
                            key2Inner1: func,
                            key2Inner2: func
                        });

                    });

                });

            });

            describe("Input, prefix and suffix", function () {

                it("should do a prefix and a suffix", function () {

                    var obj = Injector.Parser({
                        key1: func,
                        key2: {
                            inner1: func,
                            inner2: func
                        }
                    }, "$", "end");

                    expect(obj).to.be.eql({
                        $key1End: func,
                        $key2Inner1End: func,
                        $key2Inner2End: func
                    });

                });

            });

            describe("Not flattening the input", function () {

                it("should receive input and not flatten it", function () {

                    var obj = Injector.Parser({
                        obj1: {
                            key: "value"
                        },
                        obj2: {
                            obj: {
                                key: "value"
                            }
                        }
                    }, "$", "END", false);

                    expect(obj).to.be.eql({
                        $obj1End: {
                            key: "value"
                        },
                        $obj2End: {
                            obj: {
                                key: "value"
                            }
                        }
                    });

                });

            });

        });

    });

});
