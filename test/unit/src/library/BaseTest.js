var expect = require("chai").expect;
var util = require("util");
var Base = require("../../../../src/library/Base");
var DomainModel = require("../../../../src/library/DomainModel");
var EventEmitter = require("events").EventEmitter;

var _ = require("lodash");

describe("Base library", function () {

    describe("datatypes", function () {

        it("should have the datautils.datatype library", function () {

            expect(Base.datatypes).to.be.equal(require("datautils").data);

        });

    });

    describe("#extend", function () {

        it("should extend the Base object with no properties", function (done) {

            var Model = Base.extend();

            expect(Model).to.be.a("function");

            /* Test the static functions */
            expect(Model.create).to.be.a("function");
            expect(Model.datatypes).to.be.an("object");
            expect(Model.extend).to.be.a("function");

            expect(new Model()).to.be.instanceof(EventEmitter);
            expect(new Model()).to.be.instanceof(Base);

            done();

        });

        it("should extend the Base object with some properties", function (done) {

            var Model = Base.extend({

                values: {},

                setValue: function (key, value) {
                    this.values[key] = value;
                    return true;
                }

            });

            var obj = new Model();

            expect(obj.values).to.be.an("object").to.be.empty;
            expect(obj.setValue("key", "value")).to.be.true;
            expect(obj.values).to.be.eql({
                key: "value"
            });

            done();

        });

        it("should extend the Base object with a custom constructor", function (done) {

            var Model = Base.extend({

                values: {},

                setValue: function (key, value) {
                    this.values[key] = value;
                    return true;
                },

                _construct: function (values) {
                    if (values) {
                        for (var key in values) {
                            this.setValue(key, values[key]);
                        }
                    }
                }

            });

            var obj = new Model({
                key: "value",
                key2: "value2"
            });

            var _super = Object.getOwnPropertyDescriptor(obj, "_super");
            var _construct = Object.getOwnPropertyDescriptor(obj, "_construct");
            var setValue = Object.getOwnPropertyDescriptor(obj, "setValue");
            var values = Object.getOwnPropertyDescriptor(obj, "values");

            expect(_super).to.be.an("object");
            expect(_super.value).to.be.an("object");
            expect(_super.writable).to.be.true;
            expect(_super.enumerable).to.be.false;
            expect(_super.configurable).to.be.true;

            expect(_construct).to.be.an("object");
            expect(_construct.writable).to.be.true;
            expect(_construct.enumerable).to.be.false;
            expect(_construct.configurable).to.be.true;

            expect(setValue).to.be.a("object");
            expect(setValue.writable).to.be.true;
            expect(setValue.enumerable).to.be.true;
            expect(setValue.configurable).to.be.true;

            expect(values).to.be.an("object");
            expect(values.writable).to.be.true;
            expect(values.enumerable).to.be.true;
            expect(values.configurable).to.be.true;

            expect(obj.values).to.be.eql({
                key: "value",
                key2: "value2"
            });

            expect(obj.setValue("key3", "value3")).to.be.true;

            expect(obj.values).to.be.eql({
                key: "value",
                key2: "value2",
                key3: "value3"
            });

            done();

        });

        it("should extend a previously extended class", function (done) {

            var Model = Base.extend({
                type: "Model",
                parentValue: "hello",
                func1: function () {
                    return 2;
                },
                func2: function () {
                    return 3;
                },
                _construct: function (values) {
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
            expect(obj2._super.func2()).to.be.equal(3);
            expect(obj2.func3()).to.be.equal(5);

            expect(Model2.super_).to.be.equal(Model);

            done();

        });

        it("should allow in static params into an extended class", function (done) {

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

            done();

        });

    });

    describe("#create", function () {

        it("should create an instance with no arguments", function (done) {

            var Model = Base.extend();

            expect(Model).to.be.a("function");

            /* Test the core functions */
            expect(Model.create).to.be.a("function");
            expect(Model.datatypes).to.be.an("object");

            var obj = Model.create();
            expect(obj).to.be.instanceof(EventEmitter);
            expect(obj).to.be.instanceof(Base);
            expect(obj).to.be.instanceof(Model);

            done();

        });

        it("should extend the Base object with a custom constructor and arguments", function (done) {

            var Model = Base.extend({

                values: {},

                setValue: function (key, value) {
                    this.values[key] = value;
                    return true;
                },

                _construct: function (values) {
                    if (values) {
                        for (var key in values) {
                            this.setValue(key, values[key]);
                        }
                    }
                }

            }, {
                bum: 2
            });

            var obj = Model.create({
                key: "value",
                key2: "value2"
            });

            expect(obj.values).to.be.eql({
                key: "value",
                key2: "value2"
            });

            expect(obj.setValue("key3", "value3")).to.be.true;

            expect(obj.values).to.be.eql({
                key: "value",
                key2: "value2",
                key3: "value3"
            });

            done();

        });

        it("should extend a previously extended class", function (done) {

            var Model = Base.extend({
                type: "Model",
                parentValue: "hello",
                func1: function () {
                    return 2;
                },
                func2: function () {
                    return 3;
                },
                _construct: function (values) {
                    if (values) {
                        for (var key in values) {
                            this[key] = values[key];
                        }
                    }
                },
                getType: function () {
                    return this.type;
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

            var obj = Model.create({
                parentValue: "yo!"
            });

            var obj2 = Model2.create({
                childValue: "oi oi"
            });

            expect(obj).to.be.instanceof(Base);
            expect(obj).to.be.instanceof(Model);
            expect(obj).to.not.be.instanceof(Model2);
            expect(obj.type).to.be.equal("Model");
            expect(obj.parentValue).to.be.equal("yo!");
            expect(obj.func1()).to.be.equal(2);
            expect(obj.func2()).to.be.equal(3);
            expect(obj.getType()).to.be.equal("Model");

            expect(obj2._super).to.be.equal(Model.prototype);

            expect(obj2).to.be.instanceof(Base);
            expect(obj2).to.be.instanceof(Model);
            expect(obj2).to.be.instanceof(Model2);
            expect(obj2.type).to.be.equal("Model2");
            expect(obj2.parentValue).to.be.equal("hello");
            expect(obj2.childValue).to.be.equal("oi oi");
            expect(obj2.func1()).to.be.equal(2);
            expect(obj2.func2()).to.be.equal(4);
            expect(obj2._super.func2()).to.be.equal(3);
            expect(obj2.func3()).to.be.equal(5);
            expect(obj2.getType()).to.be.equal("Model2");

            done();

        });

        it("should allow in static params into an extended class", function (done) {

            var Model = Base.extend({
                dynamic: "hello"
            }, {
                static1: "value",
                static2: "value2"
            });

            expect(Model.dynamic).to.be.undefined;
            expect(Model.static1).to.be.equal("value");
            expect(Model.static2).to.be.equal("value2");

            var obj = Model.create();

            expect(obj.dynamic).to.be.equal("hello");
            expect(obj.static1).to.be.undefined;
            expect(obj.static2).to.be.undefined;

            done();

        });

        it("should make prototype properties starting with _ not enumerable", function (done) {

            var Model = Base.extend({

                public: function () {
                },

                _hidden: function () {
                }

            });

            var obj = new Model();

            var values = {
                public: Object.getOwnPropertyDescriptor(obj, "public"),
                _hidden: Object.getOwnPropertyDescriptor(obj, "_hidden"),
                _super: Object.getOwnPropertyDescriptor(obj, "_super"),
                _construct: Object.getOwnPropertyDescriptor(obj, "_construct")
            };

            expect(values.public.writable).to.be.true;
            expect(values.public.enumerable).to.be.true;
            expect(values.public.configurable).to.be.true;

            expect(values._hidden.writable).to.be.true;
            expect(values._hidden.enumerable).to.be.false;
            expect(values._hidden.configurable).to.be.true;

            expect(values._super.writable).to.be.true;
            expect(values._super.enumerable).to.be.false;
            expect(values._super.configurable).to.be.true;

            expect(values._construct.writable).to.be.true;
            expect(values._construct.enumerable).to.be.false;
            expect(values._construct.configurable).to.be.true;

            done();

        });

        it("should make prototype properties starting with _ not enumerable - with create", function (done) {

            var Model = Base.extend({

                public: function () {
                },

                _hidden: function () {
                }

            });

            var obj = Model.create();

            var values = {
                public: Object.getOwnPropertyDescriptor(obj, "public"),
                _hidden: Object.getOwnPropertyDescriptor(obj, "_hidden"),
                _super: Object.getOwnPropertyDescriptor(obj, "_super"),
                _construct: Object.getOwnPropertyDescriptor(obj, "_construct")
            };

            expect(values.public.writable).to.be.true;
            expect(values.public.enumerable).to.be.true;
            expect(values.public.configurable).to.be.true;

            expect(values._hidden.writable).to.be.true;
            expect(values._hidden.enumerable).to.be.false;
            expect(values._hidden.configurable).to.be.true;

            expect(values._super.writable).to.be.true;
            expect(values._super.enumerable).to.be.false;
            expect(values._super.configurable).to.be.true;

            expect(values._construct.writable).to.be.true;
            expect(values._construct.enumerable).to.be.false;
            expect(values._construct.configurable).to.be.true;

            done();

        });

        it("should make properties set in _construct starting with _ are no enumerable", function (done) {

            var Model = Base.extend({

                _construct: function () {

                    this.public = "public";

                    this._hidden = "hidden";

                }

            });

            var obj = new Model();

            var values = {
                public: Object.getOwnPropertyDescriptor(obj, "public"),
                _hidden: Object.getOwnPropertyDescriptor(obj, "_hidden"),
                _super: Object.getOwnPropertyDescriptor(obj, "_super"),
                _construct: Object.getOwnPropertyDescriptor(obj, "_construct")
            };

            expect(values.public.writable).to.be.true;
            expect(values.public.enumerable).to.be.true;
            expect(values.public.configurable).to.be.true;

            expect(values._hidden.writable).to.be.true;
            expect(values._hidden.enumerable).to.be.false;
            expect(values._hidden.configurable).to.be.true;

            expect(values._super.writable).to.be.true;
            expect(values._super.enumerable).to.be.false;
            expect(values._super.configurable).to.be.true;

            expect(values._construct.writable).to.be.true;
            expect(values._construct.enumerable).to.be.false;
            expect(values._construct.configurable).to.be.true;

            done();

        });

        it("should ensure that the scope of non-functions is kept correct", function (done) {

            var Model = Base.extend({

                _construct: function (data) {
                    this.data = {};

                    this.setData(data);
                },


                getData: function () {
                    return this.data;
                },

                setData: function (data) {
                    for (var key in data) {
                        this.data[key] = data[key];
                    }
                }

            });

            var obj1 = new Model({
                key1: "value1"
            });

            expect(obj1.data).to.be.eql({
                key1: "value1"
            });

            var obj2 = new Model();

            expect(obj2.data).to.be.empty;

            done();

        });

        it("should ensure that the scope of non-functions is kept correct - with create", function (done) {

            var Model = Base.extend({

                _construct: function (data) {
                    this.data = {};

                    this.setData(data);
                },


                getData: function () {
                    return this.data;
                },

                setData: function (data) {
                    for (var key in data) {
                        this.data[key] = data[key];
                    }
                }

            });

            var obj1 = Model.create({
                key1: "value1"
            });

            expect(obj1.data).to.be.eql({
                key1: "value1"
            });

            var obj2 = Model.create();

            expect(obj2.data).to.be.empty;

            done();

        });

        it("should throw an error if not instantiated with new", function (done) {

            var fail = false;

            var Model = Base.extend();

            try {
                var obj = Model();
            } catch (err) {
                fail = true;

                expect(err).to.be.instanceof(SyntaxError);
                expect(err.message).to.be.equal("Class must be instantiated with new or create()");
            }

            expect(fail).to.be.true;

            done();

        });

    });

    describe("#extendsContructor", function () {

        describe("Steeplejack methods", function () {

            it("should return true when it extends the Base class", function () {

                var ChildClass = Base.extend();

                expect(Base.extendsContructor(ChildClass, Base)).to.be.true;

            });

            it("should return true when it extends the Base class implicitly", function () {

                var ChildClass = DomainModel.extend();

                expect(Base.extendsContructor(ChildClass, Base));

            });

            it("should return true when it extends the DomainModel class", function () {

                var ChildClass = DomainModel.extend();

                expect(Base.extendsContructor(ChildClass, DomainModel));

            });

            it("should return true when it extends a defined class", function () {

                var ParentClass = Base.extend();

                var ChildClass = ParentClass.extend();

                expect(Base.extendsContructor(ChildClass, ParentClass)).to.be.true;

            });

            it("should return false when it doesn't extend a defined class", function () {

                var ParentClass = Base.extend();

                var ChildClass = ParentClass.extend();

                expect(Base.extendsContructor(ChildClass, DomainModel)).to.be.false;

            });

            it("should return true when it extends a second class", function () {

                var ParentClass = Base.extend();

                var ChildClass = ParentClass.extend();

                expect(Base.extendsContructor(ChildClass, DomainModel, ParentClass)).to.be.true;

            });

        });

        describe("Util.inherits", function () {

            it("should return true when it extends a second class", function () {

                function ChildClass() {

                }

                function ParentClass() {

                }

                util.inherits(ChildClass, ParentClass);

                expect(Base.extendsContructor(ChildClass, ParentClass)).to.be.true;

            });

            it("should return true when it extends a native class", function () {

                function ChildClass() {

                }

                util.inherits(ChildClass, Error);

                expect(Base.extendsContructor(ChildClass, Error)).to.be.true;

            });

            it("should return true when it is extends a class that extends another class", function () {

                function ChildClass() {

                }

                function ParentClass() {

                }

                function ParentClass2() {

                }

                util.inherits(ChildClass, ParentClass);
                util.inherits(ParentClass, ParentClass2);

                expect(Base.extendsContructor(ChildClass, ParentClass2)).to.be.true;

            });

            it("should return true when the first ParentClass isn't extending but the second is", function () {

                function ChildClass() {

                }

                function ParentClass() {

                }

                function NonParentClass() {

                }

                util.inherits(ChildClass, ParentClass);

                expect(Base.extendsContructor(ChildClass, NonParentClass, ParentClass)).to.be.true;

            });

            it("should return false when the second one doesn't extend", function () {

                function ChildClass() {

                }

                function NonParentClass() {

                }

                expect(Base.extendsContructor(ChildClass, NonParentClass)).to.be.false;

            });

            it("should return false when the second one doesn't extend", function () {

                function ChildClass() {

                }

                function NonParentClass() {

                }

                function NonParentClass2() {

                }

                util.inherits(NonParentClass, NonParentClass2)

                expect(Base.extendsContructor(ChildClass, NonParentClass, NonParentClass2)).to.be.false;

            });

            it("should return false if ChildClass isn't a function", function () {

                expect(Base.extendsContructor({}, function () {
                })).to.be.false;

            });

            it("should return false if ParentClass isn't a function", function () {

                expect(Base.extendsContructor(function () {
                }, {})).to.be.false;

            });

            it("should return false if they're not a function but identical", function () {

                var date = new Date();

                expect(Base.extendsContructor(date, date)).to.be.false;

            });

        });

    });

    describe("Methods", function () {

        describe("#clone", function () {

            it("should clone the Base method and remain an instance", function () {

                var obj = Base.create();

                var clone = obj.clone();

                expect(clone).to.be.an.instanceof(Base)
                    .to.be.an.instanceof(EventEmitter)
                    .to.be.not.equal(obj);

            });

            it("should clone an extended Base method and remain an instance", function () {

                var Model = Base.extend({

                    constant: 23,

                    _construct: function (obj) {
                        this.values = {};

                        for (var key in obj) {
                            this.setValue(key, obj[key]);
                        }
                    },

                    _hidden: function () {

                    },

                    setValue: function (key, value) {
                        this.values[key] = value;
                        return true;
                    }

                });

                var obj = Model.create({
                    key1: "val1"
                });

                var clone = obj.clone();

                expect(clone).to.be.an.instanceof(Model)
                    .to.be.an.instanceof(Base)
                    .to.be.an.instanceof(EventEmitter)
                    .to.be.not.equal(obj);

                expect(clone.constant).to.be.equal(23);
                expect(clone.values).to.be.eql({
                    key1: "val1"
                });
                expect(clone.values).to.be.eql(obj.values)
                    .to.be.not.equal(obj.values);
                expect(clone.setValue).to.be.equal(obj.setValue);
                expect(clone._hidden).to.be.equal(obj._hidden);

                clone.setValue("key2", "val2");
                expect(obj.values).to.be.eql({
                    key1: "val1"
                });
                expect(clone.values).to.be.eql({
                    key1: "val1",
                    key2: "val2"
                });

            });

            it("should ignore parameters in the cloneIgnore array", function () {

                var Model = Base.extend({

                    _construct: function (obj) {
                        this._cloneIgnore = [
                            "ignore"
                        ];
                        this.values = {};

                        Object.defineProperty(this, "ignore", {
                            value: "value",
                            enumerable: false
                        });

                        for (var key in obj) {
                            this.setValue(key, obj[key]);
                        }
                    },

                    setValue: function (key, value) {
                        this.values[key] = value;
                        return true;
                    }

                });

                var obj = Model.create({
                    key1: "val1"
                });

                expect(obj.ignore).to.be.equal("value");

                var clone = obj.clone();

                expect(clone.ignore).to.be.equal("value");

            });

            it("should throw error if param should have been ignored", function () {

                var Model = Base.extend({

                    _construct: function (obj) {
                        this.values = {};

                        Object.defineProperty(this, "ignore", {
                            value: "value",
                            enumerable: false
                        });

                        for (var key in obj) {
                            this.setValue(key, obj[key]);
                        }
                    },

                    setValue: function (key, value) {
                        this.values[key] = value;
                        return true;
                    }

                });

                var obj = Model.create({
                    key1: "val1"
                });

                var fail = false;

                try {
                    var clone = obj.clone();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.an.instanceof(TypeError);
                    expect(err.message).to.be.equal("Cannot redefine property: ignore");
                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

    });

    describe("validation", function () {

        it("should have the datautils.validation library", function () {

            expect(Base.validation).to.be.equal(require("datautils").validation);

        });

    });

});
