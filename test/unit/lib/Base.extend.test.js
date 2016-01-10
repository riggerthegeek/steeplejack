/**
 * Base.extend.test
 *
 * Written in JS as it's difficult getting
 * it to work in TypeScript as not designed
 * that way.
 */

"use strict";


/* Node modules */
var EventEmitter = require("events").EventEmitter;


/* Third-party modules */


/* Files */
var Base = require("../../../lib/Base").Base;
var expect = require("../../helpers/configure").expect;


describe("Base.extend ES5 test", function () {

    describe("#constructor", function () {

        it("should call the __construct function when set", function () {

            var called = false;

            var Child = Base.extend({

                __construct: function (arg1, arg2, arg3, arg4, arg5, arg6) {

                    called = true;

                    expect(arguments.length).to.be.equal(6);

                    expect(arg1).to.be.equal("string");
                    expect(arg2).to.be.equal(23);
                    expect(arg3).to.be.true;
                    expect(arg4).to.be.eql([]);
                    expect(arg5).to.be.eql({});
                    expect(arg6).to.be.a("function");

                }

            });

            var obj = new Child("string", 23, true, [], {}, function () {});

            expect(obj).to.be.instanceof(Base)
                .to.be.instanceof(EventEmitter);

            expect(called).to.be.true;

        });

    });

    describe("#extend", function () {

        it("should allow extension of this class", function () {

            var Child = Base.extend();

            var obj = new Child();

            expect(obj).to.be.instanceof(Child)
                .instanceof(Base)
                .instanceof(EventEmitter);

        });

        it("should allow extension as an ES5 class, with no parameters set", function () {

            var Child = Base.extend({

                values: {},

                setValue: function (key, value) {
                    this.values[key] = value;
                    return true;
                }

            });

            var obj = new Child();

            expect(obj.values).to.be.an("object").to.be.empty;
            expect(obj.setValue("key", "value")).to.be.true;
            expect(obj.values).to.be.eql({
                key: "value"
            });

        });

        it("should allow extension as an ES5 class, with static properties", function () {

            var Child = Base.extend({}, {

                method: function () {
                    return "hello";
                }

            });

            expect(Child.method()).to.be.equal("hello");

        });

        it("should allow extension as an ES5 class, with a custom constructor", function () {

            var Child = Base.extend({

                __construct: function (values) {
                    if (values) {
                        for (var key in values) {
                            this.setValue(key, values[key]);
                        }
                    }
                },

                values: {},

                setValue: function (key, value) {
                    this.values[key] = value;
                    return true;
                }

            });

            var obj = new Child({
                key: "value",
                key2: "value2"
            });

            expect(obj.values).to.be.eql({
                key: "value",
                key2: "value2"
            });


        });

        it("should allow further extension of a class and calling of parent methods", function () {

            var Child = Base.extend({

                value: void 0,

                setValue: function (value) {
                    this.value = value;
                },

                getString: function () {
                    return "childstring";
                }

            });

            var Grandchild = Child.extend({

                cValue: void 0,

                setCvalue: function (value) {
                    this.cValue = value;
                },

                getString: function () {
                    return this.super_.getString.call(this);
                }

            });

            var obj = new Grandchild();

            expect(obj).to.be.instanceof(Grandchild)
                .instanceof(Child)
                .instanceof(Base)
                .instanceof(EventEmitter);

            expect(obj.value).to.be.undefined;
            obj.setValue("hello");
            expect(obj.value).to.be.equal("hello");

            expect(obj.cValue).to.undefined;
            obj.setCvalue("foo");
            expect(obj.cValue).to.be.equal("foo");

            expect(obj.getString()).to.be.equal("childstring");

            expect(Grandchild.extend).to.be.equal(Base.extend)
                .to.be.defined;
            expect(Grandchild.datautils).to.be.equal(Base.datautils)
                .to.be.defined;

        });

        it("should allow extension of a previously extended class", function () {

            var Model = Base.extend({
                type: "Model",
                parentValue: "hello",
                func1: function () {
                    return 2;
                },
                func2: function () {
                    return 3;
                },
                __construct: function (values) {
                    if (values) {
                        for (var key in values) {
                            this[key] = values[key];
                        }
                    }
                }
            });

            var Model2 = Model.extend({
                type: "Model2",
                childValue: "goodbye",
                func2: function () {
                    return 4;
                },
                func3: function () {
                    return 5;
                }
            });

            var obj = new Model({
                parentValue: "yo!"
            });

            expect(obj).to.be.instanceof(Base);
            expect(obj).to.be.instanceof(Model);
            expect(obj).to.not.be.instanceof(Model2);
            expect(obj.type).to.be.equal("Model");
            expect(obj.parentValue).to.be.equal("yo!");
            expect(obj.func1()).to.be.equal(2);
            expect(obj.func2()).to.be.equal(3);

            var obj2 = new Model2({
                childValue: "oi oi"
            });

            expect(obj2).to.be.instanceof(Base);
            expect(obj2).to.be.instanceof(Model);
            expect(obj2).to.be.instanceof(Model2);
            expect(obj2.type).to.be.equal("Model2");
            expect(obj2.parentValue).to.be.equal("hello");
            expect(obj2.childValue).to.be.equal("oi oi");
            expect(obj2.func1()).to.be.equal(2);
            expect(obj2.func2()).to.be.equal(4);
            expect(obj2.super_.func2()).to.be.equal(3);
            expect(obj2.func3()).to.be.equal(5);

            expect(Model2.super_).to.be.equal(Model);

        });

        it("should allow in static params into an extended class", function () {

            var Model = Base.extend({
                dynamic: "hello"
            }, {
                static1: "value",
                static2: "value2"
            });

            expect(Model.dynamic).to.be.undefined;
            expect(Model.static1).to.be.equal("value");
            expect(Model.static2).to.be.equal("value2");

            var obj = new Model();

            expect(obj.dynamic).to.be.equal("hello");
            expect(obj.static1).to.be.undefined;
            expect(obj.static2).to.be.undefined;

        });

    });

});
