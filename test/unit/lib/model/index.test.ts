/**
 * model.test
 */


"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */


/* Files */
import {expect} from "../../../helpers/configure";
import {Model} from "../../../../lib/model/index";
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


        });

    });

});
