var chai = require("chai");
var expect = chai.expect;
var sinon = require("sinon");

var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

var Main = require("../../../../src/Main");
var collection = Main.Collection;
var DomainModel = Main.Model;
var ValidationErr = Main.Exceptions.Validation;
var _ = require("lodash");


describe("Collection tests", function () {

    var Model;
    before(function () {
        /* Define the model */
        Model = DomainModel.extend({
            definition: {
                boolean: {
                    type: "boolean",
                    value: false
                },
                date: {
                    type: "date"
                },
                float: {
                    type: "float"
                },
                integer: {
                    type: "integer",
                    column: "int"
                },
                string: {
                    type: "string"
                }
            }
        });
    });

    var Collection;
    beforeEach(function () {
        Collection = collection.extend({
            model: Model
        });
    });

    describe("Add models", function () {

        it("should create a collection of models from an object", function (done) {

            var obj = new Collection({
                boolean: "true",
                date: "2010-02-07",
                float: "2.3",
                integer: "2",
                string: "string"
            });

            expect(obj).to.be.instanceof(Collection);
            expect(obj).to.be.instanceof(require("events").EventEmitter);
            expect(obj.getCount()).to.be.equal(1);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);

            done();

        });

        it("should convert a collection to it's data representation", function () {

            var Model1 = DomainModel.extend({

                definition: {
                    id: {
                        type: "string",
                        column: "_id"
                    }
                }

            });

            var Collection1 = collection.extend({

                model: Model1

            });

            var obj = new Collection1([{
                id: "12345"
            }, {
                id: "23456"
            }]);

            expect(obj.toData()).to.be.eql([{
                _id: "12345"
            }, {
                _id: "23456"
            }]);

        });

        it("should create a collection of models from an object", function (done) {

            var obj = new Collection({
                boolean: "true",
                date: "2010-02-07",
                float: "2.3",
                integer: "2",
                string: "string"
            });

            expect(obj).to.be.instanceof(Collection);
            expect(obj).to.be.instanceof(require("events").EventEmitter);
            expect(obj.getCount()).to.be.equal(1);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);

            done();

        });

        it("should create a collection of models from an array of one - with create", function (done) {

            var obj = Collection.create([
                {
                    boolean: "true",
                    date: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }
            ]);

            expect(obj.getCount()).to.be.equal(1);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);

            done();

        });

        it("should create a collection of models from an array of two", function (done) {

            var obj = new Collection([
                {
                    boolean: "true",
                    date: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                },
                {
                    boolean: "true",
                    date: "2010-02-08",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }
            ]);

            expect(obj.getCount()).to.be.equal(2);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.get(1)).to.be.instanceof(Model);

            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                },
                {
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);

            done();

        });

        it("should create no models if empty array is given", function (done) {

            var obj = new Collection([]);

            expect(obj.getCount()).to.be.equal(0);
            expect(obj.toJSON()).to.be.eql([]);

            done();

        });

        it("should create no models if empty object", function (done) {

            var obj = new Collection([
                {}
            ]);

            expect(obj.getCount()).to.be.equal(0);
            expect(obj.toJSON()).to.be.eql([]);

            done();

        });

        it("should create models if at least one element set", function (done) {

            var obj = new Collection([
                {
                    date: "2013-02-02"
                }
            ]);

            expect(obj.getCount()).to.be.equal(1);
            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: false,
                    date: new Date("2013-02-02"),
                    float: null,
                    integer: null,
                    string: null
                }
            ]);

            done();

        });

        it("should add nothing, but still return this", function () {

            var obj = new Collection();

            expect(obj.getCount()).to.be.equal(0);

            expect(obj.add({})).to.be.equal(obj);

            expect(obj.getCount()).to.be.equal(0);

        });

        it("should create models from an object in the add method", function (done) {

            var obj = new Collection();

            expect(obj.getCount()).to.be.equal(0);

            expect(obj.add({
                boolean: "true",
                date: "2010-02-07",
                float: "2.3",
                integer: "2",
                string: "string"
            })).to.be.equal(obj);

            expect(obj.getCount()).to.be.equal(1);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);

            done();

        });

        it("should create models from an array of one in the add method", function (done) {

            var obj = new Collection();

            expect(obj.getCount()).to.be.equal(0);

            expect(obj.add([
                {
                    boolean: "true",
                    date: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }
            ])).to.be.equal(obj);

            expect(obj.getCount()).to.be.equal(1);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);

            done();

        });

        it("should create models from an array of object in the add method", function (done) {

            var obj = new Collection();

            expect(obj.getCount()).to.be.equal(0);

            expect(obj.add([
                {
                    boolean: "true",
                    date: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                },
                {
                    boolean: "true",
                    date: "2010-02-08",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }
            ])).to.be.equal(obj);

            expect(obj.getCount()).to.be.equal(2);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.get(1)).to.be.instanceof(Model);

            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                },
                {
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);

            done();

        });

        it("should allow an instance of the model to be added", function (done) {

            var obj = new Collection();

            expect(obj.getCount()).to.be.equal(0);

            expect(obj.add(new Model({
                boolean: "true",
                date: "2010-02-07",
                float: "2.3",
                integer: "2",
                string: "string"
            }))).to.be.equal(obj);

            expect(obj.getCount()).to.be.equal(1);
            expect(obj.get(0)).to.be.instanceof(Model);

            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);

            done();

        });

        it("should allow an array of instances of the model to be added", function (done) {

            var obj = new Collection();

            expect(obj.getCount()).to.be.equal(0);

            expect(obj.add([
                new Model({
                    boolean: "true",
                    date: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }),
                new Model({
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }),
                new Model({
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                })
            ])).to.be.equal(obj);

            expect(obj.getCount()).to.be.equal(3);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.get(1)).to.be.instanceof(Model);
            expect(obj.get(2)).to.be.instanceof(Model);

            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                },
                {
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                },
                {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);

            done();

        });

        it("should allow an instance of the model to be added to the constructor", function (done) {

            var obj = new Collection(new Model({
                boolean: "true",
                date: "2010-02-07",
                float: "2.3",
                integer: "2",
                string: "string"
            }));

            expect(obj.getCount()).to.be.equal(1);
            expect(obj.get(0)).to.be.instanceof(Model);

            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);

            done();

        });

        it("should allow an array of instances of the model to be added to the constructor", function (done) {

            var obj = new Collection([
                new Model({
                    boolean: "true",
                    date: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }),
                new Model({
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }),
                new Model({
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                })
            ]);

            expect(obj.getCount()).to.be.equal(3);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.get(1)).to.be.instanceof(Model);
            expect(obj.get(2)).to.be.instanceof(Model);

            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                },
                {
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                },
                {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);

            done();

        });

    });

    describe("Collection management", function () {

        describe("keys", function () {

            it("should ensure that all keys are unique", function (done) {

                var obj = new Collection([
                    {
                        boolean: "true",
                        date: "2010-02-07",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    },
                    {
                        boolean: "true",
                        date: "2010-02-08",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    },
                    {
                        boolean: "true",
                        date: "2010-02-09",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    }
                ]);

                expect(obj.getKeys()).to.have.length(3);
                expect(_.uniq(obj.getKeys())).to.have.length(3);

                done();

            });

        });

    });

    describe("Getting models", function () {

        var obj;

        beforeEach(function () {
            obj = new Collection([
                {
                    boolean: "true",
                    date: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                },
                {
                    boolean: "true",
                    date: "2010-02-08",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                },
                {
                    boolean: "true",
                    date: "2010-02-09",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }
            ]);

            expect(obj.getCount()).to.be.equal(3);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.get(1)).to.be.instanceof(Model);

            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                },
                {
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                },
                {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);
        });

        describe("by UUID", function () {

            it("should return the model by the UUID", function (done) {

                var keys = obj.getKeys();
                var models = obj.data;

                expect(obj.get(keys[0])).to.be.equal(models[keys[0]]);
                expect(obj.get(keys[0], false)).to.be.equal(models[keys[0]]);

                done();

            });

            it("should return the model UUID by the UUID", function (done) {

                var keys = obj.getKeys();

                expect(obj.get(keys[0], true)).to.be.equal(keys[0]);

                done();

            });

            it("should not get non-existent UUID", function (done) {

                expect(obj.get("23f3gg32")).to.be.null;
                expect(obj.get("23f3gg32", true)).to.be.null;

                done();

            });

        });

        describe("by integer", function () {

            it("should return the model by the integer", function (done) {

                var keys = obj.getKeys();
                var models = obj.data;

                expect(obj.get(0)).to.be.equal(models[keys[0]]);
                expect(obj.get(0, false)).to.be.equal(models[keys[0]]);

                done();

            });

            it("should return the UUID by the integer", function (done) {

                var keys = obj.getKeys();

                expect(obj.get(0, true)).to.be.equal(keys[0]);

                done();

            });

            it("should not get non-existent integer", function (done) {

                expect(obj.get("23")).to.be.null;
                expect(obj.get("23", false)).to.be.null;
                expect(obj.get(23)).to.be.null;
                expect(obj.get(23, true)).to.be.null;

                done();

            });

        });

        describe("by model", function () {

            it("should return the model by the model", function (done) {

                var keys = obj.getKeys();
                var models = obj.data;

                expect(obj.get(models[keys[0]])).to.be.equal(models[keys[0]]);
                expect(obj.get(models[keys[0]], false)).to.be.equal(models[keys[0]]);

                done();

            });

            it("should return the UUID by the model", function (done) {

                var keys = obj.getKeys();
                var models = obj.data;

                expect(obj.get(models[keys[0]], true)).to.be.equal(keys[0]);

                done();

            });

            it("should not get non-existent model", function (done) {

                var obj2 = new Collection([
                    {
                        boolean: "true",
                        date: "2010-02-07",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    }
                ]);

                expect(obj2.get(0)).to.be.instanceof(Model);

                expect(obj.get(obj2.get(0))).to.be.null;
                expect(obj.get(obj2.get(0), false)).to.be.null;
                expect(obj.get(obj2.get(0))).to.be.null;
                expect(obj.get(obj2.get(0), true)).to.be.null;

                done();

            });

        });

        describe("by array", function () {

            describe("by UUID", function () {

                it("should return the model by the UUID", function (done) {

                    var keys = obj.getKeys();
                    var models = obj.data;

                    expect(obj.get([
                        keys[0],
                        keys[2]
                    ])).to.be.eql([
                        models[keys[0]],
                        models[keys[2]]
                    ]);

                    expect(obj.get([
                        keys[0],
                        keys[2]
                    ], false)).to.be.eql([
                        models[keys[0]],
                        models[keys[2]]
                    ]);

                    done();

                });

                it("should return the UUID by the UUID", function (done) {

                    var keys = obj.getKeys();

                    expect(obj.get([
                        keys[0],
                        keys[2]
                    ], true)).to.be.eql([
                        keys[0],
                        keys[2]
                    ]);

                    done();

                });

                it("should return existent stuff and not the non-existent stuff", function (done) {

                    var keys = obj.getKeys();
                    var models = obj.data;

                    expect(obj.get([
                        keys[0],
                        keys[3]
                    ])).to.be.eql([
                        models[keys[0]],
                        null
                    ]);

                    expect(obj.get([
                        keys[3],
                        keys[2]
                    ], false)).to.be.eql([
                        null,
                        models[keys[2]]
                    ]);

                    expect(obj.get([
                        keys[3],
                        keys[23]
                    ], false)).to.be.eql([
                        null,
                        null
                    ]);

                    expect(obj.get([
                        keys[23],
                        keys[2]
                    ], true)).to.be.eql([
                        null,
                        keys[2]
                    ]);

                    done();

                });

            });

            describe("by integer", function () {

                it("should return the model by the integer", function (done) {

                    var keys = obj.getKeys();
                    var models = obj.data;

                    expect(obj.get([
                        0,
                        2
                    ])).to.be.eql([
                        models[keys[0]],
                        models[keys[2]]
                    ]);

                    expect(obj.get([
                        0,
                        2
                    ], false)).to.be.eql([
                        models[keys[0]],
                        models[keys[2]]
                    ]);

                    done();

                });

                it("should return the UUID by the integer", function (done) {

                    var keys = obj.getKeys();

                    expect(obj.get([
                        0,
                        2
                    ], true)).to.be.eql([
                        keys[0],
                        keys[2]
                    ]);

                    done();

                });

                it("should return existent stuff and not the non-existent stuff", function (done) {

                    var keys = obj.getKeys();
                    var models = obj.data;

                    expect(obj.get([
                        0,
                        3
                    ])).to.be.eql([
                        models[keys[0]],
                        null
                    ]);

                    expect(obj.get([
                        3,
                        2
                    ], false)).to.be.eql([
                        null,
                        models[keys[2]]
                    ]);

                    expect(obj.get([
                        3,
                        23
                    ], false)).to.be.eql([
                        null,
                        null
                    ]);

                    expect(obj.get([
                        23,
                        2
                    ], true)).to.be.eql([
                        null,
                        keys[2]
                    ]);

                    done();

                });

            });

            describe("by model", function () {

                it("should return the model by the integer", function (done) {

                    var keys = obj.getKeys();
                    var models = obj.data;

                    expect(obj.get([
                        models[keys[0]],
                        models[keys[2]]
                    ])).to.be.eql([
                        models[keys[0]],
                        models[keys[2]]
                    ]);

                    expect(obj.get([
                        models[keys[0]],
                        models[keys[2]]
                    ], false)).to.be.eql([
                        models[keys[0]],
                        models[keys[2]]
                    ]);

                    done();

                });

                it("should return the UUID by the integer", function (done) {

                    var keys = obj.getKeys();
                    var models = obj.data;

                    expect(obj.get([
                        models[keys[0]],
                        models[keys[2]]
                    ], true)).to.be.eql([
                        keys[0],
                        keys[2]
                    ]);

                    done();

                });

                it("should return existent stuff and not the non-existent stuff", function (done) {

                    var keys = obj.getKeys();
                    var models = obj.data;

                    expect(obj.get([
                        models[keys[0]],
                        models[keys[3]]
                    ])).to.be.eql([
                        models[keys[0]],
                        null
                    ]);

                    expect(obj.get([
                        models[keys[3]],
                        models[keys[2]]
                    ], false)).to.be.eql([
                        null,
                        models[keys[2]]
                    ]);

                    expect(obj.get([
                        models[keys[3]],
                        models[keys[23]]
                    ], false)).to.be.eql([
                        null,
                        null
                    ]);

                    expect(obj.get([
                        models[keys[23]],
                        models[keys[2]]
                    ], true)).to.be.eql([
                        null,
                        keys[2]
                    ]);

                    done();

                });

            });

            describe("mixed", function () {

                it("should get one of each and show the model", function (done) {

                    var keys = obj.getKeys();
                    var models = obj.data;

                    expect(obj.get([
                        models[keys[0]],
                        keys[1],
                        2
                    ])).to.be.eql([
                        models[keys[0]],
                        models[keys[1]],
                        models[keys[2]]
                    ]);

                    expect(obj.get([
                        models[keys[0]],
                        keys[1],
                        2
                    ], false)).to.be.eql([
                        models[keys[0]],
                        models[keys[1]],
                        models[keys[2]]
                    ]);

                    done();

                });

            });

        });

    });

    describe("Removing models", function () {

        var obj;

        beforeEach(function () {
            obj = new Collection([
                {
                    boolean: "true",
                    date: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                },
                {
                    boolean: "true",
                    date: "2010-02-08",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                },
                {
                    boolean: "true",
                    date: "2010-02-09",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }
            ]);

            expect(obj.getCount()).to.be.equal(3);
            expect(obj.get(0)).to.be.instanceof(Model);
            expect(obj.get(1)).to.be.instanceof(Model);

            expect(obj.toJSON()).to.be.eql([
                {
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                },
                {
                    boolean: true,
                    date: new Date("2010-02-08"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                },
                {
                    boolean: true,
                    date: new Date("2010-02-09"),
                    float: 2.3,
                    integer: 2,
                    string: "string"
                }
            ]);
        });

        describe("by array", function () {

            describe("model only", function () {

                it("should remove first element only", function (done) {

                    var model = [
                        obj.get(0)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove middle element only", function (done) {

                    var model = [
                        obj.get(1)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove last element only", function (done) {

                    var model = [
                        obj.get(2)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove first and last elements", function (done) {

                    var model = [
                        obj.get(0),
                        obj.get(2)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove first and middle elements", function (done) {

                    var model = [
                        obj.get(0),
                        obj.get(1)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove second and last elements", function (done) {

                    var model = [
                        obj.get(1),
                        obj.get(2)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should not remove non-existent elements", function (done) {

                    var obj2 = new Collection([
                        {
                            boolean: "true",
                            date: "2010-02-07",
                            float: "2.3",
                            integer: "2",
                            string: "string"
                        },
                        {
                            boolean: "true",
                            date: "2010-02-08",
                            float: "2.3",
                            integer: "2",
                            string: "string"
                        }
                    ]);

                    var model = [
                        obj2.get(0),
                        obj2.get(1)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        false,
                        false
                    ]);

                    expect(obj.getCount()).to.be.equal(3);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);
                    expect(obj.get(2)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should not remove non-existent elements but remove existing ones", function (done) {

                    var obj2 = new Collection({
                        boolean: "true",
                        date: "2010-02-07",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    });

                    var model = [
                        obj.get(0),
                        obj2.get(0)
                    ];

                    expect(obj.remove(model)).to.be.eql([
                        true,
                        false
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

            });

            describe("uuid only", function () {

                it("should remove first element only", function (done) {

                    expect(obj.remove([obj.get(0, true)])).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove middle element only", function (done) {

                    expect(obj.remove([obj.get(1, true)])).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove last element only", function (done) {

                    expect(obj.remove([obj.get(2, true)])).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove first and last elements", function (done) {

                    expect(obj.remove([obj.get(0, true), obj.get(2, true)])).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove first and middle elements", function (done) {

                    expect(obj.remove([obj.get(0, true), obj.get(1, true)])).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove second and last elements", function (done) {

                    expect(obj.remove([obj.get(2, true), obj.get(1, true)])).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should not remove non-existent elements", function (done) {

                    var obj2 = new Collection([
                        {
                            boolean: "true",
                            date: "2010-02-07",
                            float: "2.3",
                            integer: "2",
                            string: "string"
                        },
                        {
                            boolean: "true",
                            date: "2010-02-08",
                            float: "2.3",
                            integer: "2",
                            string: "string"
                        }
                    ]);

                    expect(obj.remove([obj2.get(0, true), obj2.get(1, true)])).to.be.eql([
                        false,
                        false
                    ]);

                    expect(obj.getCount()).to.be.equal(3);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);
                    expect(obj.get(2)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should not remove non-existent elements but remove existing ones", function (done) {

                    var obj2 = new Collection([
                        {
                            boolean: "true",
                            date: "2010-02-08",
                            float: "2.3",
                            integer: "2",
                            string: "string"
                        }
                    ]);

                    expect(obj.remove([obj2.get(0, true), obj.get(1, true)])).to.be.eql([
                        false,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

            });

            describe("id only", function () {

                it("should remove first element only", function (done) {

                    expect(obj.remove([0])).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove middle element only", function (done) {

                    expect(obj.remove(["1"])).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove last element only", function (done) {

                    expect(obj.remove([2])).to.be.eql([
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove first and last elements", function (done) {

                    expect(obj.remove([2, 0])).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove first and middle elements", function (done) {

                    expect(obj.remove([0, 1])).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should remove second and last elements", function (done) {

                    expect(obj.remove([1, 2])).to.be.eql([
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(1);
                    expect(obj.get(0)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should not remove non-existent elements", function (done) {

                    expect(obj.remove([3])).to.be.eql([
                        false
                    ]);

                    expect(obj.getCount()).to.be.equal(3);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);
                    expect(obj.get(2)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-09"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

                it("should not remove non-existent elements but remove existing ones", function (done) {

                    expect(obj.remove([3, 2])).to.be.eql([
                        false,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(2);
                    expect(obj.get(0)).to.be.instanceof(Model);
                    expect(obj.get(1)).to.be.instanceof(Model);

                    expect(obj.toJSON()).to.be.eql([
                        {
                            boolean: true,
                            date: new Date("2010-02-07"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        },
                        {
                            boolean: true,
                            date: new Date("2010-02-08"),
                            float: 2.3,
                            integer: 2,
                            string: "string"
                        }
                    ]);

                    done();

                });

            });

            describe("mixed", function () {

                it("should remove a UUID, integer and model in an array", function (done) {

                    var arr = [
                        0,
                        obj.get(1, true),
                        obj.get(2)
                    ];

                    expect(obj.remove(arr)).to.be.eql([
                        true,
                        true,
                        true
                    ]);

                    expect(obj.getCount()).to.be.equal(0);

                    expect(obj.toJSON()).to.be.eql([]);

                    done();

                });

            });

        });

        describe("by id", function () {

            it("should remove the first model by id", function (done) {

                expect(obj.remove(0)).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

                done();

            });

            it("should remove a later model by id", function (done) {

                expect(obj.remove(1)).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

                done();

            });

            it("should remove the last model by id", function (done) {

                expect(obj.remove(2)).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

                done();

            });

            it("should not remove a non-existent by id", function (done) {

                expect(obj.remove(4)).to.be.false;

                expect(obj.getCount()).to.be.equal(3);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);
                expect(obj.get(2)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

                done();

            });

        });

        describe("by UUID", function () {

            it("should remove the first model by UUID", function (done) {

                var keys = obj.getKeys();

                expect(obj.remove(keys[0])).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

                done();

            });

            it("should remove the middle model by UUID", function (done) {

                var keys = obj.getKeys();

                expect(obj.remove(keys[1])).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

                done();

            });

            it("should remove an the last model by UUID", function (done) {

                var keys = obj.getKeys();

                expect(obj.remove(keys[2])).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

                done();

            });

            it("should not remove a non-existent by model", function (done) {

                var keys = obj.getKeys();

                expect(obj.remove(keys[4])).to.be.false;

                expect(obj.getCount()).to.be.equal(3);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);
                expect(obj.get(2)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

                done();

            });

        });

        describe("by model", function () {

            it("should remove the first model by model", function (done) {

                expect(obj.remove(obj.get(0))).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

                done();

            });

            it("should remove an intermediate by model", function (done) {

                expect(obj.remove(obj.get(1))).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

                done();

            });

            it("should remove an the last model by model", function (done) {

                expect(obj.remove(obj.get(2))).to.be.true;

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

                done();

            });

            it("should not remove a non-existent by model", function (done) {

                var obj2 = new Collection({
                    boolean: "true",
                    date: "2010-02-09",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                });

                expect(obj.remove(obj2.get(0))).to.be.false;

                expect(obj.getCount()).to.be.equal(3);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);
                expect(obj.get(2)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

                done();

            });

        });

    });

    describe("Methods", function () {

        describe("#remove", function () {

            var obj;

            beforeEach(function () {
                obj = new Collection([
                    {
                        boolean: "true",
                        date: "2010-02-07",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    },
                    {
                        boolean: "true",
                        date: "2010-02-08",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    },
                    {
                        boolean: "true",
                        date: "2010-02-09",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    }
                ]);
            });

            it("should ignore the removal of an empty array", function (done) {

                expect(obj.remove([])).to.be.false;

                done();

            });

            it("should return false when non-existent string given", function (done) {

                expect(obj.remove("kevin")).to.be.false;

                done();

            });

        });

        describe("#reset", function () {

            it("should return false when data is empty", function () {

                var obj = new Collection();

                expect(obj.reset()).to.be.false;

            });

            it("should return true when data not empty", function () {

                var obj = new Collection([
                    {
                        boolean: "true",
                        date: "2010-02-07",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    },
                    {
                        boolean: "true",
                        date: "2010-02-08",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    },
                    {
                        boolean: "true",
                        date: "2010-02-09",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    }
                ]);

                expect(obj.reset()).to.be.true;

                expect(obj.getCount()).to.be.equal(0);

                expect(obj.reset()).to.be.false;

            });

        });

        describe("Lodash methods", function () {

            var obj;
            beforeEach(function () {
                obj = new Collection([
                    {
                        boolean: "true",
                        date: "2010-02-07",
                        float: "2.2",
                        integer: "2",
                        string: "string"
                    },
                    {
                        boolean: "true",
                        date: "2010-02-08",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    },
                    {
                        boolean: "true",
                        date: "2010-02-09",
                        float: "2.3",
                        integer: "2",
                        string: "string"
                    }
                ]);

                expect(obj.getCount()).to.be.equal(3);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.2,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-09"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);
            });

            describe("#each", function () {

                it("should run the each method", function () {

                    var fn = sinon.stub();

                    var out = obj.each(fn);

                    fn.should.be.calledThrice
                        .calledWith(obj.get(0), obj.get(0, true), obj.getAll())
                        .calledWith(obj.get(1), obj.get(1, true), obj.getAll())
                        .calledWith(obj.get(2), obj.get(2, true), obj.getAll());

                    expect(out).to.be.equal(obj);

                });

                it("should set the scope to global if thisArg not set", function () {

                    var out = obj.each(function () {
                        expect(this).to.be.equal(global);
                    });

                    expect(out).to.be.equal(obj);

                });

                it("should receive a function and set the scope with the second parameter to this", function () {

                    var self = this;

                    var out = obj.each(function () {
                        expect(this).to.be.equal(self);
                    }, this);

                    expect(out).to.be.equal(obj);

                });

                it("should set the scope to a different object", function () {

                    var out = obj.each(function () {
                        expect(this.fn).to.be.a("function");
                        expect(this.id).to.be.equal(12345);
                    }, {
                        fn: function () {
                        },
                        id: 12345
                    });

                    expect(out).to.be.equal(obj);

                });

                it("should throw an error when a non-function received", function () {

                    var fail = false;

                    try {
                        obj.each("string");
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("iterator must be a function");
                    }

                    expect(fail).to.be.true;

                });

            });

            describe("#forEach", function () {

                it("should run the forEach method", function () {

                    var fn = sinon.stub();

                    var out = obj.forEach(fn);

                    fn.should.be.calledThrice
                        .calledWith(obj.get(0), obj.get(0, true), obj.getAll())
                        .calledWith(obj.get(1), obj.get(1, true), obj.getAll())
                        .calledWith(obj.get(2), obj.get(2, true), obj.getAll());

                    expect(out).to.be.equal(obj);

                });

                it("should set the scope to global if thisArg not set", function () {

                    var out = obj.forEach(function () {
                        expect(this).to.be.equal(global);
                    });

                    expect(out).to.be.equal(obj);

                });

                it("should receive a function and set the scope with the second parameter to this", function () {

                    var self = this;

                    var out = obj.forEach(function () {
                        expect(this).to.be.equal(self);
                    }, this);

                    expect(out).to.be.equal(obj);

                });

                it("should set the scope to a different object", function () {

                    var out = obj.forEach(function () {
                        expect(this.fn).to.be.a("function");
                        expect(this.id).to.be.equal(12345);
                    }, {
                        fn: function () {
                        },
                        id: 12345
                    });

                    expect(out).to.be.equal(obj);

                });

                it("should throw an error when a non-function received", function () {

                    var fail = false;

                    try {
                        obj.forEach("string");
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("iterator must be a function");
                    }

                    expect(fail).to.be.true;

                });

            });

            describe("sorting", function () {

                var champs,
                    Driver;
                beforeEach(function () {

                    /* Define a driver model */
                    Driver = DomainModel.extend({
                        definition: {
                            id: {
                                type: "integer",
                                value: null
                            },
                            firstName: {
                                type: "string",
                                value: null
                            },
                            lastName: {
                                type: "string",
                                value: null
                            },
                            team: {
                                type: "string",
                                value: null
                            },
                            dateOfBirth: {
                                type: "date",
                                value: null
                            },
                            championYears: {
                                type: "array",
                                value: null
                            }
                        },


                        setChampionYears: function (value, def) {

                            if (value instanceof Array) {
                                _.each(value, function (val) {
                                    this.setChampionYears(val, def);
                                }, this);
                            } else {
                                value = DomainModel.datatypes.setInt(value, null);

                                if (value !== null && _.indexOf(this.get("championYears"), value) === -1) {

                                    if (this.get("championYears") === null) {
                                        this._attr.championYears = [];
                                    }

                                    this._attr.championYears.push(value);
                                }
                            }

                        }
                    });

                    var Champions = collection.extend({
                        model: Driver
                    });

                    champs = Champions.create([
                        {
                            id: 1,
                            firstName: "Sebastian",
                            lastName: "Vettel",
                            dateOfBirth: "1987-07-03",
                            team: "Red Bull",
                            championYears: [
                                2010,
                                2011,
                                2012,
                                2013
                            ]
                        },
                        {
                            id: 2,
                            firstName: "Jenson",
                            lastName: "Button",
                            dateOfBirth: "1980-01-19",
                            team: "McLaren",
                            championYears: [
                                2009
                            ]
                        },
                        {
                            id: 0,
                            firstName: "Lewis",
                            lastName: "Hamilton",
                            dateOfBirth: "1985-01-07",
                            team: "Mercedes",
                            championYears: [
                                2008
                            ]
                        },
                        {
                            id: 4,
                            firstName: "james",
                            lastName: "hunt",
                            dateOfBirth: "1947-08-29",
                            team: "mclaren",
                            championYears: [
                                1976
                            ]
                        },
                        {
                            id: 3,
                            firstName: "Nico",
                            lastName: "Rosberg",
                            dateOfBirth: "1985-06-27",
                            team: "Mercedes",
                            championYears: null
                        }
                    ]);

                    expect(champs).to.be.an.instanceof(Champions);

                    expect(champs.get(0).get("firstName")).to.be.equal("Sebastian");
                    expect(champs.get(1).get("firstName")).to.be.equal("Jenson");
                    expect(champs.get(2).get("firstName")).to.be.equal("Lewis");
                    expect(champs.get(3).get("firstName")).to.be.equal("james");
                    expect(champs.get(4).get("firstName")).to.be.equal("Nico");
                });

                describe("#sort", function () {

                    it("should allow me to write a sort function", function () {

                        var arr = _.values(champs.getAll());

                        var result = champs.sort(function (a, b) {

                            expect(a).to.be.an("object")
                                .to.have.keys([
                                    "id", "model"
                                ]);
                            expect(a.id).to.be.a("string");
                            expect(champs.get(a.id)).to.be.an("object");

                            expect(b).to.be.an("object")
                                .to.have.keys([
                                    "id", "model"
                                ]);
                            expect(b.id).to.be.a("string");
                            expect(champs.get(b.id)).to.be.an("object");

                            /* Confirm that a contains a model */
                            var includedA = _.some(arr, function (model) {
                                return model === a.model;

                            });
                            expect(includedA).to.be.true;
                            expect(a.model).to.be.instanceof(Driver);

                            /* Confirm that b contains a model */
                            var includedB = _.some(arr, function (model) {
                                return model === b.model;

                            });
                            expect(includedB).to.be.true;
                            expect(b.model).to.be.instanceof(Driver);

                            /* Sort by last name */
                            if (a.model.get("lastName") < b.model.get("lastName")) {
                                return -1;
                            } else if (a.model.get("lastName") > b.model.get("lastName")) {
                                return 1;
                            } else {
                                return 0;
                            }

                        });

                        /* Hunt comes after Jenson now as he's in lower case */
                        expect(result).to.be.equal(champs);
                        expect(champs.toJSON()).to.be.eql([
                            {
                                id: 2,
                                firstName: "Jenson",
                                lastName: "Button",
                                team: "McLaren",
                                dateOfBirth: new Date("1980-01-19"),
                                championYears: [
                                    2009
                                ]
                            },
                            {
                                id: 0,
                                firstName: "Lewis",
                                lastName: "Hamilton",
                                team: "Mercedes",
                                dateOfBirth: new Date("1985-01-07"),
                                championYears: [
                                    2008
                                ]
                            },
                            {
                                id: 3,
                                firstName: "Nico",
                                lastName: "Rosberg",
                                dateOfBirth: new Date("1985-06-27"),
                                team: "Mercedes",
                                championYears: null
                            },
                            {
                                id: 1,
                                firstName: "Sebastian",
                                lastName: "Vettel",
                                team: "Red Bull",
                                dateOfBirth: new Date("1987-07-03"),
                                championYears: [
                                    2010,
                                    2011,
                                    2012,
                                    2013
                                ]
                            },
                            {
                                id: 4,
                                firstName: "james",
                                lastName: "hunt",
                                team: "mclaren",
                                dateOfBirth: new Date("1947-08-29"),
                                championYears: [
                                    1976
                                ]
                            }
                        ]);

                    });

                    it("should throw an error when a function not received", function () {

                        [
                            null,
                            undefined,
                            new Date(),
                            {},
                            [],
                            "string",
                            2.3,
                            4
                        ].forEach(function (input) {

                            var fail = false;

                            try {
                                champs.sort(input);
                            } catch (err) {
                                fail = true;

                                expect(err).to.be.instanceof(SyntaxError);
                                expect(err.message).to.be.equal("Collection.sort must receive a function");
                            } finally {
                                expect(fail).to.be.true;
                            }

                        });

                    });

                });

                describe("#sortBy", function () {

                    describe("receiving a string", function () {

                        it("should sort by key in ascending order without specifying order", function () {

                            var result = champs.sortBy("firstName");

                            expect(result).to.be.equal(champs);
                            expect(champs.toJSON()).to.be.eql([
                                {
                                    id: 4,
                                    firstName: "james",
                                    lastName: "hunt",
                                    team: "mclaren",
                                    dateOfBirth: new Date("1947-08-29"),
                                    championYears: [
                                        1976
                                    ]
                                },
                                {
                                    id: 2,
                                    firstName: "Jenson",
                                    lastName: "Button",
                                    team: "McLaren",
                                    dateOfBirth: new Date("1980-01-19"),
                                    championYears: [
                                        2009
                                    ]
                                },
                                {
                                    id: 0,
                                    firstName: "Lewis",
                                    lastName: "Hamilton",
                                    team: "Mercedes",
                                    dateOfBirth: new Date("1985-01-07"),
                                    championYears: [
                                        2008
                                    ]
                                },
                                {
                                    id: 3,
                                    firstName: "Nico",
                                    lastName: "Rosberg",
                                    dateOfBirth: new Date("1985-06-27"),
                                    team: "Mercedes",
                                    championYears: null
                                },
                                {
                                    id: 1,
                                    firstName: "Sebastian",
                                    lastName: "Vettel",
                                    team: "Red Bull",
                                    dateOfBirth: new Date("1987-07-03"),
                                    championYears: [
                                        2010,
                                        2011,
                                        2012,
                                        2013
                                    ]
                                }
                            ]);

                        });

                        it("should sort by key in ascending order by specifying order", function () {

                            var result = champs.sortBy("firstName", "asc");

                            expect(result).to.be.equal(champs);
                            expect(champs.toJSON()).to.be.eql([
                                {
                                    id: 4,
                                    firstName: "james",
                                    lastName: "hunt",
                                    team: "mclaren",
                                    dateOfBirth: new Date("1947-08-29"),
                                    championYears: [
                                        1976
                                    ]
                                },
                                {
                                    id: 2,
                                    firstName: "Jenson",
                                    lastName: "Button",
                                    team: "McLaren",
                                    dateOfBirth: new Date("1980-01-19"),
                                    championYears: [
                                        2009
                                    ]
                                },
                                {
                                    id: 0,
                                    firstName: "Lewis",
                                    lastName: "Hamilton",
                                    team: "Mercedes",
                                    dateOfBirth: new Date("1985-01-07"),
                                    championYears: [
                                        2008
                                    ]
                                },
                                {
                                    id: 3,
                                    firstName: "Nico",
                                    lastName: "Rosberg",
                                    dateOfBirth: new Date("1985-06-27"),
                                    team: "Mercedes",
                                    championYears: null
                                },
                                {
                                    id: 1,
                                    firstName: "Sebastian",
                                    lastName: "Vettel",
                                    team: "Red Bull",
                                    dateOfBirth: new Date("1987-07-03"),
                                    championYears: [
                                        2010,
                                        2011,
                                        2012,
                                        2013
                                    ]
                                }
                            ]);

                        });

                        it("should sort by descending order", function () {

                            var result = champs.sortBy("firstName", "DeSc");

                            expect(result).to.be.equal(champs);
                            expect(champs.toJSON()).to.be.eql([
                                {
                                    id: 1,
                                    firstName: "Sebastian",
                                    lastName: "Vettel",
                                    team: "Red Bull",
                                    dateOfBirth: new Date("1987-07-03"),
                                    championYears: [
                                        2010,
                                        2011,
                                        2012,
                                        2013
                                    ]
                                },
                                {
                                    id: 3,
                                    firstName: "Nico",
                                    lastName: "Rosberg",
                                    dateOfBirth: new Date("1985-06-27"),
                                    team: "Mercedes",
                                    championYears: null
                                },
                                {
                                    id: 0,
                                    firstName: "Lewis",
                                    lastName: "Hamilton",
                                    team: "Mercedes",
                                    dateOfBirth: new Date("1985-01-07"),
                                    championYears: [
                                        2008
                                    ]
                                },
                                {
                                    id: 2,
                                    firstName: "Jenson",
                                    lastName: "Button",
                                    team: "McLaren",
                                    dateOfBirth: new Date("1980-01-19"),
                                    championYears: [
                                        2009
                                    ]
                                },
                                {
                                    id: 4,
                                    firstName: "james",
                                    lastName: "hunt",
                                    team: "mclaren",
                                    dateOfBirth: new Date("1947-08-29"),
                                    championYears: [
                                        1976
                                    ]
                                }
                            ]);

                        });

                        it("should sort by one key with duplicate data with nothing else - ascending", function () {

                            var result = champs.sortBy("team", "ASC");

                            expect(result).to.be.equal(champs);
                            expect(champs.toJSON()).to.be.eql([
                                {
                                    id: 2,
                                    firstName: "Jenson",
                                    lastName: "Button",
                                    team: "McLaren",
                                    dateOfBirth: new Date("1980-01-19"),
                                    championYears: [
                                        2009
                                    ]
                                },
                                {
                                    id: 4,
                                    firstName: "james",
                                    lastName: "hunt",
                                    team: "mclaren",
                                    dateOfBirth: new Date("1947-08-29"),
                                    championYears: [
                                        1976
                                    ]
                                },
                                {
                                    id: 0,
                                    firstName: "Lewis",
                                    lastName: "Hamilton",
                                    team: "Mercedes",
                                    dateOfBirth: new Date("1985-01-07"),
                                    championYears: [
                                        2008
                                    ]
                                },
                                {
                                    id: 3,
                                    firstName: "Nico",
                                    lastName: "Rosberg",
                                    dateOfBirth: new Date("1985-06-27"),
                                    team: "Mercedes",
                                    championYears: null
                                },
                                {
                                    id: 1,
                                    firstName: "Sebastian",
                                    lastName: "Vettel",
                                    team: "Red Bull",
                                    dateOfBirth: new Date("1987-07-03"),
                                    championYears: [
                                        2010,
                                        2011,
                                        2012,
                                        2013
                                    ]
                                }
                            ]);

                        });

                        it("should sort by one key with duplicate data with nothing else - descending", function () {

                            var result = champs.sortBy("team", "DESC");

                            expect(result).to.be.equal(champs);
                            expect(champs.toJSON()).to.be.eql([
                                {
                                    id: 1,
                                    firstName: "Sebastian",
                                    lastName: "Vettel",
                                    team: "Red Bull",
                                    dateOfBirth: new Date("1987-07-03"),
                                    championYears: [
                                        2010,
                                        2011,
                                        2012,
                                        2013
                                    ]
                                },
                                {
                                    id: 0,
                                    firstName: "Lewis",
                                    lastName: "Hamilton",
                                    team: "Mercedes",
                                    dateOfBirth: new Date("1985-01-07"),
                                    championYears: [
                                        2008
                                    ]
                                },
                                {
                                    id: 3,
                                    firstName: "Nico",
                                    lastName: "Rosberg",
                                    dateOfBirth: new Date("1985-06-27"),
                                    team: "Mercedes",
                                    championYears: null
                                },
                                {
                                    id: 2,
                                    firstName: "Jenson",
                                    lastName: "Button",
                                    team: "McLaren",
                                    dateOfBirth: new Date("1980-01-19"),
                                    championYears: [
                                        2009
                                    ]
                                },
                                {
                                    id: 4,
                                    firstName: "james",
                                    lastName: "hunt",
                                    team: "mclaren",
                                    dateOfBirth: new Date("1947-08-29"),
                                    championYears: [
                                        1976
                                    ]
                                }
                            ]);

                        });

                        it("should sort by two keys", function () {

                            var result = champs.sortBy({
                                team: "ASC",
                                lastName: "ASC"
                            });

                            expect(result).to.be.equal(champs);
                            expect(champs.toJSON()).to.be.eql([
                                {
                                    id: 2,
                                    firstName: "Jenson",
                                    lastName: "Button",
                                    team: "McLaren",
                                    dateOfBirth: new Date("1980-01-19"),
                                    championYears: [
                                        2009
                                    ]
                                },
                                {
                                    id: 4,
                                    firstName: "james",
                                    lastName: "hunt",
                                    team: "mclaren",
                                    dateOfBirth: new Date("1947-08-29"),
                                    championYears: [
                                        1976
                                    ]
                                },
                                {
                                    id: 0,
                                    firstName: "Lewis",
                                    lastName: "Hamilton",
                                    team: "Mercedes",
                                    dateOfBirth: new Date("1985-01-07"),
                                    championYears: [
                                        2008
                                    ]
                                },
                                {
                                    id: 3,
                                    firstName: "Nico",
                                    lastName: "Rosberg",
                                    dateOfBirth: new Date("1985-06-27"),
                                    team: "Mercedes",
                                    championYears: null
                                },
                                {
                                    id: 1,
                                    firstName: "Sebastian",
                                    lastName: "Vettel",
                                    team: "Red Bull",
                                    dateOfBirth: new Date("1987-07-03"),
                                    championYears: [
                                        2010,
                                        2011,
                                        2012,
                                        2013
                                    ]
                                }
                            ]);

                        });

                        it("should sort by an integer", function () {

                            var result = champs.sortBy("id");

                            expect(result).to.be.equal(champs);
                            expect(champs.toJSON()).to.be.eql([
                                {
                                    id: 0,
                                    firstName: "Lewis",
                                    lastName: "Hamilton",
                                    team: "Mercedes",
                                    dateOfBirth: new Date("1985-01-07"),
                                    championYears: [
                                        2008
                                    ]
                                },
                                {
                                    id: 1,
                                    firstName: "Sebastian",
                                    lastName: "Vettel",
                                    team: "Red Bull",
                                    dateOfBirth: new Date("1987-07-03"),
                                    championYears: [
                                        2010,
                                        2011,
                                        2012,
                                        2013
                                    ]
                                },
                                {
                                    id: 2,
                                    firstName: "Jenson",
                                    lastName: "Button",
                                    team: "McLaren",
                                    dateOfBirth: new Date("1980-01-19"),
                                    championYears: [
                                        2009
                                    ]
                                },
                                {
                                    id: 3,
                                    firstName: "Nico",
                                    lastName: "Rosberg",
                                    dateOfBirth: new Date("1985-06-27"),
                                    team: "Mercedes",
                                    championYears: null
                                },
                                {
                                    id: 4,
                                    firstName: "james",
                                    lastName: "hunt",
                                    team: "mclaren",
                                    dateOfBirth: new Date("1947-08-29"),
                                    championYears: [
                                        1976
                                    ]
                                }
                            ]);

                        });

                        it("should sort by an integer descending", function () {

                            var result = champs.sortBy("id", "DESC");

                            expect(result).to.be.equal(champs);
                            expect(champs.toJSON()).to.be.eql([
                                {
                                    id: 4,
                                    firstName: "james",
                                    lastName: "hunt",
                                    team: "mclaren",
                                    dateOfBirth: new Date("1947-08-29"),
                                    championYears: [
                                        1976
                                    ]
                                },
                                {
                                    id: 3,
                                    firstName: "Nico",
                                    lastName: "Rosberg",
                                    dateOfBirth: new Date("1985-06-27"),
                                    team: "Mercedes",
                                    championYears: null
                                },
                                {
                                    id: 2,
                                    firstName: "Jenson",
                                    lastName: "Button",
                                    team: "McLaren",
                                    dateOfBirth: new Date("1980-01-19"),
                                    championYears: [
                                        2009
                                    ]
                                },
                                {
                                    id: 1,
                                    firstName: "Sebastian",
                                    lastName: "Vettel",
                                    team: "Red Bull",
                                    dateOfBirth: new Date("1987-07-03"),
                                    championYears: [
                                        2010,
                                        2011,
                                        2012,
                                        2013
                                    ]
                                },
                                {
                                    id: 0,
                                    firstName: "Lewis",
                                    lastName: "Hamilton",
                                    team: "Mercedes",
                                    dateOfBirth: new Date("1985-01-07"),
                                    championYears: [
                                        2008
                                    ]
                                }
                            ]);

                        });

                        it("should receive an array of keys and sort in ascending order", function () {

                            var result = champs.sortBy([
                                "firstName"
                            ]);

                            expect(result).to.be.equal(champs);
                            expect(champs.toJSON()).to.be.eql([
                                {
                                    id: 4,
                                    firstName: "james",
                                    lastName: "hunt",
                                    team: "mclaren",
                                    dateOfBirth: new Date("1947-08-29"),
                                    championYears: [
                                        1976
                                    ]
                                },
                                {
                                    id: 2,
                                    firstName: "Jenson",
                                    lastName: "Button",
                                    team: "McLaren",
                                    dateOfBirth: new Date("1980-01-19"),
                                    championYears: [
                                        2009
                                    ]
                                },
                                {
                                    id: 0,
                                    firstName: "Lewis",
                                    lastName: "Hamilton",
                                    team: "Mercedes",
                                    dateOfBirth: new Date("1985-01-07"),
                                    championYears: [
                                        2008
                                    ]
                                },
                                {
                                    id: 3,
                                    firstName: "Nico",
                                    lastName: "Rosberg",
                                    dateOfBirth: new Date("1985-06-27"),
                                    team: "Mercedes",
                                    championYears: null
                                },
                                {
                                    id: 1,
                                    firstName: "Sebastian",
                                    lastName: "Vettel",
                                    team: "Red Bull",
                                    dateOfBirth: new Date("1987-07-03"),
                                    championYears: [
                                        2010,
                                        2011,
                                        2012,
                                        2013
                                    ]
                                }
                            ]);

                        });

                        it("should not pass in a non-string in the array", function () {

                            var result = champs.sortBy([
                                {}
                            ]);

                            expect(result).to.be.equal(champs);
                            expect(champs.toJSON()).to.be.eql([
                                {
                                    id: 1,
                                    firstName: "Sebastian",
                                    lastName: "Vettel",
                                    team: "Red Bull",
                                    dateOfBirth: new Date("1987-07-03"),
                                    championYears: [
                                        2010,
                                        2011,
                                        2012,
                                        2013
                                    ]
                                },
                                {
                                    id: 2,
                                    firstName: "Jenson",
                                    lastName: "Button",
                                    team: "McLaren",
                                    dateOfBirth: new Date("1980-01-19"),
                                    championYears: [
                                        2009
                                    ]
                                },
                                {
                                    id: 0,
                                    firstName: "Lewis",
                                    lastName: "Hamilton",
                                    team: "Mercedes",
                                    dateOfBirth: new Date("1985-01-07"),
                                    championYears: [
                                        2008
                                    ]
                                },
                                {
                                    id: 4,
                                    firstName: "james",
                                    lastName: "hunt",
                                    team: "mclaren",
                                    dateOfBirth: new Date("1947-08-29"),
                                    championYears: [
                                        1976
                                    ]
                                },
                                {
                                    id: 3,
                                    firstName: "Nico",
                                    lastName: "Rosberg",
                                    dateOfBirth: new Date("1985-06-27"),
                                    team: "Mercedes",
                                    championYears: null
                                }
                            ]);

                        });

                        it("should throw an error with non-string, array or object", function () {

                            [
                                undefined,
                                function () {
                                },
                                null
                            ].forEach(function (input) {

                                var fail = false;

                                try {
                                    var result = champs.sortBy(input);
                                } catch (err) {
                                    fail = true;

                                    expect(err).to.be.instanceof(SyntaxError);
                                    expect(err.message).to.be.equal("Collection.sortBy must receive string, object or array");
                                } finally {
                                    expect(fail).to.be.true;
                                }

                            });

                        });

                    });

                });

            });

            describe("#where", function () {

                describe("single property", function () {

                    it("should return a single result", function () {

                        var orig = obj.clone();

                        var out = obj.where({
                            float: 2.2
                        });

                        expect(out).to.be.instanceof(Collection)
                            .to.be.equal(obj);
                        expect(out.getCount()).to.be.equal(1);
                        expect(orig.get(0)).to.be.equal(out.get(0));

                    });

                    it("should return multiple results", function () {

                        var orig = obj.clone();

                        var out = obj.where({
                            float: 2.3
                        });

                        expect(out).to.be.instanceof(Collection)
                            .to.be.equal(obj);
                        expect(out.getCount()).to.be.equal(2);
                        expect(orig.get(1)).to.be.equal(out.get(0));
                        expect(orig.get(2)).to.be.equal(out.get(1));

                    });

                    it("should return no results", function () {

                        var out = obj.where({
                            float: "nothing"
                        });

                        expect(out).to.be.instanceof(Collection)
                            .to.be.equal(obj);
                        expect(out.getCount()).to.be.equal(0);

                    });

                    it("should search an instance of an object and return one result", function () {

                        var out = obj.where({
                            date: new Date("2010-02-07")
                        });

                        expect(out).to.be.instanceof(Collection)
                            .to.be.equal(obj);
                        expect(out.getCount()).to.be.equal(1);

                    });

                    it("should search an instance of an object and return multiple results", function () {

                        /* Change the third collection object */
                        obj.get(2).set("date", "2010-02-08");

                        var out = obj.where({
                            date: new Date("2010-02-08")
                        });

                        expect(out).to.be.instanceof(Collection)
                            .to.be.equal(obj);
                        expect(out.getCount()).to.be.equal(2);

                    });

                    it("should search an instance of an object and return nothing", function () {

                        var out = obj.where({
                            date: new Date("2010-02-01")
                        });

                        expect(out).to.be.instanceof(Collection)
                            .to.be.equal(obj);
                        expect(out.getCount()).to.be.equal(0);

                    });

                    it("should cast to the datatype and return one result", function () {

                        var out = obj.where({
                            float: "2.2"
                        });

                        expect(out).to.be.instanceof(Collection)
                            .to.be.equal(obj);
                        expect(out.getCount()).to.be.equal(1);

                    });

                    it("should cast to the datatype and return multiple results", function () {

                        var out = obj.where({
                            float: "2.3"
                        });

                        expect(out).to.be.instanceof(Collection)
                            .to.be.equal(obj);
                        expect(out.getCount()).to.be.equal(2);

                    });

                    it("should cast to the datatype and return no results", function () {

                        var out = obj.where({
                            float: "2"
                        });

                        expect(out).to.be.instanceof(Collection)
                            .to.be.equal(obj);
                        expect(out.getCount()).to.be.equal(0);

                    });

                });

                describe("multiple properties", function () {

                    it("should return a single result", function () {

                        var orig = obj.clone();

                        var out = obj.where({
                            float: 2.2,
                            string: "string"
                        });

                        expect(out).to.be.instanceof(Collection)
                            .to.be.equal(obj);
                        expect(out.getCount()).to.be.equal(1);
                        expect(orig.get(0)).to.be.equal(out.get(0));

                    });

                });

                it("should return multiple results", function () {

                    var orig = obj.clone();

                    var out = obj.where({
                        float: 2.3,
                        string: "string"
                    });

                    expect(out).to.be.instanceof(Collection)
                        .to.be.equal(obj);
                    expect(out.getCount()).to.be.equal(2);
                    expect(orig.get(1)).to.be.equal(out.get(0));
                    expect(orig.get(2)).to.be.equal(out.get(1));

                });

                it("should return no results", function () {

                    var out = obj.where({
                        float: 2.3,
                        string: "nothing"
                    });

                    expect(out).to.be.instanceof(Collection)
                        .to.be.equal(obj);
                    expect(out.getCount()).to.be.equal(0);

                });

                it("should search an instance of an object and return one result", function () {

                    var out = obj.where({
                        float: 2.2,
                        integer: 2
                    });

                    expect(out).to.be.instanceof(Collection)
                        .to.be.equal(obj);
                    expect(out.getCount()).to.be.equal(1);

                });

                it("should search an instance of an object and return multiple results", function () {

                    var out = obj.where({
                        float: 2.3,
                        integer: 2
                    });

                    expect(out).to.be.instanceof(Collection)
                        .to.be.equal(obj);
                    expect(out.getCount()).to.be.equal(2);

                });

                it("should search an instance of an object and return nothing", function () {

                    var out = obj.where({
                        float: 2.1,
                        integer: 2
                    });

                    expect(out).to.be.instanceof(Collection)
                        .to.be.equal(obj);
                    expect(out.getCount()).to.be.equal(0);

                });

                it("should cast to the datatype and return one result", function () {

                    var out = obj.where({
                        integer: "2",
                        date: "2010-02-07"
                    });

                    expect(out).to.be.instanceof(Collection)
                        .to.be.equal(obj);
                    expect(out.getCount()).to.be.equal(1);

                });

                it("should cast to the datatype and return multiple results", function () {

                    /* Change the third collection object */
                    obj.get(2).set("date", "2010-02-08");

                    var out = obj.where({
                        integer: "2",
                        date: "2010-02-08"
                    });

                    expect(out).to.be.instanceof(Collection)
                        .to.be.equal(obj);
                    expect(out.getCount()).to.be.equal(2);

                });

                it("should cast to the datatype and return no results", function () {

                    var out = obj.where({
                        integer: "2",
                        date: "2010-02-10"
                    });

                    expect(out).to.be.instanceof(Collection)
                        .to.be.equal(obj);
                    expect(out.getCount()).to.be.equal(0);

                });

                it("should throw an error if non-object passed in", function () {

                    var fail = false;

                    try {
                        obj.where();
                    } catch (err) {

                        fail = true;
                        expect(err).to.be.instanceof(SyntaxError);
                        expect(err.message).to.be.equal("where.props must be an object");

                    } finally {

                        expect(fail).to.be.true;

                    }
                });

            });

        });

    });

    describe("Static methods", function () {

        describe("#toModels", function () {

            it("should convert a database objects into a collection model", function () {

                var obj = Collection.toModels({
                    boolean: true,
                    date: new Date("2010-02-07"),
                    float: 2.3,
                    int: 3,
                    string: "string"
                });

                expect(obj).to.be.instanceof(Collection);

                expect(obj.getCount()).to.be.equal(1);
                expect(obj.get(0)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 3,
                        string: "string"
                    }
                ]);

            });

            it("should convert an array of database objects into a collection model", function () {

                var obj = Collection.toModels([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        int: 3,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        int: 2,
                        string: "string"
                    }
                ]);

                expect(obj).to.be.instanceof(Collection);

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.get(0)).to.be.instanceof(Model);
                expect(obj.get(1)).to.be.instanceof(Model);

                expect(obj.toJSON()).to.be.eql([
                    {
                        boolean: true,
                        date: new Date("2010-02-07"),
                        float: 2.3,
                        integer: 3,
                        string: "string"
                    },
                    {
                        boolean: true,
                        date: new Date("2010-02-08"),
                        float: 2.3,
                        integer: 2,
                        string: "string"
                    }
                ]);

            });

            it("should not push some rubbish object to a model", function () {

                var obj = Collection.toModels({});

                expect(obj).to.be.instanceof(Collection);

                expect(obj.getCount()).to.be.equal(0);

            });

            it("should not push some rubbish array to a model", function () {

                var obj = Collection.toModels([
                    {},
                    null,
                    Date,
                    function () {
                    },
                    "string",
                    2.3,
                    4,
                    true,
                    false,
                    undefined,
                    Infinity,
                    NaN,
                    []
                ]);

                expect(obj).to.be.instanceof(Collection);

                expect(obj.getCount()).to.be.equal(0);

            });

            it("should not push a non-array or non-object to a model", function () {

                [
                    null,
                    Date,
                    function () {
                    },
                    "string",
                    2.3,
                    4,
                    true,
                    false,
                    undefined,
                    Infinity,
                    NaN
                ].forEach(function (input) {

                    var obj = Collection.toModels(input);

                    expect(obj).to.be.instanceof(Collection);

                    expect(obj.getCount()).to.be.equal(0);

                });

            });

        });

    });

    describe("#validate", function () {

        var SubModel,
            SubCollection;
        beforeEach(function () {

            SubModel = DomainModel.extend({

                definition: {
                    id: {
                        type: "string",
                        validation: [{
                            rule: "required"
                        }]
                    },
                    name: {
                        type: "string",
                        validation: [{
                            rule: "minLength",
                            param: 2
                        }, {
                            rule: function (objModel, value) {
                                return value === "Bob";
                            }
                        }]
                    }
                }

            });

            SubCollection = Collection.extend({

                model: SubModel

            });

        });

        describe("Collection", function () {

            it("should validate a collection with no erroring models", function () {

                var obj = new SubCollection([{
                    id: "someid",
                    name: "Bob"
                }]);

                expect(obj.validate()).to.be.true;

            });

            it("should validate a collection with one erroring models", function () {

                var obj = new SubCollection([{
                    id: "someid",
                    name: "Bob"
                }, {
                    name: "K"
                }]);

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("COLLECTION_ERROR");

                    expect(_.size(err.errors)).to.be.equal(1);

                    expect(err.errors[1]).to.be.instanceof(ValidationErr);

                    expect(err.errors[1].getErrors()).to.be.eql({
                        id: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        name: [{
                            message: "VALUE_LESS_THAN_MIN_LENGTH",
                            value: "K",
                            additional: [
                                2
                            ]
                        }, {
                            message: "CUSTOM_VALIDATION_FAILED",
                            value: "K"
                        }]
                    });

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should validate a collection with multiple erroring models", function () {

                var obj = new SubCollection([{
                    name: "B"
                }, {
                    name: "K"
                }]);

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("COLLECTION_ERROR");

                    expect(_.size(err.errors)).to.be.equal(2);

                    expect(err.errors[0]).to.be.instanceof(ValidationErr);
                    expect(err.errors[1]).to.be.instanceof(ValidationErr);

                    expect(err.errors[0].getErrors()).to.be.eql({
                        id: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        name: [{
                            message: "VALUE_LESS_THAN_MIN_LENGTH",
                            value: "B",
                            additional: [
                                2
                            ]
                        }, {
                            message: "CUSTOM_VALIDATION_FAILED",
                            value: "B"
                        }]
                    });

                    expect(err.errors[1].getErrors()).to.be.eql({
                        id: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        name: [{
                            message: "VALUE_LESS_THAN_MIN_LENGTH",
                            value: "K",
                            additional: [
                                2
                            ]
                        }, {
                            message: "CUSTOM_VALIDATION_FAILED",
                            value: "K"
                        }]
                    });

                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

    });

});
