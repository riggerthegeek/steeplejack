/**
 * model.test
 */


"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {expect} from "../../../helpers/configure";
import {Model} from "../../../../lib/model/index";
import {Collection} from "../../../../lib/collection";
import {Base} from "../../../../lib/base";


describe("Model test", function () {

    describe("Methods", function () {

        describe("#constructor", function () {

            it("should define a model with no schema", function () {

                /* Extend the model */
                class Child extends Model { }

                let obj = new Child();

                expect(obj).to.be.instanceof(EventEmitter)
                    .instanceof(Base)
                    .instanceof(Model);

                expect(obj.getSchema()).to.be.eql({});
                expect(obj.getData()).to.be.eql({});
                expect(obj.toDb()).to.be.eql({});

            });

            describe("model with a schema", function () {

                it("should create a model with a schema", function () {

                    class Child extends Model {

                        public static schema: any = {
                            array: {
                                type: "array"
                            },
                            boolean: {
                                type: "boolean",
                                value: false
                            },
                            datetime: {
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
                        };

                    }

                    var obj1 = new Child({
                        array: [
                            "an", "array of", ["stuff", 2]
                        ],
                        boolean: false,
                        datetime: "2013-02-07 10:11:12",
                        float: "2.3",
                        integer: 89034,
                        object: {
                            an: "object", "with": "things", and: 2
                        },
                        string: "some string"
                    });

                    expect(obj1.getDefinition("array").getSetting("test")).to.be.undefined;

                    expect(obj1).to.be.instanceof(Child)
                        .instanceof(Model)
                        .instanceof(Base);

                    expect(obj1.toDb()).to.be.eql({
                        array: [
                            "an", "array of", ["stuff", 2]
                        ],
                        boolean: false,
                        datetime: new Date(2013, 1, 7, 10, 11, 12),
                        float: 2.3,
                        int: 89034,
                        object: {
                            an: "object", "with": "things", and: 2
                        },
                        string: "some string"
                    });

                    expect(obj1.getData()).to.be.eql({
                        array: [
                            "an", "array of", ["stuff", 2]
                        ],
                        boolean: false,
                        datetime: new Date(2013, 1, 7, 10, 11, 12),
                        float: 2.3,
                        integer: 89034,
                        object: {
                            an: "object", "with": "things", and: 2
                        },
                        string: "some string"
                    });

                    (<any>obj1).invalid = "a string";

                    expect(obj1.getData()).to.be.eql({
                        array: [
                            "an", "array of", ["stuff", 2]
                        ],
                        boolean: false,
                        datetime: new Date(2013, 1, 7, 10, 11, 12),
                        float: 2.3,
                        integer: 89034,
                        object: {
                            an: "object", "with": "things", and: 2
                        },
                        string: "some string"
                    });

                    (<any>obj1).integer = "12345";

                    expect(obj1.getData()).to.be.eql({
                        array: [
                            "an", "array of", ["stuff", 2]
                        ],
                        boolean: false,
                        datetime: new Date(2013, 1, 7, 10, 11, 12),
                        float: 2.3,
                        integer: 12345,
                        object: {
                            an: "object", "with": "things", and: 2
                        },
                        string: "some string"
                    });

                });

                it("should return default values if nothing set", function () {

                    class Child extends Model {

                        public static schema: any = {
                            array: {
                                type: "array"
                            },
                            boolean: {
                                type: "boolean",
                                value: false
                            },
                            datetime: {
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
                        };

                    }

                    var obj = new Child();

                    expect(obj).to.be.instanceof(Child)
                        .instanceof(Model)
                        .instanceof(Base);

                    expect(obj.getData()).to.be.eql({
                        array: null,
                        boolean: false,
                        datetime: null,
                        float: null,
                        integer: null,
                        object: null,
                        string: null
                    });

                    /* Check stuff can be set */
                    (<any>obj).integer = "12345";
                    expect((<any>obj).integer).to.be.equal(12345);

                    (<any>obj).boolean = "t";
                    expect((<any>obj).boolean).to.be.true;

                });

                it("should throw an error when no datatype set", function () {

                    class NewModel extends Model {

                        public static schema: any = {
                            key: {
                                value: null
                            }
                        }

                    }

                    let fail = false;

                    try {
                        new NewModel();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("Definition.type 'null' is not valid");
                    }

                    expect(fail).to.be.true;

                });

                it("should pass a Model as a definition", function () {

                    class MyModel extends Model {

                        public static schema: any = {
                            string: {
                                type: "string"
                            }
                        };

                    }

                    class Child extends Model {

                        public static schema: any = {
                            id: {
                                type: "integer",
                                value: null
                            },
                            myModel: {
                                type: MyModel,
                                value: null
                            }
                        };

                    }

                    let myModel = {
                        string: "some string"
                    };

                    let obj = new Child({
                        id: "2",
                        myModel: myModel
                    });

                    expect(obj).to.be.instanceof(Child)
                        .instanceof(Model)
                        .instanceof(Base);
                    expect((<any>obj).id).to.be.equal(2);
                    expect((<any>obj).myModel).to.be.instanceof(MyModel)
                        .instanceof(Model)
                        .instanceof(Base);

                    expect(obj.getData()).to.be.eql({
                        id: 2,
                        myModel: {
                            string: "some string"
                        }
                    });

                });

                it("should define a model with definitions", function () {

                    class Child extends Model {

                        public static schema: any = {
                            array: {
                                type: "array"
                            },
                            boolean: {
                                type: "boolean",
                                value: false
                            },
                            datetime: {
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
                        };

                    }

                    var obj1 = new Child({
                        array: [
                            "an", "array of", ["stuff", 2]
                        ],
                        boolean: false,
                        datetime: "2013-02-07 10:11:12",
                        float: "2.3",
                        integer: 89034,
                        object: {
                            an: "object", "with": "things", and: 2
                        },
                        string: "some string"
                    });

                    expect(obj1.getDefinition("array").getSetting("test")).to.be.undefined;

                    expect(obj1).to.be.instanceof(Model);

                    expect(obj1.toDb()).to.be.eql({
                        array: [
                            "an", "array of", ["stuff", 2]
                        ],
                        boolean: false,
                        datetime: new Date(2013, 1, 7, 10, 11, 12),
                        float: 2.3,
                        int: 89034,
                        object: {
                            an: "object", "with": "things", and: 2
                        },
                        string: "some string"
                    });

                    expect(obj1.getData()).to.be.eql({
                        array: [
                            "an", "array of", ["stuff", 2]
                        ],
                        boolean: false,
                        datetime: new Date(2013, 1, 7, 10, 11, 12),
                        float: 2.3,
                        integer: 89034,
                        object: {
                            an: "object", "with": "things", and: 2
                        },
                        string: "some string"
                    });

                    (<any>obj1).invalid = "a string";

                    expect(obj1.getData()).to.be.eql({
                        array: [
                            "an", "array of", ["stuff", 2]
                        ],
                        boolean: false,
                        datetime: new Date(2013, 1, 7, 10, 11, 12),
                        float: 2.3,
                        integer: 89034,
                        object: {
                            an: "object", "with": "things", and: 2
                        },
                        string: "some string"
                    });

                    (<any>obj1).integer = "12345";


                    expect(obj1.getData()).to.be.eql({
                        array: [
                            "an", "array of", ["stuff", 2]
                        ],
                        boolean: false,
                        datetime: new Date(2013, 1, 7, 10, 11, 12),
                        float: 2.3,
                        integer: 12345,
                        object: {
                            an: "object", "with": "things", and: 2
                        },
                        string: "some string"
                    });

                });

            });

        });

        describe("getters/setters", function () {

            it("should use the default setter", function () {

                /* Define the model */
                class Child extends Model {
                    public static schema: any = {
                        simple: {
                            type: "string",
                            value: null
                        }
                    };
                }

                var obj = new Child({
                    simple: "hello"
                });

                expect(obj).to.be.instanceof(Model)
                    .instanceof(Child);

                expect(obj.get("simple")).to.be.equal("hello");
                expect((<any>obj).simple).to.be.equal("hello");

                expect(obj.set("simple", "test")).to.be.equal(obj);
                expect(obj.get("simple")).to.be.equal("test");
                expect((<any>obj).simple).to.be.equal("test");

                expect(obj.set("simple")).to.be.equal(obj);
                expect(obj.get("simple")).to.be.null;
                expect((<any>obj).simple).to.be.null;

                (<any>obj).simple = "test";
                expect(obj.get("simple")).to.be.equal("test");
                expect((<any>obj).simple).to.be.equal("test");

                (<any>obj).simple = void 0;
                expect(obj.get("simple")).to.be.null;
                expect((<any>obj).simple).to.be.null;

            });

            it("should return the default value", function () {

                /* Define the model */
                class Child extends Model {
                    public static schema: any = {
                        simple: {
                            type: "string",
                            value: null
                        }
                    };
                }

                let obj = new Child;

                expect((<any>obj).simple).to.be.null;
                expect(obj.get("simple")).to.be.null;

            });

            it("should use the custom setter", function () {

                /* Define the model */
                class Child extends Model {

                    public static schema: any = {
                        complex: {
                            type: "string",
                            value: null
                        }
                    };

                    protected _setComplex (value: any, defaults: any) {

                        if (_.isString(value) && value !== defaults) {
                            value = "test-" + value;
                        }

                        return value;

                    }
                }


                var obj = new Child({
                    complex: "hello"
                });

                expect(obj).to.be.instanceof(Model)
                    .instanceof(Child);

                expect(obj.get("complex")).to.be.equal("test-hello");
                expect((<any>obj).complex).to.be.equal("test-hello");

                expect(obj.set("complex", "test")).to.be.equal(obj);
                expect(obj.get("complex")).to.be.equal("test-test");
                expect((<any>obj).complex).to.be.equal("test-test");

                expect(obj.set("complex")).to.be.equal(obj);
                expect(obj.get("complex")).to.be.null;
                expect((<any>obj).complex).to.be.null;

                (<any>obj).complex = "test";
                expect(obj.get("complex")).to.be.equal("test-test");
                expect((<any>obj).complex).to.be.equal("test-test");

                (<any>obj).complex = void 0;
                expect(obj.get("complex")).to.be.null;
                expect((<any>obj).complex).to.be.null;

            });

            it("should use the custom getter", function () {

                class Child extends Model {
                    public static schema: any = {
                        complex: {
                            type: "string",
                            value: null
                        }
                    };

                    protected _getComplex (currentValue: any) {
                        return `test-${currentValue}`;
                    }
                }

                var obj = new Child({
                    complex: "hello"
                });

                expect((<any>obj).complex).to.be.equal("test-hello");
                expect(obj.get("complex")).to.be.equal("test-hello");

                obj.set("complex", "value");

                expect((<any>obj).complex).to.be.equal("test-value");
                expect(obj.get("complex")).to.be.equal("test-value");

            });

            it("should only set a value if it's an enumerable value", function () {

                /* Define the model */
                class Child extends Model {
                    public static schema: any = {
                        str: {
                            type: "enum",
                            enum: [
                                "value1", "value2"
                            ],
                            value: null
                        }
                    };
                }

                var obj1 = new Child({
                    str: "value1"
                });

                expect(obj1.get("str")).to.be.equal("value1");
                expect((<any>obj1).str).to.be.equal("value1");
                obj1.set("str", "value2");
                expect(obj1.get("str")).to.be.equal("value2");
                expect((<any>obj1).str).to.be.equal("value2");
                obj1.set("str", "value3");
                expect(obj1.get("str")).to.be.null;
                expect((<any>obj1).str).to.be.null;

                var obj2 = new Child({
                    str: "value2"
                });

                expect(obj2.get("str")).to.be.equal("value2");
                expect((<any>obj2).str).to.be.equal("value2");
                obj2.set("str", "value1");
                expect(obj2.get("str")).to.be.equal("value1");
                expect((<any>obj2).str).to.be.equal("value1");
                obj2.set("str", "value3");
                expect(obj2.get("str")).to.be.null;
                expect((<any>obj2).str).to.be.null;

                var obj3 = new Child({
                    str: "value3"
                });

                expect(obj3.get("str")).to.be.null;
                expect((<any>obj3).str).to.be.null;
                obj3.set("str", "value1");
                expect(obj3.get("str")).to.be.equal("value1");
                expect((<any>obj3).str).to.be.equal("value1");
                obj3.set("str", "value2");
                expect(obj3.get("str")).to.be.equal("value2");
                expect((<any>obj3).str).to.be.equal("value2");

            });

            it("should nicely handle a non-existent value, returning undefined", function () {

                /* Define the model */
                class Child extends Model {
                    public static schema: any = {
                        simple: {
                            type: "string",
                            value: null
                        }
                    };
                }

                let obj = new Child;

                expect((<any>obj).missing).to.be.undefined;
                expect(obj.get("missing")).to.be.undefined;

                (<any>obj).missing = "hello";
                expect(obj.set("missing", "hello")).to.be.equal(obj);

            });

            it("should allow a mixed setter to be set, unless undefined", function () {

                class Child extends Model {
                    public static schema: any = {
                        element: {
                            type: "mixed"
                        }
                    };
                }

                let obj = new Child;

                [
                    null,
                    "",
                    false,
                    {},
                    [],
                    0
                ].forEach(value => {

                    (<any>obj).element = value;

                    expect(obj.get("element")).to.be.equal(value);

                    obj.set("element", value);

                    expect(obj.get("element")).to.be.equal(value);

                });

                expect(obj.set("element")).to.be.equal(obj);

                expect(obj.get("element")).to.be.null;

                (<any>obj).element = void 0;

                expect(obj.get("element")).to.be.null;

            });

        });

        describe("#getColumnKeys", function () {

            it("should return empty array when model has no definition", function () {

                class Child extends Model {}

                var obj = new Child();

                expect(obj.getColumnKeys()).to.be.an("array")
                    .to.be.empty;

            });

            it("should return the column keys", function () {

                class MyModel extends Model {
                    public static schema: any = {
                        id: {
                            type: "string"
                        }
                    };
                }

                class MyCollection extends Collection {
                    public static model: any = MyModel;
                }

                class Element extends Model {
                    public static schema: any = {
                        id: {
                            type: "string"
                        },
                        collection: {
                            type: MyCollection
                        },
                        model: {
                            type: MyModel
                        }
                    };
                }

                var obj = new Element();

                expect(obj.getColumnKeys()).to.be.an("array")
                    .to.be.eql([{
                        key: "id",
                        column: "id"
                    }, {
                        key: "collection",
                        column: "collection"
                    }, {
                        key: "model",
                        column: "model"
                    }]);

            });

        });

        describe("#toDb", function () {

            it("should convert a submodel to it's data representation", function () {

                class SubModel extends Model {
                    public static schema: any = {
                        id: {
                            type: "string",
                            column: "_id"
                        }
                    };
                }

                class OtherModel extends Model {
                    public static schema: any = {
                        id: {
                            type: "string",
                            column: "_id"
                        },
                        model: {
                            type: SubModel
                        }
                    };
                }

                let obj = new OtherModel({
                    id: "1234",
                    model: {
                        id: "2468"
                    }
                });

                expect(obj.toDb()).to.be.eql({
                    _id: "1234",
                    model: {
                        _id: "2468"
                    }
                });

            });

            it("should convert a collection to it's data representation", function () {

                class SubModel extends Model {
                    public static schema: any = {
                        id: {
                            type: "string",
                            column: "_id"
                        }
                    };
                }

                class SubCollection extends Collection {
                    public static model: Function = SubModel;
                }

                class OtherModel extends Model {
                    public static schema: any = {
                        id: {
                            type: "string",
                            column: "_id"
                        },
                        model: {
                            type: SubCollection
                        }
                    }
                }

                var obj = new OtherModel({
                    id: "1234",
                    model: [{
                        id: "2468"
                    }]
                });

                expect(obj.toDb()).to.be.eql({
                    _id: "1234",
                    model: [{
                        _id: "2468"
                    }]
                });

            });

            it("should ignore a column set to null", function () {

                class Child extends Model {
                    public static schema: any = {
                        id: {
                            type: "string",
                            column: "_id"
                        },
                        value: {
                            type: "string",
                            column: null
                        }
                    }
                }

                let obj = new Child({
                    id: "12345",
                    value: "hello"
                });

                expect(obj.get("id")).to.be.equal("12345");
                expect(obj.get("value")).to.be.equal("hello");

                expect(obj.toDb()).to.be.eql({
                    _id: "12345"
                });

            });

        });

    });

    describe("Static methods", function () {

        describe("#toModel", function () {

            it("should create a model from data", function () {

                class Child extends Model {

                    public static schema: any = {
                        array: {
                            type: "array"
                        },
                        boolean: {
                            type: "boolean",
                            value: false
                        },
                        datetime: {
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
                    };

                }

                var obj = Child.toModel({
                    boolean: "1",
                    datetime: "2013-02-07 10:20:30",
                    float: "3",
                    int: 4,
                    string: "hello this is a string"
                });

                expect(obj).to.be.instanceof(Child)
                    .instanceof(Model)
                    .instanceof(Base);

                expect(obj.getData()).to.be.eql({
                    array: null,
                    boolean: true,
                    datetime: new Date(2013, 1, 7, 10, 20, 30),
                    float: 3,
                    integer: 4,
                    object: null,
                    string: "hello this is a string"
                });

                /* Check stuff can be set */
                (<any>obj).integer =  "12345";
                expect((<any>obj).integer).to.be.equal(12345);

                (<any>obj).boolean = 0;
                expect((<any>obj).boolean).to.be.false;

            });

            it("should ignore undefined elements", function () {

                class Child extends Model {

                    public static schema: any = {
                        array: {
                            type: "array"
                        },
                        boolean: {
                            type: "boolean",
                            value: false
                        },
                        datetime: {
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
                    };

                }

                var obj = Child.toModel({
                    boolean: "N",
                    bool: true
                });

                expect(obj).to.be.instanceof(Model);

                expect(obj.getData()).to.be.eql({
                    array: null,
                    boolean: false,
                    datetime: null,
                    float: null,
                    integer: null,
                    object: null,
                    string: null
                });

            });

            it("should create a blank model if no data provided", function () {

                class Child extends Model {

                    public static schema: any = {
                        array: {
                            type: "array"
                        },
                        boolean: {
                            type: "boolean",
                            value: false
                        },
                        datetime: {
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
                    };

                }

                let obj = Child.toModel();

                expect(obj).to.be.instanceof(Model);

                expect(obj.getData()).to.be.eql({
                    array: null,
                    boolean: false,
                    datetime: null,
                    float: null,
                    integer: null,
                    object: null,
                    string: null
                });

            });


        });

    });

});
