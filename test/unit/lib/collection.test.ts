/**
 * collection.test
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as uuid from "node-uuid";


/* Files */
import {expect} from "../../helpers/configure";
import {Definition} from "../../../lib/model/definition";
import {Model} from "../../../lib/model/index";
import {Collection} from "../../../lib/collection";
import {Base} from "../../../lib/base";
import {ValidationException} from "../../../exception/validation/index";


const UUID_V4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;


describe("Collection test", function () {

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
                    }
                };
            }
        }

        class Children extends Collection {
            protected _model () {
                return Child;
            }
        }

        this.Child = Child;
        this.Children = Children;

    });

    describe("Methods", function () {

        describe("#constructor", function () {

            it("should be cheerful when it doesn't receive an data", function () {

                var obj = new this.Children();

                expect(obj).to.be.instanceof(Collection)
                    .instanceof(this.Children)
                    .instanceof(Base);
                expect(obj.getCount()).to.be.equal(0);

                expect(obj.getAll()).to.be.an("array")
                    .to.have.length(0);

            });

            it("should create a collection of models from an object literal", function () {

                var obj = new this.Children([{
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }, {
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }]);

                expect(obj).to.be.instanceof(Collection)
                    .instanceof(this.Children)
                    .instanceof(Base);
                expect(obj.getCount()).to.be.equal(2);

                expect(obj.getAll()).to.be.an("array")
                    .to.have.length(2);
                expect(obj.getAll()[0]).to.have.all.keys([
                    "id",
                    "model"
                ]);
                expect(obj.getAll()[0].id).to.be.a("string")
                    .match(UUID_V4);
                expect(obj.getAll()[0].model).to.be.eql(new this.Child({
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }));

                expect(obj.getAll()[1]).to.have.all.keys([
                    "id",
                    "model"
                ]);
                expect(obj.getAll()[1].id).to.be.a("string")
                    .match(UUID_V4);
                expect(obj.getAll()[1].model).to.be.eql(new this.Child({
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }));

            });

            it("should create a collection of models from an model instance", function () {

                let model = new this.Child({
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                });

                var obj = new this.Children([model]);

                expect(obj).to.be.instanceof(Collection)
                    .instanceof(this.Children)
                    .instanceof(Base);
                expect(obj.getCount()).to.be.equal(1);

                expect(obj.getAll()).to.be.an("array")
                    .to.have.length(1);
                expect(obj.getAll()[0]).to.have.all.keys([
                    "id",
                    "model"
                ]);
                expect(obj.getAll()[0].id).to.be.a("string");
                expect(obj.getAll()[0].model).to.be.equal(model);

            });

        });

        describe("#add", function () {

            let obj: any;
            beforeEach(function () {
                obj = new this.Children();

                expect(obj.getCount()).to.be.equal(0);
                expect(obj.getAll()).to.be.eql([]);
            });

            it("should add many plain objects and convert to the models", function () {

                let model1 = {
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                };

                let model2 = {
                    boolean: "false",
                    datetime: "2011-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                };

                expect(obj.add([
                    model1,
                    model2
                ])).to.be.equal(obj);

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.getAll()).to.be.an("array")
                    .to.have.length(2);
                expect(obj.getAll()[0]).to.have.all.keys([
                    "id",
                    "model"
                ]);
                expect(obj.getAll()[0].id).to.be.a("string")
                    .match(UUID_V4);
                expect(obj.getAll()[0].model).to.be.eql(new this.Child(model1));

                expect(obj.getAll()[1]).to.have.all.keys([
                    "id",
                    "model"
                ]);
                expect(obj.getAll()[1].id).to.be.a("string")
                    .match(UUID_V4);
                expect(obj.getAll()[1].model).to.be.eql(new this.Child(model2));


            });

            it("should add many model instances and keep same equality", function () {

                let model1 = new this.Child({
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                });

                let model2 = new this.Child({
                    boolean: "false",
                    datetime: "2011-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                });

                expect(obj.add([
                    model1,
                    model2
                ])).to.be.equal(obj);

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.getAll()).to.be.an("array")
                    .to.have.length(2);
                expect(obj.getAll()[0]).to.have.all.keys([
                    "id",
                    "model"
                ]);
                expect(obj.getAll()[0].id).to.be.a("string")
                    .match(UUID_V4);
                expect(obj.getAll()[0].model).to.be.equal(model1);

                expect(obj.getAll()[1]).to.have.all.keys([
                    "id",
                    "model"
                ]);
                expect(obj.getAll()[1].id).to.be.a("string")
                    .match(UUID_V4);
                expect(obj.getAll()[1].model).to.be.equal(model2);


            });

            it("should ignore any non-arrays", function () {

                expect(obj.add({
                    boolean: true
                })).to.be.equal(obj);

                expect(obj.getCount()).to.be.equal(0);

                expect(obj.add()).to.be.equal(obj);

                expect(obj.getCount()).to.be.equal(0);

            });

        });

        describe("#addOne", function () {

            let obj: any;
            beforeEach(function () {
                obj = new this.Children();

                expect(obj.getCount()).to.be.equal(0);
                expect(obj.getAll()).to.be.eql([]);
            });

            it("should add many plain objects and convert to the models", function () {

                let model1 = {
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                };

                let model2 = {
                    boolean: "false",
                    datetime: "2011-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                };

                expect(obj.addOne(model1)).to.be.equal(obj);

                expect(obj.getCount()).to.be.equal(1);
                expect(obj.getAll()).to.be.an("array")
                    .to.have.length(1);
                expect(obj.getAll()[0]).to.have.all.keys([
                    "id",
                    "model"
                ]);
                expect(obj.getAll()[0].id).to.be.a("string")
                    .match(UUID_V4);
                expect(obj.getAll()[0].model).to.be.eql(new this.Child(model1));

                expect(obj.addOne(model2)).to.be.equal(obj);

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.getAll()).to.be.an("array")
                    .to.have.length(2);
                expect(obj.getAll()[1]).to.have.all.keys([
                    "id",
                    "model"
                ]);
                expect(obj.getAll()[1].id).to.be.a("string")
                    .match(UUID_V4);
                expect(obj.getAll()[1].model).to.be.eql(new this.Child(model2));


            });

            it("should add many model instances and keep same equality", function () {

                let model1 = new this.Child({
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                });

                let model2 = new this.Child({
                    boolean: "false",
                    datetime: "2011-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                });

                expect(obj.addOne(model1)).to.be.equal(obj);

                expect(obj.getCount()).to.be.equal(1);
                expect(obj.getAll()).to.be.an("array")
                    .to.have.length(1);
                expect(obj.getAll()[0]).to.have.all.keys([
                    "id",
                    "model"
                ]);
                expect(obj.getAll()[0].id).to.be.a("string")
                    .match(UUID_V4);
                expect(obj.getAll()[0].model).to.be.equal(model1);

                expect(obj.addOne(model2)).to.be.equal(obj);

                expect(obj.getCount()).to.be.equal(2);
                expect(obj.getAll()).to.be.an("array")
                    .to.have.length(2);
                expect(obj.getAll()[1]).to.have.all.keys([
                    "id",
                    "model"
                ]);
                expect(obj.getAll()[1].id).to.be.a("string")
                    .match(UUID_V4);
                expect(obj.getAll()[1].model).to.be.equal(model2);


            });

            it("should ignore any non-objects", function () {

                expect(obj.addOne([{
                    boolean: true
                }])).to.be.equal(obj);

                expect(obj.getCount()).to.be.equal(0);

                expect(obj.addOne()).to.be.equal(obj);

                expect(obj.getCount()).to.be.equal(0);

            });

        });

        describe("#getAll", function () {

            it("should return all the models", function () {

                let obj = new this.Children();

                expect(obj.getAll()).to.be.eql([]);

                obj.addOne({
                    boolean: true
                });
                expect(obj.getAll()).to.be.an("array")
                    .to.have.length(1);
                expect(obj.getAll()[0]).to.have.all.keys([
                    "id",
                    "model"
                ]);
                expect(obj.getAll()[0].id).to.be.a("string")
                    .match(UUID_V4);
                expect(obj.getAll()[0].model).to.be.eql(new this.Child({
                    boolean: true
                }));

            });

        });

        describe("getters", function () {

            let obj: any,
                model1: any,
                model2: any,
                id1: string,
                id2: string;
            beforeEach(function () {

                model1 = new this.Child({
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                });

                model2 = new this.Child({
                    boolean: "false",
                    datetime: "2011-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                });

                obj = new this.Children([
                    model1,
                    model2
                ]);

                expect(obj.getCount()).to.be.equal(2);

                let data = obj.getAll();
                id1 = data[0].id;
                id2 = data[1].id;

            });

            describe("#getAllById", function () {

                it("should get in the model order", function () {

                    expect(obj.getAllById([id2, id1])).to.be.eql([
                        model1,
                        model2
                    ]);

                });

                it("should ignore non-existent IDs", function () {

                    expect(obj.getAllById([id2, uuid.v4(), "ddd", "eee"])).to.be.eql([
                        model2
                    ]);

                });

                it("should return an empty array if no valid IDs", function () {

                    expect(obj.getAllById([uuid.v4(), "eee", "fff"])).to.be.eql([]);

                });

            });

            describe("#getAllByKey", function () {

                it("should get in the model order", function () {

                    expect(obj.getAllByKey([1, 0])).to.be.eql([
                        model1,
                        model2
                    ]);

                });

                it("should ignore non-existent IDs", function () {

                    expect(obj.getAllByKey([0, 3, 5, 3])).to.be.eql([
                        model1
                    ]);

                });

                it("should return an empty array if no valid IDs", function () {

                    expect(obj.getAllByKey([3, 5, 3])).to.be.eql([]);

                });

            });

            describe("#getAllByModel", function () {

                it("should get in the model order", function () {

                    expect(obj.getAllByModel([model2, model1])).to.be.eql([
                        model1,
                        model2
                    ]);

                });

                it("should ignore non-existent IDs", function () {

                    let model3 = new this.Child();
                    let model4 = new this.Child();
                    let model5 = new this.Child();

                    expect(obj.getAllByModel([model1, model3, model4, model5])).to.be.eql([
                        model1
                    ]);

                });

                it("should return an empty array if no valid IDs", function () {

                    let model3 = new this.Child();
                    let model4 = new this.Child();
                    let model5 = new this.Child();

                    expect(obj.getAllByModel([model5, model3, model4])).to.be.eql([]);

                });

            });

            describe("#getById", function () {

                it("should return the desired model", function () {

                    expect(obj.getById(id1)).to.be.equal(model1);
                    expect(obj.getById(id2)).to.be.equal(model2);

                });

                it("should return null if none valid", function () {

                    expect(obj.getById(uuid.v4())).to.be.null;

                });

            });

            describe("#getByKey", function () {

                it("should return the desired model", function () {

                    expect(obj.getByKey(0)).to.be.equal(model1);
                    expect(obj.getByKey(1)).to.be.equal(model2);

                });

                it("should return null if none valid", function () {

                    expect(obj.getByKey(3)).to.be.null;

                });

            });

            describe("#getByModel", function () {

                it("should return the desired model", function () {

                    expect(obj.getByModel(model1)).to.be.equal(model1);
                    expect(obj.getByModel(model2)).to.be.equal(model2);

                });

                it("should return null if none valid", function () {

                    let model3 = new this.Child;

                    expect(obj.getByModel(model3)).to.be.null;

                });

            });

        });

        describe("#toDb", function () {

            it("should return the db version", function () {

                var obj = new this.Children([{
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }, {
                    boolean: "true",
                    datetime: "2010-02-07",
                    float: "2.3",
                    integer: "2",
                    string: "string"
                }]);

                expect(obj.toDb()).to.be.eql([{
                    boolean: true,
                    datetime: new Date(2010, 1, 7),
                    float: 2.3,
                    int: 2,
                    string: "string"
                }, {
                    boolean: true,
                    datetime: new Date(2010, 1, 7),
                    float: 2.3,
                    int: 2,
                    string: "string"
                }]);

            });

            it("should return an empty array if nothing set", function () {

                var obj = new this.Children();

                expect(obj.toDb()).to.be.eql([]);

            });

        });

        describe("#validate", function () {

            let obj: any;
            beforeEach(function () {

                class User extends Model {
                    protected _schema () {
                        return {
                            id: {
                                type: "string",
                                validation: [{
                                    rule: "required"
                                }]
                            },
                            emailAddress: {
                                type: "string",
                                validation: [{
                                    rule: "required"
                                }, {
                                    rule: "email"
                                }, {
                                    rule: "minLength",
                                    param: [
                                        3
                                    ]
                                }]
                            }
                        };
                    }
                }

                class Users extends Collection {
                    protected _model () {
                        return User;
                    }
                }

                obj = new Users;

                this.User = User;
                this.Users = Users;

            });

            it("should validate all models", function () {

                obj.add([{
                    id: "12345",
                    emailAddress: "test@testington.com"
                }]);

                expect(obj.validate()).to.be.true;

            });

            it("should fail validation for a single reason", function () {

                let fail = false;

                obj.add([{}]);

                try {
                    obj.validate();
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(ValidationException);
                    expect(err.message).to.be.equal("Collection validation error");

                    expect(err.getErrors()).to.be.eql({
                        "0_id": [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        "0_emailAddress": [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }]
                    });

                } finally {
                    expect(fail).to.be.true;
                }

            });

            it("should fail validation for a multiple reasons", function () {

                let fail = false;

                obj.add([{
                    emailAddress: "u"
                }, {

                }]);

                try {
                    obj.validate();
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(ValidationException);
                    expect(err.message).to.be.equal("Collection validation error");

                    expect(err.getErrors()).to.be.eql({
                        "0_id": [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        "0_emailAddress": [{
                            message: "VALUE_NOT_EMAIL",
                            value: "u"
                        }, {
                            message: "VALUE_LESS_THAN_MIN_LENGTH",
                            value: "u",
                            additional: [
                                3
                            ]
                        }],
                        "1_id": [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        "1_emailAddress": [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }]
                    });

                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

    });

});
