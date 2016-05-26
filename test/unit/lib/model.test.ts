/**
 * model.test
 */

/// <reference path="../../../typings/index.d.ts" />

"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */
import * as _ from "lodash";


/* Files */
import {expect} from "../../helpers/configure";
import {Definition} from "../../../lib/definition";
import {Model} from "../../../lib/model";
import {Collection} from "../../../lib/collection";
import {Base} from "../../../lib/base";
import {ValidationException} from "../../../exception/validation/index";


describe("Model test", function () {

    describe("Methods", function () {

        describe("#constructor", function () {

            it("should define a model with no schema", function () {

                /* Extend the model */
                class Child extends Model {
                    protected _schema () {

                    }
                }

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

                        protected _schema () {
                            return {
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

                        protected _schema () {
                            return {
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

                        protected _schema () {
                            let obj: any = {
                                key: {
                                    value: null
                                }
                            };
                            return obj;
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

                        protected _schema () {
                            return {
                                string: {
                                    type: "string"
                                }
                            };
                        }

                    }

                    class Child extends Model {

                        protected _schema () {
                            let obj: any = {
                                id: {
                                    type: "integer",
                                    value: null
                                },
                                myModel: {
                                    type: MyModel,
                                    value: null
                                }
                            };
                            return obj;
                        }

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
                    expect((<any>obj).myModel).to.not.be.equal(myModel);

                    expect(obj.get("myModel")).to.not.be.equal(myModel);

                    expect(obj.getData()).to.be.eql({
                        id: 2,
                        myModel: {
                            string: "some string"
                        }
                    });

                });

                it("should pass a Model as a definition and keep instance", function () {

                    class MyModel extends Model {

                        protected _schema () {
                            return {
                                string: {
                                    type: "string"
                                }
                            };
                        }

                    }

                    class Child extends Model {

                        protected _schema () {
                            let obj: any = {
                                id: {
                                    type: "integer",
                                    value: null
                                },
                                myModel: {
                                    type: MyModel,
                                    value: null
                                }
                            };
                            return obj;
                        }

                    }

                    let myModel = new MyModel({
                        string: "some string"
                    });

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
                        .instanceof(Base)
                        .equal(myModel);

                    expect(obj.get("myModel")).to.be.equal(myModel);

                    expect(obj.getData()).to.be.eql({
                        id: 2,
                        myModel: {
                            string: "some string"
                        }
                    });

                });

                it("should define a model with definitions", function () {

                    class Child extends Model {

                        protected _schema () {
                            return {
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

                it("should extend model and schema", function () {

                    /* Define the model */
                    class Parent extends Model {
                        protected _schema () {
                            return {
                                name: {
                                    type: "string"
                                }
                            };
                        }
                    }

                    class Child extends Parent {
                        protected _schema () {
                            return this._mergeSchemas(super._schema(), {
                                jobTitle: {
                                    type: "string"
                                }
                            });
                        }
                    }

                    var obj1 = new Parent({
                        name: "Name"
                    });

                    expect(obj1).to.be.instanceof(Model)
                        .instanceof(Parent);
                    expect(obj1.getData()).to.be.eql({
                        name: "Name"
                    });
                    expect(obj1.get("name")).to.be.equal("Name");

                    var obj2 = new Child({
                        name: "Foo",
                        jobTitle: "King"
                    });

                    expect(obj2).to.be.instanceof(Model)
                        .instanceof(Parent)
                        .instanceof(Child);
                    expect(obj2.getData()).to.be.eql({
                        name: "Foo",
                        jobTitle: "King"
                    });
                    expect(obj2.get("name")).to.be.equal("Foo");
                    expect(obj2.get("jobTitle")).to.be.equal("King");

                });

            });

        });

        describe("getters/setters", function () {

            it("should use the default setter", function () {

                /* Define the model */
                class Child extends Model {
                    protected _schema () {
                        let obj: any = {
                            simple: {
                                type: "string",
                                value: null
                            }
                        };
                        return obj;
                    }
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
                    protected _schema () {
                        let obj: any = {
                            simple: {
                                type: "string",
                                value: null
                            }
                        };
                        return obj;
                    }
                }

                let obj = new Child;

                expect((<any>obj).simple).to.be.null;
                expect(obj.get("simple")).to.be.null;

            });

            it("should use the custom setter", function () {

                /* Define the model */
                class Child extends Model {

                    protected _schema () {
                        let obj: any = {
                            complex: {
                                type: "string",
                                value: null
                            }
                        };
                        return obj;
                    }

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
                    protected _schema () {
                        let obj: any = {
                            complex: {
                                type: "string",
                                value: null
                            }
                        };
                        return obj;
                    }

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

            it("should use a custom get function", function () {

                class Child extends Model {
                    protected _schema () {
                        let obj: any = {
                            string: {
                                type: "string",
                                value: null
                            }
                        };
                        return obj;
                    }
                    protected _getString (value: any) {
                        return `Hmmm. ${value}`;
                    }
                }

                var obj = new Child({
                    string: "Would you like a Jelly Baby my dear?"
                });

                expect(obj.get("string")).to.be.equal("Hmmm. Would you like a Jelly Baby my dear?");

            });

            it("should only set a value if it's an enumerable value", function () {

                /* Define the model */
                class Child extends Model {
                    protected _schema () {
                        let obj: any = {
                            str: {
                                type: "enum",
                                enum: [
                                    "value1", "value2"
                                ],
                                value: null
                            }
                        };
                        return obj;
                    }
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

            it("should clone a defaulted array value", function () {

                let arr: any = [
                    "hello"
                ];

                class Child extends Model {
                    protected _schema () {
                        return {
                            array: {
                                type: "array",
                                value: arr
                            }
                        };
                    }
                }

                var obj = new Child();

                expect(obj.get("array")).to.be.an("array")
                    .to.be.eql([
                        "hello"
                    ])
                    .to.not.be.equal(arr);

            });

            it("should nicely handle a non-existent value, returning undefined", function () {

                /* Define the model */
                class Child extends Model {
                    protected _schema () {
                        let obj: any = {
                            simple: {
                                type: "string",
                                value: null
                            }
                        };
                        return obj;
                    }
                }

                let obj = new Child;

                expect((<any>obj).missing).to.be.undefined;
                expect(obj.get("missing")).to.be.undefined;

                (<any>obj).missing = "hello";
                expect(obj.set("missing", "hello")).to.be.equal(obj);

            });

            it("should allow a mixed setter to be set, unless undefined", function () {

                class Child extends Model {
                    protected _schema () {
                        return {
                            element: {
                                type: "mixed"
                            }
                        };
                    }
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

                class Child extends Model {
                    protected _schema () {
                        return {};
                    }
                }

                var obj = new Child();

                expect(obj.getColumnKeys()).to.be.an("array")
                    .to.be.empty;

            });

            it("should return the column keys", function () {

                class MyModel extends Model {
                    protected _schema () {
                        return {
                            id: {
                                type: "string"
                            }
                        };
                    }
                }

                class MyCollection extends Collection {
                    protected _model () {
                        return MyModel;
                    }
                }

                class Element extends Model {
                    protected _schema () {
                        return {
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

        describe("#getData", function () {

            it("should export to an object literal", function () {

                class Child extends Model {
                    protected _schema () {
                        let obj: any ={
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
                        };
                        return obj;
                    }
                }

                var obj = new Child({
                    str: "hello",
                    bool: true,
                    obj: {
                        hello: "world"
                    }
                });

                expect(obj.getData()).to.not.be.instanceof(Model);
                expect(obj.getData())
                    .to.be.eql({
                    str: "hello",
                    bool: true,
                    obj: {
                        hello: "world"
                    }
                });

            });

            it("should export a Model instance", function () {

                class SubModel extends Model {
                    protected _schema () {
                        let obj: any = {
                            str: {
                                type: "string",
                                value: null
                            },
                            bool: {
                                type: "boolean",
                                value: false
                            }
                        };
                        return obj;
                    }
                }

                class Child extends Model {
                    protected _schema () {
                        let obj: any = {
                            str: {
                                type: "string",
                                value: null
                            },
                            bool: {
                                type: "boolean",
                                value: false
                            },
                            obj: {
                                type: SubModel,
                                value: null
                            }
                        };
                        return obj;
                    }
                }

                var obj = new Child({
                    str: "hello",
                    bool: true,
                    obj: {
                        str: "world",
                        bool: false
                    }
                });

                expect(obj.getData()).to.not.be.instanceof(Model);

                expect(obj.getData()).to.be.eql({
                    str: "hello",
                    bool: true,
                    obj: {
                        str: "world",
                        bool: false
                    }
                });

            });

            it("should output a value that's an instance of Collection", function () {

                class Child extends Model {
                    protected _schema () {
                        let obj: any = {
                            string: {
                                type: "string",
                                value: null
                            }
                        };
                        return obj;
                    }
                }

                class Children extends Collection {
                    protected _model () {
                        return Child;
                    }
                }

                class Test extends Model {
                    protected _schema () {
                        let obj: any = {
                            str: {
                                type: "string",
                                value: null
                            },
                            collection: {
                                type: Children,
                                value: null
                            }
                        };
                        return obj;
                    }
                }

                var obj = new Test({
                    str: "hello",
                    collection: [{
                        string: "world"
                    }]
                });

                expect(obj.get("str")).to.be.equal("hello");
                expect(obj.get("collection")).to.be.instanceof(Children);

                expect(obj.getData()).to.be.eql({
                    str: "hello",
                    collection: [{
                        string: "world"
                    }]
                });

            });

            it("should allow an array to be added to a Collection", function () {

                class Child extends Model {
                    protected _schema () {
                        let obj: any = {
                            string: {
                                type: "string",
                                value: null
                            }
                        };
                        return obj;
                    }
                }

                class Children extends Collection {
                    protected _model () {
                        return Child;
                    }
                }

                class Item extends Model {
                    protected _schema () {
                        let obj: any = {
                            str: {
                                type: "string",
                                value: null
                            },
                            collection: {
                                type: Children,
                                value: null
                            }
                        };
                        return obj;
                    }
                }

                var obj = new Item({
                    str: "hello",
                    collection: [{
                        string: "world"
                    }]
                });

                expect(obj.get("str")).to.be.equal("hello");
                expect(obj.get("collection")).to.be.instanceof(Collection);

                expect(obj.getData()).to.be.eql({
                    str: "hello",
                    collection: [{
                        string: "world"
                    }]
                });

            });

        });

        describe("#getDefinition", function () {

            it("should return null if key not a string", function () {

                class Child extends Model {
                    protected _schema () {

                    }
                }

                let obj = new Child();

                expect(obj.getDefinition("date")).to.be.null;

            });

            it("should return null if key not a set definition", function () {

                class Child extends Model {
                    protected _schema () {
                        return {
                            string: {
                                type: "string"
                            }
                        };
                    }
                }

                var obj = new Child();

                expect(obj.getDefinition("string")).to.be.instanceof(Definition);
                expect(obj.getDefinition("key")).to.be.null;

            });

        });

        describe("#toDb", function () {

            it("should convert a submodel to it's data representation", function () {

                class SubModel extends Model {
                    protected _schema () {
                        return {
                            id: {
                                type: "string",
                                column: "_id"
                            }
                        };
                    }
                }

                class OtherModel extends Model {
                    protected _schema () {
                        return {
                            id: {
                                type: "string",
                                column: "_id"
                            },
                            model: {
                                type: SubModel
                            }
                        };
                    }
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
                    protected _schema () {
                        return {
                            id: {
                                type: "string",
                                column: "_id"
                            }
                        };
                    }
                }

                class SubCollection extends Collection {
                    protected _model () {
                        return SubModel;
                    }
                }

                class OtherModel extends Model {
                    protected _schema () {
                        return {
                            id: {
                                type: "string",
                                column: "_id"
                            },
                            model: {
                                type: SubCollection
                            }
                        };
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
                    protected _schema () {
                        let obj: any = {
                            id: {
                                type: "string",
                                column: "_id"
                            },
                            value: {
                                type: "string",
                                column: null
                            }
                        };
                        return obj;
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

        describe("#where", function () {

            var obj: any,
                ChildModel: any;
            beforeEach(function () {

                class Child extends Model {
                    protected _schema () {
                        return {
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
                            string: {
                                type: "string"
                            },
                            obj: {
                                type: "object"
                            }
                        };
                    }
                }

                ChildModel = Child;

                obj = new ChildModel({
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.2",
                    integer: "2",
                    string: "string",
                    obj: {
                        hello: "world"
                    }
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

            it("should return true when multiple params of same type are passed in including an object", function () {

                var out = obj.where({
                    string: "string",
                    datetime: new Date(2010, 1, 7),
                    obj: {
                        hello: "world"
                    }
                });

                expect(out).to.be.true;

            });

            it("should return false when objects don't match", function () {

                var out = obj.where({
                    obj: {
                        hello: "worlds"
                    }
                });

                expect(out).to.be.false;

            });

            it("should return false when Date objects don't match", function () {

                var out = obj.where({
                    datetime: new Date("2010-02-06")
                });

                expect(out).to.be.false;

            });

            it("should return true when the input needs casting to the datatype", function () {
                expect(obj.where({
                    float: "2.2"
                })).to.be.true;
            });

            it("should return true when the input needs casting to the datatype with multiple where values", function () {
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
                    function () {},
                    void 0
                ].forEach(function (input) {

                    var fail = false;

                    try {
                        obj.where(input);
                    } catch (err) {

                        fail = true;
                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("Model.where properties must be an object");

                    } finally {

                        expect(fail).to.be.true;

                    }

                });

            });

        });

        describe("#validation", function () {

            describe("Single rule", function () {

                before(function () {

                    /* Define the model */
                    class Child extends Model {
                        protected _schema () {
                            return {
                                name: {
                                    type: "string",
                                    validation: [{
                                        rule: "required"
                                    }]
                                }
                            };
                        }
                    }

                    this.Child = Child;

                });

                it("should not throw an error when a string is provided", function () {

                    var obj = new this.Child({
                        name: "Test Name"
                    });

                    expect(obj.validate()).to.be.true;

                });

                it("should not throw an error when email not specified and not required", function () {

                    class M extends Model {
                        protected _schema () {
                            let obj: any = {
                                email: {
                                    type: "string",
                                    value: null,
                                    validation: [
                                        {
                                            rule: "email"
                                        }
                                    ]
                                }
                            };
                            return obj;
                        }
                    }

                    var obj = new M();

                    expect(obj.validate()).to.be.true;

                    obj.set("email", "notanemail");

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);
                        expect(err.message).to.be.equal("Model validation error");

                        expect(err.getErrors()).to.be.eql({
                            email: [
                                {
                                    message: "VALUE_NOT_EMAIL",
                                    value: "notanemail"
                                }
                            ]
                        });

                    }

                    expect(fail).to.be.true;

                    obj.set("email", "test@test.com");

                    expect(obj.validate()).to.be.true;

                });

                it("should throw error when string is null", function () {

                    var obj = new this.Child();

                    expect(obj).to.be.instanceof(this.Child);

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

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

                });

            });

            describe("Multiple keys, single rules on all", function () {

                before(function () {

                    /* Define the model */
                    class Child extends Model {
                        protected _schema () {
                            return {
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
                            };
                        }
                    }
                    this.Child = Child;
                });

                it("should validate both rules", function () {

                    var obj = new this.Child({
                        name: "Test",
                        emailAddress: "test@test.com"
                    });

                    expect(obj.validate()).to.be.true;

                });

                it("should fail to validate the first rule", function () {

                    var obj = new this.Child({
                        emailAddress: "test@test.com"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

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

                });

                it("should fail to validate the second rule", function () {

                    var obj = new this.Child({
                        name: "Test",
                        emailAddress: "not@anemail"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

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

                });

                it("should fail to validate both rules", function () {

                    var obj = new this.Child({
                        emailAddress: "noanemail.com",
                        name: ""
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

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

                });

            });

            describe("Multiple keys, multiple rules on all", function () {

                before(function () {

                    /* Define the model */
                    class Child extends Model {
                        protected _schema () {
                            return {
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
                            };
                        }
                    }

                    this.Child = Child;

                });

                it("should validate all rules", function () {

                    var obj = new this.Child({
                        emailAddress1: "example@domain.com",
                        emailAddress2: "test@test.com"
                    });

                    expect(obj.validate()).to.be.true;

                });

                it("should fail all rules", function () {

                    var obj = new this.Child({
                        emailAddress1: "f",
                        emailAddress2: "testtest.com"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

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

                });

                it("should fail one rule on one element", function () {

                    var obj = new this.Child({
                        emailAddress1: "f",
                        emailAddress2: "testtest.com"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

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

                });

                it("should fail on multiple errors on a single key", function () {

                    var obj = new this.Child({
                        emailAddress2: "test@test.com"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

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

                });

            });

            describe("Validate rules that receive a single parameter", function () {

                before(function () {

                    /* Define the model */
                    class Child extends Model {
                        protected _schema () {
                            return {
                                name: {
                                    type: "string",
                                    validation: [
                                        {
                                            rule: "minLength",
                                            param: [
                                                5
                                            ]
                                        }
                                    ]
                                }
                            };
                        }
                    }

                    this.Child = Child;

                });

                it("should validate the model", function () {

                    var obj = new this.Child({
                        name: "Test1234"
                    });

                    expect(obj.validate()).to.be.true;

                });

                it("should throw an error when not validated", function () {

                    var obj = new this.Child({
                        name: "Test"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

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

                });

            });

            describe("Validate rules that receive multiple parameters", function () {

                before(function () {

                    /* Define the model */
                    class Child extends Model {
                        protected _schema () {
                            return {
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
                            };
                        }
                    }

                    this.Child = Child;

                });

                it("should validate the multi-parameter rule", function () {

                    var obj = new this.Child({
                        name: "The name"
                    });

                    expect(obj.validate()).to.be.true;

                });

                it("should throw an error if the name is too short", function () {

                    var obj = new this.Child({
                        name: "name"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

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

                });

            });

            describe("Validate against custom validation rules", function () {

                describe("No parameters passed", function () {

                    before(function () {

                        /* Define the model */
                        class Child extends Model {
                            protected _schema () {
                                let obj: any = {
                                    name: {
                                        type: "string",
                                        validation: [
                                            {
                                                rule: function (value: any) {
                                                    if (value === "throw") {
                                                        throw new Error("THROWN_ERROR");
                                                    }
                                                    return value === "Hello";
                                                }
                                            }
                                        ]
                                    }
                                };
                                return obj;
                            }
                        }

                        this.Child = Child;

                    });

                    it("should validate the custom rule", function () {

                        var obj = new this.Child({
                            name: "Hello"
                        });

                        expect(obj.validate()).to.be.true;

                    });

                    it("should throw an error when custom rule returns false", function () {

                        var obj = new this.Child({
                            name: "Potato"
                        });

                        var fail = false;

                        try {
                            obj.validate();
                        } catch (err) {
                            fail = true;

                            expect(err).to.be.instanceof(ValidationException);

                            expect(err.getErrors()).to.be.eql({
                                name: [
                                    {
                                        message: "Custom model validation failed",
                                        value: "Potato"
                                    }
                                ]
                            });
                        }

                        expect(fail).to.be.true;

                        obj.set("name", "Hello");

                        expect(obj.validate()).to.be.true;

                    });

                    it("should throw an error when custom rule throws error", function () {

                        var obj = new this.Child({
                            name: "throw"
                        });

                        var fail = false;

                        try {
                            obj.validate();
                        } catch (err) {
                            fail = true;

                            expect(err).to.be.instanceof(ValidationException);

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

                    });

                });

                describe("Single parameter passed", function () {

                    before(function () {

                        /* Define the model */
                        class Child extends Model {
                            protected _schema () {
                                return {
                                    name: {
                                        type: "string",
                                        validation: [
                                            {
                                                rule: function (value: any, objModel: any, match: any) {
                                                    if (value === "throw") {
                                                        throw new Error("THROWN_ERROR");
                                                    }
                                                    return value === match;
                                                },
                                                param: "Hello"
                                            }
                                        ]
                                    }
                                };
                            }
                        }

                        this.Child = Child;

                    });

                    it("should validate the custom rule", function () {

                        var obj = new this.Child({
                            name: "Hello"
                        });

                        expect(obj.validate()).to.be.true;

                    });

                    it("should throw an error when the test returns false", function () {

                        var obj = new this.Child({
                            name: "false"
                        });

                        var fail = false;

                        try {
                            obj.validate();
                        } catch (err) {

                            fail = true;

                            expect(err).to.be.instanceof(ValidationException);

                            expect(err.getErrors()).to.be.eql({
                                name: [
                                    {
                                        message: "Custom model validation failed",
                                        value: "false"
                                    }
                                ]
                            });

                        }

                        expect(fail).to.be.true;

                        obj.set("name", "Hello");

                        expect(obj.validate()).to.be.true;

                    });

                    it("should throw an error when the validation method throws an error", function () {

                        var obj = new this.Child({
                            name: "throw"
                        });

                        var fail = false;

                        try {
                            obj.validate();
                        } catch (err) {

                            fail = true;

                            expect(err).to.be.instanceof(ValidationException);

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

                    });

                });

                describe("Array of parameters passed", function () {

                    before(function () {

                        /* Define the model */
                        class Child extends Model {
                            protected _schema () {
                                return {
                                    name: {
                                        type: "string",
                                        validation: [
                                            {
                                                rule: function (value: any, objModel: any, match: any, datatype: any) {
                                                    if (value === "throw") {
                                                        throw new Error("THROWN_ERROR");
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
                                };
                            }
                        }

                        this.Child = Child;

                    });

                    it("should validate the custom rule", function () {

                        var obj = new this.Child({
                            name: "Hello"
                        });

                        expect(obj.validate()).to.be.true;

                    });

                    it("should throw an error when the validation function returns false", function () {

                        var obj = new this.Child({
                            name: "test"
                        });

                        var fail = false;

                        try {
                            obj.validate();
                        } catch (err) {

                            fail = true;

                            expect(err).to.be.instanceof(ValidationException);

                            expect(err.getErrors()).to.be.eql({
                                name: [
                                    {
                                        message: "Custom model validation failed",
                                        value: "test"
                                    }
                                ]
                            });

                        }

                        expect(fail).to.be.true;

                        obj.set("name", "Hello");

                        expect(obj.validate()).to.be.true;

                    });

                    it("should throw an error when the validation method throws an error", function () {

                        var obj = new this.Child({
                            name: "throw"
                        });

                        var fail = false;

                        try {
                            obj.validate();
                        } catch (err) {

                            fail = true;

                            expect(err).to.be.instanceof(ValidationException);

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

                    });

                });

            });

            describe("Matching another field", function () {

                before(function () {

                    /* Define the model */
                    class Child extends Model {
                        protected _schema () {
                            return {
                                password: {
                                    type: "string",
                                    validation: [
                                        {
                                            rule: "minLength",
                                            param: [
                                                8
                                            ]
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
                            };
                        }
                    }

                    this.Child = Child;
                });

                it("should validate the model", function () {

                    var obj = new this.Child({
                        password: "tnetennba",
                        password2: "tnetennba"
                    });

                    try {
                        expect(obj.validate()).to.be.true;
                    } catch (err) {
                        console.log(err);
                        console.log(err.getErrors());
                        console.log(err.stack);
                    }

                });

                it("should fail when the password is to short", function () {

                    var obj = new this.Child({
                        password: "Moss",
                        password2: "Moss"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

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

                });

                it("should fail when the password doesn't match", function () {

                    var obj = new this.Child({
                        password: "MauriceMoss",
                        password2: "RoyTrenneman"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

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

                });

                it("should fail when both rules fail", function () {

                    var obj = new this.Child({
                        password: "Jen",
                        password2: "Roy"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

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

                });

            });

            describe("Invalid functions", function () {

                it("should throw an error when function not in validation object", function () {

                    /* Define the model */
                    class Child extends Model {
                        protected _schema () {
                            return {
                                str: {
                                    type: "string",
                                    validation: [
                                        {
                                            rule: "minimumLength",
                                            param: [
                                                8
                                            ]
                                        }
                                    ]
                                }
                            };
                        }
                    }

                    var fail = false;

                    var obj: Child;
                    try {
                        obj = new Child({
                            str: "some string"
                        });
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(Error);
                        expect(err.message).to.be.equal("'minimumLength' is not a validation function");
                    }

                    expect(obj).to.be.undefined;
                    expect(fail).to.be.true;

                });

                it("should throw an error when non-function given", function () {

                    /* Define the model */
                    class Child extends Model {
                        protected _schema () {
                            return {
                                str: {
                                    type: "string",
                                    validation: [
                                        {
                                            rule: {},
                                            param: 8
                                        }
                                    ]
                                }
                            };
                        }
                    }

                    var fail = false;

                    var obj: Child;
                    try {
                        obj = new Child({
                            str: "some string"
                        });
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(Error);
                        expect(err.message).to.be.equal("IDefinitionValidation.rule must be a function or a string, not a object");
                    }

                    expect(obj).to.be.undefined;
                    expect(fail).to.be.true;

                });

                it("should validate when not all keys have validation", function () {

                    class Child extends Model {
                        protected _schema () {
                            let obj: any = {
                                id: {
                                    type: "integer",
                                    value: null
                                },
                                datetime: {
                                    type: "date",
                                    value: new Date()
                                },
                                postCode: {
                                    type: "string",
                                    value: null,
                                    validation: [
                                        {
                                            rule: "regex",
                                            param: [
                                                new RegExp("^postcode$")
                                            ]
                                        },
                                        {
                                            rule: "required"
                                        }
                                    ]
                                }
                            };
                            return obj;
                        }

                    }

                    var fail = false;

                    var obj = new Child({
                        shipmentId: "1",
                        postCode: "not a postcode"
                    });

                    var fail = false;

                    try {
                        obj.validate();
                    } catch (err) {
                        fail = true;

                        expect(err).to.be.instanceof(ValidationException);

                        expect(err.getErrors()).to.be.eql({
                            postCode: [
                                {
                                    message: "VALUE_REGEX_FAILED_TO_MATCH",
                                    value: "not a postcode",
                                    additional: [
                                        "/^postcode$/"
                                    ]
                                }
                            ]
                        });

                    }

                    expect(fail).to.be.true;

                    obj.set("postCode", "postcode");

                    expect(obj.validate()).to.be.true;

                });

            });

            describe("Collection", function () {

                beforeEach(function () {

                    class SubModel extends Model {
                        protected _schema () {
                            let obj: any = {
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
                                        param: [2]
                                    }, {
                                        rule: function (value: any) {
                                            return value === "Bob";
                                        }
                                    }]
                                }
                            };
                            return obj;
                        }

                    }

                    class SubCollection extends Collection {
                        protected _model () {
                            return SubModel;
                        }
                    }

                    class MyModel extends Model {
                        protected _schema () {
                            return {
                                id: {
                                    type: "string",
                                    validation: [{
                                        rule: "required"
                                    }, {
                                        rule: "minLength",
                                        param: [5]
                                    }]
                                },
                                collection: {
                                    type: SubCollection,
                                    validation: [{
                                        rule: "required"
                                    }, {
                                        rule: "minLength",
                                        param: [1]
                                    }]
                                }
                            };
                        }

                    }

                    this.SubModel = SubModel;
                    this.SubCollection = SubCollection;
                    this.MyModel = MyModel;

                });

                it("should validate a collection with no erroring models", function () {

                    var obj = new this.MyModel({
                        id: "12345",
                        collection: [{
                            id: "3333",
                            name: "Bob"
                        }]
                    });

                    expect(obj.validate()).to.be.true;

                });

                it("should validate a collection error", function () {

                    var obj = new this.MyModel();

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

                it("should validate a collection with one erroring model", function () {

                    var obj = new this.MyModel({
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

                        expect(err).to.be.instanceof(ValidationException);
                        expect(err.message).to.be.equal("Model validation error");

                        expect(err.getErrors()).to.be.eql({
                            id: [{
                                message: "VALUE_REQUIRED",
                                value: null
                            }],
                            "collection_0_name": [{
                                message: "VALUE_LESS_THAN_MIN_LENGTH",
                                value: "",
                                additional: [
                                    2
                                ]
                            }, {
                                message: "Custom model validation failed",
                                value: ""
                            }]
                        })

                    } finally {
                        expect(fail).to.be.true;
                    }

                });

                it("should validate a collection with multiple erroring models", function () {

                    var obj = new this.MyModel({
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

                        expect(err).to.be.instanceof(ValidationException);
                        expect(err.message).to.be.equal("Model validation error");

                        expect(err.getErrors()).to.be.eql({
                            id: [{
                                message: "VALUE_REQUIRED",
                                value: null
                            }],
                            "collection_0_name": [{
                                message: "VALUE_LESS_THAN_MIN_LENGTH",
                                value: "",
                                additional: [
                                    2
                                ]
                            }, {
                                message: "Custom model validation failed",
                                value: ""
                            }],
                            "collection_1_name": [{
                                message: "Custom model validation failed",
                                value: "2s"
                            }]
                        })

                    } finally {
                        expect(fail).to.be.true;
                    }

                });

            });

            describe("SubModels", function () {

                beforeEach(function () {

                    class SubModel extends Model {
                        protected _schema () {
                            return {
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
                                        param: [
                                            2
                                        ]
                                    }, {
                                        rule: function (value: any) {
                                            return value === "Bob";
                                        }
                                    }]
                                }
                            };
                        }
                    }


                    class MyModel extends Model {
                        protected _schema () {
                            return {
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
                            };
                        }
                    }

                    this.SubModel = SubModel;
                    this.MyModel = MyModel;
                });

                it("should validate a submodel with no errors", function () {

                    var obj = new this.MyModel({
                        id: "2468",
                        model: {
                            id: "12345",
                            name: "Bob"
                        }
                    });

                    expect(obj.validate()).to.be.true;

                });

                it("should validate a model with required submodel", function () {

                    var obj = new this.MyModel({
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

                    var obj = new this.MyModel({
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
                            "model_id": [{
                                message: "VALUE_REQUIRED",
                                value: null
                            }],
                            "model_name": [{
                                message: "VALUE_LESS_THAN_MIN_LENGTH",
                                value: "B",
                                additional: [
                                    2
                                ]
                            }, {
                                message: "Custom model validation failed",
                                value: "B"
                            }]
                        });

                    } finally {
                        expect(fail).to.be.true;
                    }

                });

            });

        });

        describe("Primary keys", function () {

            it("should set no primary key value", function () {

                /* Define the model */
                class Child extends Model {
                    protected _schema () {
                        let obj: any = {
                            dataId: {
                                type: "integer",
                                value: null,
                                column: "id"
                            },
                            name: {
                                type: "string"
                            }
                        };
                        return obj;
                    }
                }

                var obj = new Child({
                    dataId: 1,
                    name: "Dave"
                });

                expect(obj.getPrimaryKey()).to.be.null;
                expect(obj.getPrimaryKeyValue()).to.be.undefined;

                var from = Child.toModel({
                    id: 1,
                    name: "Dave"
                });

                expect(from.getPrimaryKey()).to.be.null;
                expect(from.getPrimaryKeyValue()).to.be.undefined;

            });

            it("should set the primary key", function () {

                /* Define the model */
                class Child extends Model {
                    protected _schema () {
                        let obj: any = {
                            dataId: {
                                type: "integer",
                                value: null,
                                column: "id",
                                primaryKey: true
                            },
                            name: {
                                type: "string"
                            }
                        };
                        return obj;
                    }
                }

                var obj = new Child();

                expect(obj.getPrimaryKey()).to.be.equal("dataId");
                expect(obj.getPrimaryKeyValue()).to.be.null;

                var from = Child.toModel();

                expect(from.getPrimaryKey()).to.be.equal("dataId");
                expect(from.getPrimaryKeyValue()).to.be.null;

            });

            it("should set the primary key value", function () {

                /* Define the model */
                class Child extends Model {
                    protected _schema () {
                        let obj: any = {
                            dataId: {
                                type: "integer",
                                value: null,
                                column: "id",
                                primaryKey: true
                            },
                            name: {
                                type: "string"
                            }
                        };
                        return obj;
                    }
                }

                var obj = new Child({
                    dataId: 1,
                    name: "Dave"
                });

                expect(obj.getPrimaryKey()).to.be.equal("dataId");
                expect(obj.getPrimaryKeyValue()).to.be.equal(1);

                var from = Child.toModel({
                    id: 1,
                    name: "Dave"
                });

                expect(from.getPrimaryKey()).to.be.equal("dataId");
                expect(from.getPrimaryKeyValue()).to.be.equal(1);

            });

            it("should throw error when more than one primary key is given", function () {

                /* Define the model */
                class Child extends Model {
                    protected _schema () {
                        let obj: any = {
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
                        };
                        return obj;
                    }
                }

                var fail = false;

                try {
                    new Child();
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("CANNOT_SET_MULTIPLE_PRIMARY_KEYS");

                }

                expect(fail).to.be.true;

            });

        });

    });

    describe("Static methods", function () {

        describe("#toModel", function () {

            it("should create a model from data", function () {

                class Child extends Model {

                    protected _schema () {
                        return {
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

                    protected _schema () {
                        return {
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

                    protected _schema () {
                        return {
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

            it("should cast collection models correctly", function () {

                class User extends Model {

                    protected _schema () {
                        return {
                            userId: {
                                type: "string",
                                column: "FK_userId"
                            },
                            type: {
                                type: "enum",
                                enum: [
                                    "admin",
                                    "user"
                                ]
                            }
                        };
                    }

                }

                class Users extends Collection {

                    protected _model () {
                        return User;
                    }

                }

                class Child extends Model {

                    protected _schema() {
                        return {
                            users: {
                                type: Users
                            },
                            user: {
                                type: User
                            }
                        };
                    }
                }

                let data = {
                    users: [{
                        FK_userId: "1234",
                        type: "admin"
                    }, {
                        FK_userId: 1235,
                        type: "user"
                    }],
                    user: {
                        FK_userId: 1235,
                        type: "user"
                    }
                };

                let obj = Child.toModel(data);

                expect(obj).to.be.instanceof(Child)
                    .instanceof(Model);

                expect(obj.getData()).to.be.eql({
                    users: [{
                        userId: "1234",
                        type: "admin"
                    }, {
                        userId: "1235",
                        type: "user"
                    }],
                    user: {
                        userId: "1235",
                        type: "user"
                    }
                });

            });

        });

    });

});
