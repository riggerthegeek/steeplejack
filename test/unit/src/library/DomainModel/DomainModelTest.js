var expect = require("chai").expect;

/* Called "model" so I can copy the modelTest from datautils */
var _ = require("lodash");
var Main = require("../../../../../src/Main");
var Base = Main.Base;
var datautils = Base.datatypes;
var model = Main.Model;
var collection = Main.Collection;

describe("DomainModel tests - using new", function () {

    describe("Instantiation tests", function () {

        it("should define a model with no definition", function (done) {

            /* Define the model */
            var Model = model.extend();

            var obj = new Model();

            expect(obj).to.be.instanceof(require("events").EventEmitter);
            expect(obj).to.be.instanceof(Model);
            expect(obj.toData()).to.be.eql({});
            expect(obj.toObject()).to.be.eql({});
            expect(obj.set("invalid", "a string")).to.be.equal(obj);
            expect(obj.get("invalid")).to.be.undefined;

            done();

        });

        describe("Model with definitions", function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        array: {
                            type: "array"
                        },
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
                        object: {
                            type: "object"
                        },
                        string: {
                            type: "string"
                        }
                    }
                });

            });

            it("should convert a submodel to it's data representation", function () {

                var SubModel = model.extend({

                    definition: {

                        id: {
                            type: "string",
                            column: "_id"
                        }

                    }

                });

                var OtherModel = model.extend({

                    definition: {

                        id: {
                            type: "string",
                            column: "_id"
                        },

                        model: {
                            type: SubModel
                        }

                    }

                });

                var obj = new OtherModel({
                    id: "1234",
                    model: {
                        id: "2468"
                    }
                });

                expect(obj.toData()).to.be.eql({
                    _id: "1234",
                    model: {
                        _id: "2468"
                    }
                });

            });

            it("should convert a collection to it's data representation", function () {

                var SubModel = model.extend({

                    definition: {

                        id: {
                            type: "string",
                            column: "_id"
                        }

                    }

                });

                var SubCollection = collection.extend({

                    model: SubModel

                });

                var OtherModel = model.extend({

                    definition: {

                        id: {
                            type: "string",
                            column: "_id"
                        },

                        model: {
                            type: SubCollection
                        }

                    }

                });

                var obj = new OtherModel({
                    id: "1234",
                    model: [{
                        id: "2468"
                    }]
                });

                expect(obj.toData()).to.be.eql({
                    _id: "1234",
                    model: [{
                        _id: "2468"
                    }]
                });

            });

            it("should define a model with definitions", function (done) {

                var obj1 = new Model({
                    array: [
                        "an", "array of", ["stuff", 2]
                    ],
                    boolean: false,
                    date: "2013-02-07 10:11:12",
                    float: "2.3",
                    integer: 89034,
                    object: {
                        an: "object", "with": "things", and: 2
                    },
                    string: "some string"
                });

                expect(obj1.getDefinition("array").getSetting("test")).to.be.undefined;

                expect(obj1).to.be.instanceof(Model);

                expect(obj1.toData()).to.be.eql({
                    array: [
                        "an", "array of", ["stuff", 2]
                    ],
                    boolean: false,
                    date: new Date("2013-02-07 10:11:12"),
                    float: 2.3,
                    int: 89034,
                    object: {
                        an: "object", "with": "things", and: 2
                    },
                    string: "some string"
                });
                expect(obj1.toObject()).to.be.eql({
                    array: [
                        "an", "array of", ["stuff", 2]
                    ],
                    boolean: false,
                    date: new Date("2013-02-07 10:11:12"),
                    float: 2.3,
                    integer: 89034,
                    object: {
                        an: "object", "with": "things", and: 2
                    },
                    string: "some string"
                });
                expect(obj1.set("invalid", "a string")).to.be.equal(obj1);
                expect(obj1.get("invalid")).to.be.undefined;

                expect(obj1.set("integer", 12345)).to.be.equal(obj1);
                expect(obj1.get("integer")).to.be.equal(12345);

                done();

            });

            it("should return default values if nothing set", function (done) {

                var obj = new Model();

                expect(obj).to.be.instanceof(Model);

                expect(obj.toObject()).to.be.eql({
                    array: null,
                    boolean: false,
                    date: null,
                    float: null,
                    integer: null,
                    object: null,
                    string: null
                });

                /* Check stuff can be set */
                obj.set("integer", "12345");
                expect(obj.get("integer")).to.be.equal(12345);

                obj.set("boolean", "t");
                expect(obj.get("boolean")).to.be.true;

                done();

            });

            it("should create a model from data", function (done) {

                var obj = Model.toModel({
                    boolean: "1",
                    date: "2013-02-07 10:20:30",
                    float: "3",
                    int: 4,
                    string: "hello this is a string"
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.toObject()).to.be.eql({
                    array: null,
                    boolean: true,
                    date: new Date("2013-02-07 10:20:30"),
                    float: 3,
                    integer: 4,
                    object: null,
                    string: "hello this is a string"
                });

                /* Check stuff can be set */
                obj.set("integer", "12345");
                expect(obj.get("integer")).to.be.equal(12345);

                obj.set("boolean", 0);
                expect(obj.get("boolean")).to.be.false;

                done();

            });

            it('should ignore undefined elements', function (done) {

                var obj = Model.toModel({
                    boolean: "N",
                    bool: true
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.toObject()).to.be.eql({
                    array: null,
                    boolean: false,
                    date: null,
                    float: null,
                    integer: null,
                    object: null,
                    string: null
                });

                done();

            });

            it("should throw an error when no datatype set", function (done) {

                var NewModel = model.extend({
                    definition: {
                        key: {
                            value: null
                        }
                    }
                });

                var obj;
                var fail = false;

                try {
                    obj = new NewModel();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("DATATYPE_NOT_VALID");
                    expect(err.type).to.be.null;
                }

                expect(fail).to.be.true;

                done();

            });

            it("should pass a Model as a definition", function () {

                var NewModel = model.extend({
                    definition: {
                        id: {
                            type: "integer",
                            value: null
                        },
                        model: {
                            type: Model,
                            value: null
                        }
                    }
                });

                var objModel = {
                    array: [
                        "an", "array of", ["stuff", 2]
                    ],
                    boolean: 0,
                    date: "2013-02-07 10:11:12",
                    float: "2.3",
                    integer: 89034,
                    object: {
                        an: "object", "with": "things", and: 2
                    },
                    string: "some string"
                };

                var obj = new NewModel({
                    id: "2",
                    model: objModel
                });

                expect(obj).to.be.instanceof(NewModel);
                expect(obj.get("id")).to.be.equal(2);
                expect(obj.get("model")).to.be.instanceof(Model);

                expect(obj.toObject()).to.be.eql({
                    "id": 2,
                    "model": {
                        "array": [
                            "an",
                            "array of",
                            [
                                "stuff",
                                2
                            ]
                        ],
                        "boolean": false,
                        "date": new Date("2013-02-07T10:11:12.000Z"),
                        "float": 2.3,
                        "integer": 89034,
                        "object": {
                            "an": "object",
                            "with": "things",
                            "and": 2
                        },
                        "string": "some string"
                    }
                });

            });

        });

        describe("Model getters and setters", function () {

            it("should use the default setter", function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        simple: {
                            type: 'string',
                            value: null
                        }
                    }
                });

                var obj = new Model({
                    simple: 'hello'
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.get('simple')).to.be.equal('hello');

                expect(obj.set('simple', 'test')).to.be.equal(obj);
                expect(obj.get('simple')).to.be.equal('test');

                expect(obj.set('simple')).to.be.equal(obj);
                expect(obj.get('simple')).to.be.null;

                done();

            });

            it('should use the defined setter', function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        complex: {
                            type: 'string',
                            value: null
                        }
                    },
                    setComplex: function setter (value, defaults) {

                        value = datautils.setString(value, defaults);

                        if (value !== defaults) {
                            value = "test-" + value;
                        }

                        this.set('complex', value, false);

                        /* Wouldn't normally return on a setter, but allow functionality */
                        return true;
                    }
                });

                var obj = new Model({
                    complex: 'hello'
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.get('complex')).to.be.equal('test-hello');

                expect(obj.set('complex', 'test')).to.be.true;
                expect(obj.get('complex')).to.be.equal('test-test');

                expect(obj.set('complex')).to.be.true;
                expect(obj.get('complex')).to.be.null;

                done();

            });

            it("should only set a value if it's an enumerable value", function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        str: {
                            type: 'enum',
                            enum: [
                                "value1", "value2"
                            ],
                            value: null
                        }
                    }
                });

                var obj1 = new Model({
                    str: "value1"
                });

                expect(obj1.get("str")).to.be.equal("value1");
                obj1.set("str", "value2");
                expect(obj1.get("str")).to.be.equal("value2");
                obj1.set("str", "value3");
                expect(obj1.get("str")).to.be.null;

                var obj2 = new Model({
                    str: "value2"
                });

                expect(obj2.get("str")).to.be.equal("value2");
                obj2.set("str", "value1");
                expect(obj2.get("str")).to.be.equal("value1");
                obj2.set("str", "value3");
                expect(obj2.get("str")).to.be.null;

                var obj3 = new Model({
                    str: "value3"
                });

                expect(obj3.get("str")).to.be.null;
                obj3.set("str", "value1");
                expect(obj3.get("str")).to.be.equal("value1");
                obj3.set("str", "value2");
                expect(obj3.get("str")).to.be.equal("value2");

                done();

            });

        });

        describe("Methods", function () {

            describe("#GetColumnKeys", function () {

                it("should return empty array when model has no definition", function (done) {

                    var Model = model.extend();

                    var obj = new Model();

                    expect(obj.getColumnKeys()).to.be.an("array").to.be.empty;

                    done();

                });

            });

            describe("#getDefinition", function () {

                it("should return null if key not a string", function (done) {

                    var Model = model.extend();

                    var obj = new Model();

                    expect(obj.getDefinition(Date)).to.be.null;

                    done();

                });

                it("should return null if key not a set definition", function (done) {

                    var Model = model.extend({
                        definition: {
                            string: {
                                type: "string"
                            }
                        }
                    });

                    var obj = new Model();

                    expect(obj.getDefinition("string")).to.not.be.null;
                    expect(obj.getDefinition("key")).to.be.null;

                    done();

                });

            });

            describe("#where", function () {

                var obj, Model;
                beforeEach(function () {
                    Model = model.extend({
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

                    obj = Model.create({
                        boolean: "true",
                        date: "2010-02-07",
                        float: "2.2",
                        integer: "2",
                        string: "string"
                    });
                });

                it("should return true when same type given and one param passed in", function () {

                    var out = obj.where({
                        float: 2.2
                    });

                    expect(out).to.be.true;

                });

                it("should return true when multiple params of same type are passed in", function () {

                    var out = obj.where({
                        float: 2.2,
                        string: "string"
                    });

                    expect(out).to.be.true;

                });

                it("should return true when the input needs casting to the datatype", function () {
                    expect(obj.where({
                        float: "2.2"
                    })).to.be.true;
                });

                it("should return true when the input needs casting to the datatype", function () {
                    expect(obj.where({
                        float: "2.2",
                        date: "2010-02-07"
                    })).to.be.true;
                });

                it("should return true when an object that's not identical is received", function () {
                    expect(obj.where({
                        date: new Date("2010-02-07")
                    })).to.be.true;
                });

                it("should always return false if the input object is empty", function () {

                    expect(obj.where({})).to.be.false;

                });

                it("should throw an error if non-object passed in", function () {

                    [
                        [],
                        null,
                        "string",
                        2.3,
                        4,
                        function () {
                        },
                        undefined
                    ].forEach(function (input) {

                            var fail = false;

                            try {
                                obj.where(input);
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

            describe("#toObject", function () {

                it("should export to an object literal", function () {

                    var Model = model.extend({
                        definition: {
                            str: {
                                type: "string",
                                value: null
                            },
                            bool: {
                                type: "boolean",
                                value: false
                            },
                            obj: {
                                type: "object",
                                value: null
                            }
                        }
                    });

                    var obj = Model.create({
                        str: "hello",
                        bool: true,
                        obj: {
                            hello: "world"
                        }
                    });

                    expect(obj.toObject()).to.not.be.instanceof(Model);
                    expect(obj.toObject())
                        .to.be.eql({
                            str: "hello",
                            bool: true,
                            obj: {
                                hello: "world"
                            }
                        });

                });

                it("should export a DomainModel instance", function () {

                    var Obj = model.extend({
                        definition: {
                            str: {
                                type: "string",
                                value: null
                            },
                            bool: {
                                type: "boolean",
                                value: false
                            }
                        }
                    });

                    var Model = model.extend({
                        definition: {
                            str: {
                                type: "string",
                                value: null
                            },
                            bool: {
                                type: "boolean",
                                value: false
                            },
                            obj: {
                                type: "object",
                                value: null
                            }
                        },
                        setObj: function (value, defaults) {
                            this.set("obj", Obj.create(value), false);
                        }
                    });

                    var obj = Model.create({
                        str: "hello",
                        bool: true,
                        obj: {
                            str: "world",
                            bool: false
                        }
                    });

                    expect(obj.toObject()).to.not.be.instanceof(Model)
                        .to.not.be.instanceof(Obj);

                    expect(obj.toObject()).to.be.eql({
                        str: "hello",
                        bool: true,
                        obj: {
                            str: "world",
                            bool: false
                        }
                    });

                });

                it("should output a value that's an instance of Collection", function () {

                    var Collection = collection.extend({
                        model: model.extend({
                            definition: {
                                string: {
                                    type: "string",
                                    value: null
                                }
                            }
                        })
                    });

                    var Model = model.extend({
                        definition: {
                            str: {
                                type: "string",
                                value: null
                            },
                            collection: {
                                type: Collection,
                                value: null
                            }
                        }
                    });

                    var obj = new Model({
                        str: "hello",
                        collection: {
                            string: "world"
                        }
                    });

                    expect(obj.get("str")).to.be.equal("hello");
                    expect(obj.get("collection")).to.be.instanceof(Collection);

                    expect(obj.toObject()).to.be.eql({
                        str: "hello",
                        collection: [{
                            string: "world"
                        }]
                    });

                });

                it("should allow an array to be added to a Collection", function () {

                    var Collection = collection.extend({
                        model: model.extend({
                            definition: {
                                string: {
                                    type: "string",
                                    value: null
                                }
                            }
                        })
                    });

                    var Model = model.extend({
                        definition: {
                            str: {
                                type: "string",
                                value: null
                            },
                            collection: {
                                type: Collection,
                                value: null
                            }
                        }
                    });

                    var obj = new Model({
                        str: "hello",
                        collection: [{
                            string: "world"
                        }]
                    });

                    expect(obj.get("str")).to.be.equal("hello");
                    expect(obj.get("collection")).to.be.instanceof(Collection);

                    expect(obj.toObject()).to.be.eql({
                        str: "hello",
                        collection: [{
                            string: "world"
                        }]
                    });

                });

            });

        });

        describe("Primary keys", function () {

            it('should set no primary key value', function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        dataId: {
                            type: "integer",
                            value: null,
                            column: "id"
                        },
                        name: {
                            type: "string"
                        }
                    }
                });

                var obj = new Model({
                    dataId: 1,
                    name: "Dave"
                });

                expect(obj.getPrimaryKey()).to.be.null;
                expect(obj.getPrimaryKeyValue()).to.be.undefined;

                var from = Model.toModel({
                    id: 1,
                    name: "Dave"
                });

                expect(from.getPrimaryKey()).to.be.null;
                expect(from.getPrimaryKeyValue()).to.be.undefined;

                done();

            });

            it('should set the primary key', function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        dataId: {
                            type: "integer",
                            value: null,
                            column: "id",
                            primaryKey: true
                        },
                        name: {
                            type: "string"
                        }
                    }
                });

                var obj = new Model();

                expect(obj.getPrimaryKey()).to.be.equal("dataId");
                expect(obj.getPrimaryKeyValue()).to.be.null;

                var from = Model.toModel();

                expect(from.getPrimaryKey()).to.be.equal("dataId");
                expect(from.getPrimaryKeyValue()).to.be.null;

                done();

            });

            it('should set the primary key value', function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        dataId: {
                            type: "integer",
                            value: null,
                            column: "id",
                            primaryKey: true
                        },
                        name: {
                            type: "string"
                        }
                    }
                });

                var obj = new Model({
                    dataId: 1,
                    name: "Dave"
                });

                expect(obj.getPrimaryKey()).to.be.equal("dataId");
                expect(obj.getPrimaryKeyValue()).to.be.equal(1);

                var from = Model.toModel({
                    id: 1,
                    name: "Dave"
                });

                expect(from.getPrimaryKey()).to.be.equal("dataId");
                expect(from.getPrimaryKeyValue()).to.be.equal(1);

                done();

            });

            it('should throw error when more than one primary key is given', function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        dataId: {
                            type: "integer",
                            value: null,
                            column: "id",
                            primaryKey: true
                        },
                        name: {
                            type: "string",
                            value: null,
                            primaryKey: true
                        }
                    }
                });

                var fail = false;

                try {
                    obj = new Model();
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("CANNOT_SET_MULTIPLE_PRIMARY_KEYS");

                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe("The mixed datatype", function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        mixed: {
                            type: "mixed",
                            value: null
                        }
                    }
                });

            });

            it('should create a mixed definition', function (done) {

                var obj = new Model({
                    mixed: "string"
                });

                expect(obj.get("mixed")).to.be.equal("string");

                /* Now set all datatypes */
                var arrTypes = [
                    "222",
                    222,
                    22.22,
                    new Date(),
                    {},
                    {type: "string"},
                    ["array"],
                    null,
                    true,
                    false
                ];

                arrTypes.forEach(function (value) {

                    expect(obj.set("mixed", value)).to.be.equal(obj);
                    expect(obj.get("mixed")).to.be.equal(value);

                });

                var arrObjTypes = [
                    NaN
                ];

                arrObjTypes.forEach(function (value) {

                    expect(obj.set("mixed", value)).to.be.equal(obj);
                    expect(obj.get("mixed")).to.be.eql(value);

                });

                expect(obj.set("mixed", undefined)).to.be.equal(obj);
                expect(obj.get("mixed")).to.be.equal(null);

                done();

            });

        });

        describe("Function as a datatype", function () {

            var Model;

            beforeEach(function () {
                /* Define the model */
                Model = model.extend({
                    definition: {
                        func: {
                            type: function (value, defaults) {
                                return "value is " + value + ", default is " + defaults;
                            },
                            value: "string"
                        }
                    }
                });
            });

            it("should allow a function as a datatype when no data sent", function (done) {

                var obj = new Model();

                expect(obj.get("func")).to.be.equal("value is undefined, default is string");

                done();

            });

            it("should allow a function as a datatype when no data sent", function (done) {

                var obj = new Model({
                    func: "some value"
                });

                expect(obj.get("func")).to.be.equal("value is some value, default is string");

                done();

            });

        });

        describe("Added static methods", function () {

            it("should allow adding of a static methods", function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        element: {
                            type: "string",
                            value: null
                        },
                        func: {
                            type: function () {
                                return Model.someConstant;
                            }
                        }
                    }
                }, {

                    someFunction: function () {
                        return "value";
                    },

                    someConstant: "constant"

                });

                var obj = new Model();

                expect(obj.get("func")).to.be.equal(Model.someConstant);
                expect(Model.someFunction()).to.be.equal("value");

                done();

            });

        });

        describe("Invalid datatypes", function () {

            it('should throw an error when you create model with no type', function (done) {

                var fail = false;

                var Model = model.extend({
                    definition: {
                        notSet: null
                    }
                });

                try {
                    var obj = new Model();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("DATATYPE_NOT_VALID");
                    expect(err.type).to.be.null;

                }

                expect(fail).to.be.true;

                done();

            });

            it('should throw an error when you create model with no null type', function (done) {

                var fail = false;

                var Model = model.extend({
                    definition: {
                        notSet: {
                            type: null
                        }
                    }
                });

                try {
                    var obj = new Model();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("DATATYPE_NOT_VALID");
                    expect(err.type).to.be.null;

                }

                expect(fail).to.be.true;

                done();

            });

            it('should throw an error when you create model with invalid data type', function (done) {

                var fail = false;

                var Model = model.extend({
                    definition: {
                        notSet: {
                            type: "banana"
                        }
                    }
                });

                try {
                    var obj = new Model();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("DATATYPE_NOT_VALID");
                    expect(err.type).to.be.equal("banana");

                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe("Create functions on a model", function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string"
                        },
                        parentId: {
                            type: "integer",
                            value: 0
                        }
                    },
                    getName: function () {
                        return this.get("name", false);
                    },
                    isBoss: function () {
                        return this.get("parentId") === 1;
                    },
                    setName: function (name) {
                        this.set("name", name, false);
                    }
                });

            });

            it('should return the name when set', function (done) {

                var obj = new Model({
                    name: "Test",
                    parentId: 2
                });

                expect(obj.getName()).to.be.equal("Test");
                expect(obj.isBoss()).to.be.false;
                expect(obj.setName("Kevin")).to.be.undefined;
                expect(obj.getName()).to.be.equal("Kevin");

                expect(_.has(obj, "nonExistentFunction")).to.be.false;

                var fail = false;
                try {
                    obj.nonExistentFunction();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                }

                expect(fail).to.be.true;

                done();

            });

        });

        it("should add settings to the definition", function (done) {

            /* Define the model */
            var Model = model.extend({
                definition: {
                    element: {
                        type: "string",
                        value: null,
                        settings: {
                            setting1: true,
                            setting2: false,
                            setting3: "string",
                            test: 222
                        }
                    }
                }
            });

            var obj = new Model({
                element: "value"
            });

            expect(obj.getDefinition("element").getSetting("setting1")).to.be.equal(true);
            expect(obj.getDefinition("element").getSetting("setting2")).to.be.equal(false);
            expect(obj.getDefinition("element").getSetting("setting3")).to.be.equal("string");
            expect(obj.getDefinition("element").getSetting("test")).to.be.equal(222);
            expect(obj.getDefinition("element").getSetting("undefined")).to.be.undefined;

            done();

        });

    });

    describe("Instantiation with create tests", function () {

        it("should define a model with no definition", function (done) {

            /* Define the model */
            var Model = model.extend();

            var obj = Model.create();

            expect(obj).to.be.instanceof(require("events").EventEmitter);
            expect(obj).to.be.instanceof(Model);
            expect(obj.toData()).to.be.eql({});
            expect(obj.toObject()).to.be.eql({});
            expect(obj.set("invalid", "a string")).to.be.equal(obj);
            expect(obj.get("invalid")).to.be.undefined;

            done();

        });

        describe("Model with definitions", function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        array: {
                            type: "array"
                        },
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
                        object: {
                            type: "object"
                        },
                        string: {
                            type: "string"
                        }
                    }
                });

            });

            it("should define a model with definitions", function (done) {

                var obj1 = Model.create({
                    array: [
                        "an", "array of", ["stuff", 2]
                    ],
                    boolean: false,
                    date: "2013-02-07 10:11:12",
                    float: "2.3",
                    integer: 89034,
                    object: {
                        an: "object", "with": "things", and: 2
                    },
                    string: "some string"
                });

                expect(obj1.getDefinition("array").getSetting("test")).to.be.undefined;

                expect(obj1).to.be.instanceof(Model);

                expect(obj1.toData()).to.be.eql({
                    array: [
                        "an", "array of", ["stuff", 2]
                    ],
                    boolean: false,
                    date: new Date("2013-02-07 10:11:12"),
                    float: 2.3,
                    int: 89034,
                    object: {
                        an: "object", "with": "things", and: 2
                    },
                    string: "some string"
                });
                expect(obj1.toObject()).to.be.eql({
                    array: [
                        "an", "array of", ["stuff", 2]
                    ],
                    boolean: false,
                    date: new Date("2013-02-07 10:11:12"),
                    float: 2.3,
                    integer: 89034,
                    object: {
                        an: "object", "with": "things", and: 2
                    },
                    string: "some string"
                });
                expect(obj1.set("invalid", "a string")).to.be.equal(obj1);
                expect(obj1.get("invalid")).to.be.undefined;

                expect(obj1.set("integer", 12345)).to.be.equal(obj1);
                expect(obj1.get("integer")).to.be.equal(12345);

                done();

            });

            it("should return default values if nothing set", function (done) {

                var obj = Model.create();

                expect(obj).to.be.instanceof(Model);

                expect(obj.toObject()).to.be.eql({
                    array: null,
                    boolean: false,
                    date: null,
                    float: null,
                    integer: null,
                    object: null,
                    string: null
                });

                /* Check stuff can be set */
                obj.set("integer", "12345");
                expect(obj.get("integer")).to.be.equal(12345);

                obj.set("boolean", "t");
                expect(obj.get("boolean")).to.be.true;

                done();

            });

            it("should create a model from data", function (done) {

                var obj = Model.toModel({
                    boolean: "1",
                    date: "2013-02-07 10:20:30",
                    float: "3",
                    int: 4,
                    string: "hello this is a string"
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.toObject()).to.be.eql({
                    array: null,
                    boolean: true,
                    date: new Date("2013-02-07 10:20:30"),
                    float: 3,
                    integer: 4,
                    object: null,
                    string: "hello this is a string"
                });

                /* Check stuff can be set */
                obj.set("integer", "12345");
                expect(obj.get("integer")).to.be.equal(12345);

                obj.set("boolean", 0);
                expect(obj.get("boolean")).to.be.false;

                done();

            });

            it('should ignore undefined elements', function (done) {

                var obj = Model.toModel({
                    boolean: "N",
                    bool: true
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.toObject()).to.be.eql({
                    array: null,
                    boolean: false,
                    date: null,
                    float: null,
                    integer: null,
                    object: null,
                    string: null
                });

                done();

            });

            it("should ", function (done) {

                var NewModel = model.extend({
                    definition: {
                        key: {
                            value: null
                        }
                    }
                });

                var obj;
                var fail = false;

                try {
                    obj = new NewModel();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("DATATYPE_NOT_VALID");
                    expect(err.type).to.be.null;
                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe("Model getters and setters", function () {

            it("should use the default setter", function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        simple: {
                            type: 'string',
                            value: null
                        }
                    }
                });

                var obj = Model.create({
                    simple: 'hello'
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.get('simple')).to.be.equal('hello');

                expect(obj.set('simple', 'test')).to.be.equal(obj);
                expect(obj.get('simple')).to.be.equal('test');

                expect(obj.set('simple')).to.be.equal(obj);
                expect(obj.get('simple')).to.be.null;

                done();

            });

            it('should use the defined setter', function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        complex: {
                            type: 'string',
                            value: null
                        }
                    },
                    setComplex: function setter (value, defaults) {

                        value = datautils.setString(value, defaults);

                        if (value !== defaults) {
                            value = "test-" + value;
                        }

                        this.set('complex', value, false);

                        /* Wouldn't normally return on a setter, but allow functionality */
                        return true;
                    }
                });

                var obj = Model.create({
                    complex: 'hello'
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.get('complex')).to.be.equal('test-hello');

                expect(obj.set('complex', 'test')).to.be.true;
                expect(obj.get('complex')).to.be.equal('test-test');

                expect(obj.set('complex')).to.be.true;
                expect(obj.get('complex')).to.be.null;

                done();

            });

            it("should only set a value if it's an enumerable value", function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        str: {
                            type: 'enum',
                            enum: [
                                "value1", "value2"
                            ],
                            value: null
                        }
                    }
                });

                var obj1 = Model.create({
                    str: "value1"
                });

                expect(obj1.get("str")).to.be.equal("value1");
                obj1.set("str", "value2");
                expect(obj1.get("str")).to.be.equal("value2");
                obj1.set("str", "value3");
                expect(obj1.get("str")).to.be.null;

                var obj2 = Model.create({
                    str: "value2"
                });

                expect(obj2.get("str")).to.be.equal("value2");
                obj2.set("str", "value1");
                expect(obj2.get("str")).to.be.equal("value1");
                obj2.set("str", "value3");
                expect(obj2.get("str")).to.be.null;

                var obj3 = Model.create({
                    str: "value3"
                });

                expect(obj3.get("str")).to.be.null;
                obj3.set("str", "value1");
                expect(obj3.get("str")).to.be.equal("value1");
                obj3.set("str", "value2");
                expect(obj3.get("str")).to.be.equal("value2");

                done();

            });

        });

        describe("Methods", function () {

            describe("#GetColumnKeys", function () {

                it("should return empty array when model has no definition", function (done) {

                    var Model = model.extend();

                    var obj = Model.create();

                    expect(obj.getColumnKeys()).to.be.an("array").to.be.empty;

                    done();

                });

            });

            describe("#getDefinition", function () {

                it("should return null if key not a string", function (done) {

                    var Model = model.extend();

                    var obj = Model.create();

                    expect(obj.getDefinition(Date)).to.be.null;

                    done();

                });

                it("should return null if key not a set definition", function (done) {

                    var Model = model.extend({
                        definition: {
                            string: {
                                type: "string"
                            }
                        }
                    });

                    var obj = Model.create();

                    expect(obj.getDefinition("string")).to.not.be.null;
                    expect(obj.getDefinition("key")).to.be.null;

                    done();

                });

            });

        });

        describe("Primary keys", function () {

            it('should set no primary key value', function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        dataId: {
                            type: "integer",
                            value: null,
                            column: "id"
                        },
                        name: {
                            type: "string"
                        }
                    }
                });

                var obj = Model.create({
                    dataId: 1,
                    name: "Dave"
                });

                expect(obj.getPrimaryKey()).to.be.null;
                expect(obj.getPrimaryKeyValue()).to.be.undefined;

                var from = Model.toModel({
                    id: 1,
                    name: "Dave"
                });

                expect(from.getPrimaryKey()).to.be.null;
                expect(from.getPrimaryKeyValue()).to.be.undefined;

                done();

            });

            it('should set the primary key', function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        dataId: {
                            type: "integer",
                            value: null,
                            column: "id",
                            primaryKey: true
                        },
                        name: {
                            type: "string"
                        }
                    }
                });

                var obj = Model.create();

                expect(obj.getPrimaryKey()).to.be.equal("dataId");
                expect(obj.getPrimaryKeyValue()).to.be.null;

                var from = Model.toModel();

                expect(from.getPrimaryKey()).to.be.equal("dataId");
                expect(from.getPrimaryKeyValue()).to.be.null;

                done();

            });

            it('should set the primary key value', function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        dataId: {
                            type: "integer",
                            value: null,
                            column: "id",
                            primaryKey: true
                        },
                        name: {
                            type: "string"
                        }
                    }
                });

                var obj = Model.create({
                    dataId: 1,
                    name: "Dave"
                });

                expect(obj.getPrimaryKey()).to.be.equal("dataId");
                expect(obj.getPrimaryKeyValue()).to.be.equal(1);

                var from = Model.toModel({
                    id: 1,
                    name: "Dave"
                });

                expect(from.getPrimaryKey()).to.be.equal("dataId");
                expect(from.getPrimaryKeyValue()).to.be.equal(1);

                done();

            });

            it('should throw error when more than one primary key is given', function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        dataId: {
                            type: "integer",
                            value: null,
                            column: "id",
                            primaryKey: true
                        },
                        name: {
                            type: "string",
                            value: null,
                            primaryKey: true
                        }
                    }
                });

                var fail = false;

                try {
                    obj = Model.create();
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("CANNOT_SET_MULTIPLE_PRIMARY_KEYS");

                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe("The mixed datatype", function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        mixed: {
                            type: "mixed",
                            value: null
                        }
                    }
                });

            });

            it('should create a mixed definition', function (done) {

                var obj = Model.create({
                    mixed: "string"
                });

                expect(obj.get("mixed")).to.be.equal("string");

                /* Now set all datatypes */
                var arrTypes = [
                    "222",
                    222,
                    22.22,
                    new Date(),
                    {},
                    {type: "string"},
                    ["array"],
                    null,
                    true,
                    false
                ];

                arrTypes.forEach(function (value) {

                    expect(obj.set("mixed", value)).to.be.equal(obj);
                    expect(obj.get("mixed")).to.be.equal(value);

                });

                var arrObjTypes = [
                    NaN
                ];

                arrObjTypes.forEach(function (value) {

                    expect(obj.set("mixed", value)).to.be.equal(obj);
                    expect(obj.get("mixed")).to.be.eql(value);

                });

                expect(obj.set("mixed", undefined)).to.be.equal(obj);
                expect(obj.get("mixed")).to.be.equal(null);

                done();

            });

        });

        describe("Function as a datatype", function () {

            var Model;

            beforeEach(function () {
                /* Define the model */
                Model = model.extend({
                    definition: {
                        func: {
                            type: function (value, defaults) {
                                return "value is " + value + ", default is " + defaults;
                            },
                            value: "string"
                        }
                    }
                });
            });

            it("should allow a function as a datatype when no data sent", function (done) {

                var obj = Model.create();

                expect(obj.get("func")).to.be.equal("value is undefined, default is string");

                done();

            });

            it("should allow a function as a datatype when no data sent", function (done) {

                var obj = Model.create({
                    func: "some value"
                });

                expect(obj.get("func")).to.be.equal("value is some value, default is string");

                done();

            });

        });

        describe("Added static methods", function () {

            it("should allow adding of a static methods", function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        element: {
                            type: "string",
                            value: null
                        },
                        func: {
                            type: function () {
                                return Model.someConstant;
                            }
                        }
                    }
                }, {

                    someFunction: function () {
                        return "value";
                    },

                    someConstant: "constant"

                });

                var obj = Model.create();

                expect(obj.get("func")).to.be.equal(Model.someConstant);
                expect(Model.someFunction()).to.be.equal("value");

                done();

            });

        });

        describe("Invalid datatypes", function () {

            it('should throw an error when you create model with no type', function (done) {

                var fail = false;

                var Model = model.extend({
                    definition: {
                        notSet: null
                    }
                });

                try {
                    var obj = Model.create();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("DATATYPE_NOT_VALID");
                    expect(err.type).to.be.null;

                }

                expect(fail).to.be.true;

                done();

            });

            it('should throw an error when you create model with no null type', function (done) {

                var fail = false;

                var Model = model.extend({
                    definition: {
                        notSet: {
                            type: null
                        }
                    }
                });

                try {
                    var obj = Model.create();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("DATATYPE_NOT_VALID");
                    expect(err.type).to.be.null;

                }

                expect(fail).to.be.true;

                done();

            });

            it('should throw an error when you create model with invalid data type', function (done) {

                var fail = false;

                var Model = model.extend({
                    definition: {
                        notSet: {
                            type: "banana"
                        }
                    }
                });

                try {
                    var obj = Model.create();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("DATATYPE_NOT_VALID");
                    expect(err.type).to.be.equal("banana");

                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe("Create functions on a model", function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string"
                        },
                        parentId: {
                            type: "integer",
                            value: 0
                        }
                    },
                    getName: function () {
                        return this.get("name", false);
                    },
                    isBoss: function () {
                        return this.get("parentId") === 1;
                    },
                    setName: function (name) {
                        this.set("name", name, false);
                    }
                });

            });

            it('should return the name when set', function (done) {

                var obj = Model.create({
                    name: "Test",
                    parentId: 2
                });

                expect(obj.getName()).to.be.equal("Test");
                expect(obj.isBoss()).to.be.false;
                expect(obj.setName("Kevin")).to.be.undefined;
                expect(obj.getName()).to.be.equal("Kevin");

                expect(_.has(obj, "nonExistentFunction")).to.be.false;

                var fail = false;
                try {
                    obj.nonExistentFunction();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                }

                expect(fail).to.be.true;

                done();

            });

        });

        it("should add settings to the definition", function (done) {

            /* Define the model */
            var Model = model.extend({
                definition: {
                    element: {
                        type: "string",
                        value: null,
                        settings: {
                            setting1: true,
                            setting2: false,
                            setting3: "string",
                            test: 222
                        }
                    }
                }
            });

            var obj = Model.create({
                element: "value"
            });

            expect(obj.getDefinition("element").getSetting("setting1")).to.be.equal(true);
            expect(obj.getDefinition("element").getSetting("setting2")).to.be.equal(false);
            expect(obj.getDefinition("element").getSetting("setting3")).to.be.equal("string");
            expect(obj.getDefinition("element").getSetting("test")).to.be.equal(222);
            expect(obj.getDefinition("element").getSetting("undefined")).to.be.undefined;

            done();

        });

    });

    describe("Extending the model", function () {

        it("should extend model and keep parent methods", function (done) {

            /* Define the model */
            var Model = model.extend({
                definition: {
                    name: {
                        type: "string"
                    }
                },
                getName: function () {
                    return this.get("name", false);
                }
            });

            var childModel = Model.extend({
                definition: {
                    jobTitle: {
                        type: "string"
                    }
                },
                getJobTitle: function () {
                    return this.get("jobTitle", false);
                }
            });

            var obj1 = new Model({
                name: "Name"
            });

            expect(obj1).to.be.instanceof(Model);
            expect(obj1.toObject()).to.be.eql({
                name: "Name"
            });
            expect(obj1.getName()).to.be.equal("Name");

            var obj2 = new childModel({
                name: "Foo",
                jobTitle: "King"
            });

            expect(obj2).to.be.instanceof(Model);
            expect(obj2).to.be.instanceof(childModel);
            expect(obj2.toObject()).to.be.eql({
                name: "Foo",
                jobTitle: "King"
            });
            expect(obj2.getName()).to.be.equal("Foo");
            expect(obj2.getJobTitle()).to.be.equal("King");

            done();

        });

        it("should extend model and keep parent methods", function (done) {

            /* Define the model */
            var Model = model.extend({
                definition: {
                    age: {
                        type: "float"
                    }
                },
                getAge: function one () {
                    return this.get("age", false);
                }
            });

            var childModel = Model.extend({
                definition: {
                    age: {
                        type: "integer"
                    }
                },
                getAge: function two () {
                    return String(this.get("age", false));
                }
            });

            var obj1 = new Model({
                age: "42"
            });

            var obj2 = new childModel({
                age: "18"
            });

            expect(obj1).to.be.instanceof(Model);
            expect(obj1.toObject()).to.be.eql({
                age: 42
            });
            expect(obj1.getAge()).to.be.equal(42);

            expect(obj2).to.be.instanceof(Model);
            expect(obj2).to.be.instanceof(childModel);
            expect(obj2.toObject()).to.be.eql({
                age: 18
            });
            expect(obj2.getAge()).to.be.equal("18");

            done();

        });

        it("should extend a model with no definition", function (done) {

            /* Define the model */
            var Model = model.extend({
                getAge: function () {
                    return this.get("age", false);
                },
                getName: function () {
                    return this.get("name", false);
                }
            });

            var childModel = Model.extend({
                definition: {
                    age: {
                        type: "integer"
                    },
                    name: {
                        type: "string"
                    }
                },
                getName: function () {
                    return "Name: " + this.get("name", false);
                }
            });

            var obj1 = new Model();

            var obj2 = new childModel({
                age: 26,
                name: "Test"
            });

            expect(obj1).to.be instanceof(Model);
            expect(obj1.toObject()).to.be.eql({});
            expect(obj1.getAge()).to.be.undefined;

            expect(obj2).to.be.instanceof(Model);
            expect(obj2).to.be.instanceof(childModel);

            expect(obj2.toObject()).to.be.eql({
                age: 26,
                name: "Test"
            });
            expect(obj2.getAge()).to.be.equal(26);
            expect(obj2.getName()).to.be.equal("Name: Test");

            done();

        });

    });

    describe("Validation check", function () {

        describe('Single rule', function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string",
                            validation: [
                                {
                                    rule: "required"
                                }
                            ]
                        }
                    }
                });

            });

            it('should not throw an error when a string is provided', function (done) {

                var obj = new Model({
                    name: "Test Name"
                });

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should not throw an error when email not specified and not required', function (done) {

                var M = model.extend({
                    definition: {
                        email: {
                            type: "string",
                            value: null,
                            validation: [
                                {
                                    rule: "email"
                                }
                            ]
                        }
                    }
                });

                var obj = new M();

                expect(obj.validate()).to.be.true;

                obj.set('email', 'notanemail');

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        email: [
                            {
                                message: "VALUE_NOT_EMAIL",
                                value: "notanemail"
                            }
                        ]
                    });

                    expect(err.getStack()).to.be.a("string").to.be.equal(err.stack);

                }

                expect(fail).to.be.true;

                obj.set("email", "test@test.com");

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should throw error when string is null', function (done) {

                var obj = new Model();

                expect(obj).to.be.instanceof(Model);

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        name: [
                            {
                                message: "VALUE_REQUIRED",
                                value: null
                            }
                        ]
                    });

                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe('Multiple keys, single rules on all', function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string",
                            validation: [
                                {
                                    rule: "required"
                                }
                            ]
                        },
                        emailAddress: {
                            type: "string",
                            validation: [
                                {
                                    rule: "email"
                                }
                            ]
                        }
                    }
                });

            });

            it('should validate both rules', function (done) {

                var obj = new Model({
                    name: 'Test',
                    emailAddress: 'test@test.com'
                });

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should fail to validate the first rule', function (done) {

                var obj = new Model({
                    emailAddress: 'test@test.com'
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        name: [
                            {
                                message: "VALUE_REQUIRED",
                                value: null
                            }
                        ]
                    });
                }

                expect(fail).to.be.true;

                done();

            });

            it('should fail to validate the second rule', function (done) {

                var obj = new Model({
                    name: 'Test',
                    emailAddress: 'not@anemail'
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        emailAddress: [
                            {
                                message: "VALUE_NOT_EMAIL",
                                value: "not@anemail"
                            }
                        ]
                    });
                }

                expect(fail).to.be.true;

                done();

            });

            it('should fail to validate both rules', function (done) {

                var obj = new Model({
                    emailAddress: "noanemail.com",
                    name: ""
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        name: [
                            {
                                message: "VALUE_REQUIRED",
                                value: ""
                            }
                        ],
                        emailAddress: [
                            {
                                message: "VALUE_NOT_EMAIL",
                                value: "noanemail.com"
                            }
                        ]
                    });
                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe('Multiple keys, single rules on some', function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string",
                            validation: [
                                {
                                    rule: "required"
                                }
                            ]
                        },
                        emailAddress: {
                            type: "string"
                        }
                    }
                });

            });

        });

        describe('Multiple keys, multiple rules on all', function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        emailAddress1: {
                            type: "string",
                            validation: [
                                {
                                    rule: "required"
                                },
                                {
                                    rule: "email"
                                }
                            ]
                        },
                        emailAddress2: {
                            type: "string",
                            validation: [
                                {
                                    rule: "required"
                                },
                                {
                                    rule: "email"
                                }
                            ]
                        }
                    }
                });

            });

            it('should validate all rules', function (done) {

                var obj = new Model({
                    emailAddress1: "example@domain.com",
                    emailAddress2: "test@test.com"
                });

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should fail all rules', function (done) {

                var obj = new Model({
                    emailAddress1: "f",
                    emailAddress2: "testtest.com"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        emailAddress1: [
                            {
                                message: "VALUE_NOT_EMAIL",
                                value: "f"
                            }
                        ],
                        emailAddress2: [
                            {
                                message: "VALUE_NOT_EMAIL",
                                value: "testtest.com"
                            }
                        ]
                    });
                }

                expect(fail).to.be.true;

                obj.set("emailAddress1", "test@test.com");
                obj.set("emailAddress2", "test2@test.com");

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should fail one rule on one element', function (done) {

                var obj = new Model({
                    emailAddress1: "f",
                    emailAddress2: "testtest.com"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        emailAddress1: [
                            {
                                message: "VALUE_NOT_EMAIL",
                                value: "f"
                            }
                        ],
                        emailAddress2: [
                            {
                                message: "VALUE_NOT_EMAIL",
                                value: "testtest.com"
                            }
                        ]
                    });
                }

                expect(fail).to.be.true;

                obj.set("emailAddress1", "test@test.com");
                obj.set("emailAddress2", "test2@test.com");

                expect(obj.validate()).to.be.true;

                done();

            });

            it("should fail on multiple errors on a single key", function (done) {

                var obj = new Model({
                    emailAddress2: "test@test.com"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        emailAddress1: [
                            {
                                message: "VALUE_REQUIRED",
                                value: null
                            }
                        ]
                    });
                }

                expect(fail).to.be.true;

                obj.set("emailAddress1", "test@test.com");
                obj.set("emailAddress2", "test2@test.com");

                expect(obj.validate()).to.be.true;

                done();

            });

        });

        describe('Validate rules that receive a single parameter', function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string",
                            validation: [
                                {
                                    rule: "minLength",
                                    param: 5
                                }
                            ]
                        }
                    }
                });

            });

            it('should validate the model', function (done) {

                var obj = new Model({
                    name: "Test1234"
                });

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should throw an error when not validated', function (done) {

                var obj = new Model({
                    name: "Test"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        name: [
                            {
                                message: "VALUE_LESS_THAN_MIN_LENGTH",
                                value: "Test",
                                additional: [
                                    5
                                ]
                            }
                        ]
                    });
                }

                expect(fail).to.be.true;

                obj.set("name", "Test1234");

                expect(obj.validate()).to.be.true;

                done();

            });

        });

        describe('Validate rules that receive multiple parameters', function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        name: {
                            type: "string",
                            validation: [
                                {
                                    rule: "lengthBetween",
                                    param: [
                                        5,
                                        10
                                    ]
                                }
                            ]
                        }
                    }
                });

            });

            it('should validate the multi-parameter rule', function (done) {

                var obj = new Model({
                    name: "The name"
                });

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should throw an error if the name is too short', function (done) {

                var obj = new Model({
                    name: "name"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        name: [
                            {
                                message: "VALUE_NOT_BETWEEN_MINLENGTH_AND_MAXLENGTH",
                                value: "name",
                                additional: [
                                    5,
                                    10
                                ]
                            }
                        ]
                    });

                }

                expect(fail).to.be.true;

                obj.set("name", "The name");

                expect(obj.validate()).to.be.true;

                done();

            });

        });

        describe('Validate against custom validation rules', function () {

            describe('No parameters passed', function () {

                var Model;

                before(function () {

                    /* Define the model */
                    Model = model.extend({
                        definition: {
                            name: {
                                type: "string",
                                validation: [
                                    {
                                        rule: function (objModel, value) {
                                            if (value === 'throw') {
                                                throw new Error('THROWN_ERROR');
                                            }
                                            return value === "Hello";
                                        }
                                    }
                                ]
                            }
                        }
                    });

                });

                it('should validate the custom rule', function (done) {

                    var obj = new Model({
                        name: "Hello"
                    });

                    expect(obj.validate()).to.be.true;

                    done();

                });

                it('should throw an error when custom rule returns false', function (done) {

                    var obj = new Model({
                        name: "Potato"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(Error);
                        expect(err.getType()).to.be.equal("Validation");

                        expect(err.getErrors()).to.be.eql({
                            name: [
                                {
                                    message: "CUSTOM_VALIDATION_FAILED",
                                    value: "Potato"
                                }
                            ]
                        });
                    }

                    expect(fail).to.be.true;

                    obj.set("name", "Hello");

                    expect(obj.validate()).to.be.true;

                    done();

                });

                it('should throw an error when custom rule throws error', function (done) {

                    var obj = new Model({
                        name: "throw"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(Error);
                        expect(err.getType()).to.be.equal("Validation");

                        expect(err.getErrors()).to.be.eql({
                            name: [
                                {
                                    message: "THROWN_ERROR",
                                    value: "throw"
                                }
                            ]
                        });
                    }

                    expect(fail).to.be.true;

                    obj.set("name", "Hello");

                    expect(obj.validate()).to.be.true;

                    done();

                });

            });

            describe('Single parameter passed', function () {

                var Model;

                before(function () {

                    /* Define the model */
                    Model = model.extend({
                        definition: {
                            name: {
                                type: "string",
                                validation: [
                                    {
                                        rule: function (objModel, value, match) {
                                            if (value === 'throw') {
                                                throw new Error('THROWN_ERROR');
                                            }
                                            return value === match;
                                        },
                                        param: "Hello"
                                    }
                                ]
                            }
                        }
                    });

                });

                it('should validate the custom rule', function (done) {

                    var obj = new Model({
                        name: "Hello"
                    });

                    expect(obj.validate()).to.be.true;

                    done();

                });

                it('should throw an error when the test returns false', function (done) {

                    var obj = new Model({
                        name: 'false'
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(Error);
                        expect(err.getType()).to.be.equal("Validation");

                        expect(err.getErrors()).to.be.eql({
                            name: [
                                {
                                    message: "CUSTOM_VALIDATION_FAILED",
                                    value: "false"
                                }
                            ]
                        });

                    }

                    expect(fail).to.be.true;

                    obj.set("name", "Hello");

                    expect(obj.validate()).to.be.true;

                    done();

                });

                it('should throw an error when the validation method throws an error', function (done) {

                    var obj = new Model({
                        name: 'throw'
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(Error);
                        expect(err.getType()).to.be.equal("Validation");

                        expect(err.getErrors()).to.be.eql({
                            name: [
                                {
                                    message: "THROWN_ERROR",
                                    value: "throw"
                                }
                            ]
                        });

                    }

                    expect(fail).to.be.true;

                    obj.set("name", "Hello");

                    expect(obj.validate()).to.be.true;

                    done();

                });

            });

            describe('Array of parameters passed', function () {

                var Model;

                before(function () {

                    /* Define the model */
                    Model = model.extend({
                        definition: {
                            name: {
                                type: "string",
                                validation: [
                                    {
                                        rule: function (objModel, value, match, datatype) {
                                            if (value === 'throw') {
                                                throw new Error('THROWN_ERROR');
                                            }
                                            return value === match && typeof value === datatype;
                                        },
                                        param: [
                                            "Hello",
                                            "string"
                                        ]
                                    }
                                ]
                            }
                        }
                    });

                });

                it('should validate the custom rule', function (done) {

                    var obj = new Model({
                        name: "Hello"
                    });

                    expect(obj.validate()).to.be.true;

                    done();

                });

                it('should throw an error when the validation function returns false', function (done) {

                    var obj = new Model({
                        name: 'test'
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(Error);
                        expect(err.getType()).to.be.equal("Validation");

                        expect(err.getErrors()).to.be.eql({
                            name: [
                                {
                                    message: "CUSTOM_VALIDATION_FAILED",
                                    value: "test"
                                }
                            ]
                        });

                    }

                    expect(fail).to.be.true;

                    obj.set("name", "Hello");

                    expect(obj.validate()).to.be.true;

                    done();

                });

                it('should throw an error when the validation method throws an error', function (done) {

                    var obj = new Model({
                        name: 'throw'
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(Error);
                        expect(err.getType()).to.be.equal("Validation");

                        expect(err.getErrors()).to.be.eql({
                            name: [
                                {
                                    message: "THROWN_ERROR",
                                    value: "throw"
                                }
                            ]
                        });

                    }

                    expect(fail).to.be.true;

                    obj.set("name", "Hello");

                    expect(obj.validate()).to.be.true;

                    done();

                });

            });

        });

        describe('Matching another field', function () {

            var Model;

            before(function () {

                /* Define the model */
                Model = model.extend({
                    definition: {
                        password: {
                            type: "string",
                            validation: [
                                {
                                    rule: "minLength",
                                    param: 8
                                }
                            ]
                        },
                        password2: {
                            type: "string",
                            validation: [
                                {
                                    rule: "match",
                                    param: "password"
                                }
                            ]
                        }
                    }
                });

            });

            it('should validate the model', function (done) {

                var obj = new Model({
                    password: "tnetennba",
                    password2: "tnetennba"
                });

                expect(obj.validate()).to.be.true;

                done();

            });

            it('should fail when the password is to short', function (done) {

                var obj = new Model({
                    password: "Moss",
                    password2: "Moss"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        password: [
                            {
                                message: "VALUE_LESS_THAN_MIN_LENGTH",
                                value: "Moss",
                                additional: [
                                    8
                                ]
                            }
                        ]
                    });

                }

                expect(fail).to.be.true;

                done();

            });

            it("should fail when the password doesn't match", function (done) {

                var obj = new Model({
                    password: "MauriceMoss",
                    password2: "RoyTrenneman"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        password2: [
                            {
                                message: "VALUE_DOES_NOT_MATCH",
                                value: "RoyTrenneman",
                                additional: [
                                    "MauriceMoss"
                                ]
                            }
                        ]
                    });

                }

                expect(fail).to.be.true;

                done();

            });

            it('should fail when both rules fail', function (done) {

                var obj = new Model({
                    password: "Jen",
                    password2: "Roy"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        password: [
                            {
                                message: "VALUE_LESS_THAN_MIN_LENGTH",
                                value: "Jen",
                                additional: [
                                    8
                                ]
                            }
                        ],
                        password2: [
                            {
                                message: "VALUE_DOES_NOT_MATCH",
                                value: "Roy",
                                additional: [
                                    "Jen"
                                ]
                            }
                        ]
                    });

                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe("Invalid functions", function () {

            it('should throw an error when function not in validation object', function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        str: {
                            type: "string",
                            validation: [
                                {
                                    rule: "minimumLength",
                                    param: 8
                                }
                            ]
                        }
                    }
                });

                var fail = false;

                var obj;
                try {
                    obj = new Model({
                        str: "some string"
                    });
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('minimumLength is not a validation function');
                }

                expect(obj).to.be.undefined;
                expect(fail).to.be.true;

                done();

            });

            it('should throw an error when non-function given', function (done) {

                /* Define the model */
                var Model = model.extend({
                    definition: {
                        str: {
                            type: "string",
                            validation: [
                                {
                                    rule: {},
                                    param: 8
                                }
                            ]
                        }
                    }
                });

                var fail = false;

                var obj;
                try {
                    obj = new Model({
                        str: "some string"
                    });
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('[object Object] is not a function or string');
                }

                expect(obj).to.be.undefined;
                expect(fail).to.be.true;

                done();

            });

            it("should validate when not all keys have validation", function (done) {

                var Model = model.extend({

                    definition: {
                        id: {
                            type: "integer",
                            value: null
                        },
                        date: {
                            type: "date",
                            value: new Date()
                        },
                        postCode: {
                            type: "string",
                            value: null,
                            validation: [
                                {
                                    rule: "regex",
                                    param: new RegExp(/^(GIR[ ]?0AA)|([a-zA-Z]{1,2}(([0-9]{1,2})|([0-9][a-zA-Z]))[ ]?[0-9][a-zA-Z]{2})$/)
                                },
                                {
                                    rule: "required"
                                }
                            ]
                        }
                    }

                });

                var fail = false;

                var obj = new Model({
                    shipmentId: "1",
                    postCode: "not a postcode"
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.getType()).to.be.equal("Validation");

                    expect(err.getErrors()).to.be.eql({
                        postCode: [
                            {
                                message: "VALUE_REGEX_FAILED_TO_MATCH",
                                value: "not a postcode",
                                additional: [
                                    "/^(GIR[ ]?0AA)|([a-zA-Z]{1,2}(([0-9]{1,2})|([0-9][a-zA-Z]))[ ]?[0-9][a-zA-Z]{2})$/"
                                ]
                            }
                        ]
                    });

                    expect(err.getStack()).to.be.a("string").to.be.equal(err.stack);

                }

                expect(fail).to.be.true;

                obj.set("postCode", "AB12 3CD");

                expect(obj.validate()).to.be.true;

                done();

            })

        });

        describe("Collection", function () {

            var MyModel,
                SubModel,
                SubCollection;
            beforeEach(function () {

                SubModel = model.extend({

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

                SubCollection = collection.extend({

                    model: SubModel

                });

                MyModel = model.extend({

                    definition: {
                        id: {
                            type: "string",
                            validation: [{
                                rule: "required"
                            }]
                        },
                        collection: {
                            type: SubCollection,
                            validation: [{
                                rule: "required"
                            }, {
                                rule: "minLength",
                                param: 1
                            }]
                        }
                    }

                });

            });

            it("should validate a collection with no erroring models", function () {

                var obj = new MyModel({
                    id: "12345",
                    collection: [{
                        id: "3333",
                        name: "Bob"
                    }]
                });

                expect(obj.validate()).to.be.true;

            });

            it("should validate a collection error", function () {

                var obj = new MyModel();

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err.getErrors()).to.be.eql({
                        id: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        collection: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }]
                    });
                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should validate a collection with one erroring models", function () {

                var obj = new MyModel({
                    collection: [{
                        id: "3333",
                        name: ""
                    }]
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Main.Exceptions.Validation);
                    expect(err.message).to.be.equal("DOMAINMODEL_ERROR");

                    expect(err.getErrors()).to.be.eql({
                        id: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        collection_0_name: [{
                            message: "VALUE_LESS_THAN_MIN_LENGTH",
                            value: "",
                            additional: [
                                2
                            ]
                        }, {
                            message: "CUSTOM_VALIDATION_FAILED",
                            value: ""
                        }]
                    })

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should validate a collection with multiple erroring models", function () {

                var obj = new MyModel({
                    collection: [{
                        id: "3333",
                        name: ""
                    }, {
                        id: "4444",
                        name: "2s"
                    }]
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(Main.Exceptions.Validation);
                    expect(err.message).to.be.equal("DOMAINMODEL_ERROR");

                    expect(err.getErrors()).to.be.eql({
                        id: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        collection_0_name: [{
                            message: "VALUE_LESS_THAN_MIN_LENGTH",
                            value: "",
                            additional: [
                                2
                            ]
                        }, {
                            message: "CUSTOM_VALIDATION_FAILED",
                            value: ""
                        }],
                        collection_1_name: [{
                            message: "CUSTOM_VALIDATION_FAILED",
                            value: "2s"
                        }]
                    })

                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

        describe("SubModels", function () {

            var SubModel,
                MyModel;
            beforeEach(function () {

                SubModel = model.extend({

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

                MyModel = model.extend({

                    definition: {
                        id: {
                            type: "string",
                            validation: [{
                                rule: "required"
                            }]
                        },
                        model: {
                            type: SubModel,
                            validation: [{
                                rule: "required"
                            }]
                        }
                    }

                });
            });

            it("should validate a submodel with no errors", function () {

                var obj = new MyModel({
                    id: "2468",
                    model: {
                        id: "12345",
                        name: "Bob"
                    }
                });

                expect(obj.validate()).to.be.true;

            });

            it("should validate a model with required submodel", function () {

                var obj = new MyModel({
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err.getErrors()).to.be.eql({
                        id: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        model: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }]
                    });

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should validate a submodel with errors", function () {

                var obj = new MyModel({
                    model: {
                        name: "B"
                    }
                });

                var fail = false;

                try {
                    obj.validate();
                } catch (err) {
                    fail = true;

                    expect(err.getErrors()).to.be.eql({
                        id: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        model_id: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        model_name: [{
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

                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

    });

    describe("Miscellaneous tests", function () {

        it("should use a custom get function", function () {

            var Model = model.extend({
                definition: {
                    string: {
                        type: "string",
                        value: null
                    }
                },
                getString: function () {
                    return "Hmmm. " + this.get("string", false);
                }
            });

            var obj = new Model({
                string: "Would you like a Jelly Baby my dear?"
            });

            expect(obj.get("string")).to.be.equal("Hmmm. Would you like a Jelly Baby my dear?");

        });

        it("should allow an instance of a DomainModel to be sent in", function () {

            var InnerModel = model.extend({
                definition: {
                    str: {
                        type: "string",
                        value: null
                    }
                }
            });

            var inst = new InnerModel({
                str: "hello"
            })

            var Model = model.extend({
                definition: {
                    model: {
                        type: InnerModel,
                        value: null
                    }
                }
            });

            var obj = new Model({
                model: inst
            });

            expect(obj).to.be.instanceof(Model);
            expect(obj.get("model")).to.be.equal(inst);


        });

    });

    describe("#toModel", function () {

        it("should convert a collection who's model column name are different", function () {

            var SubModel = model.extend({

                definition: {
                    id: {
                        type: "string",
                        column: "_id"
                    }
                }

            });

            var Collect = collection.extend({

                model: SubModel

            });

            var ParentModel = model.extend({

                definition: {
                    id: {
                        type: "string",
                        column: "_id"
                    },
                    collect: {
                        type: Collect,
                        column: "_collect"
                    }
                }

            });

            expect(ParentModel.toModel({
                _id: "12345",
                _collect: [{
                    _id: "246"
                }]
            }).toObject()).to.be.eql({
                    id: "12345",
                    collect: [{
                        id: "246"
                    }]
                });

        });

    });

});
