/**
 * definition.test
 */

/// <reference path="../../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect, proxyquire, sinon} from "../../helpers/configure";


describe("Model Definition", function () {

    let Definition: any,
        Validation: any;
    beforeEach(function () {

        Validation = {
            generateFunction: sinon.stub()
        };

        Definition = proxyquire("../../lib/definition", {
            "./validation": {
                Validation: Validation
            }
        }).Definition;

    });

    describe("Methods", function () {

        describe("#constructor", function () {

            it("should create an instance with the default values", function () {

                let obj = new Definition();

                expect(obj).to.have.keys([
                    "type",
                    "value",
                    "column",
                    "primaryKey",
                    "validation",
                    "enum",
                    "settings"
                ]);

                expect(obj.type).to.be.null;
                expect(obj.value).to.be.null;
                expect(obj.column).to.be.null;
                expect(obj.primaryKey).to.be.false;
                expect(obj.validation).to.be.eql([]);
                expect(obj.enum).to.be.eql([]);
                expect(obj.settings).to.be.eql({});

            });

            it("should create an instance with some data added - value === null", function () {

                Validation.generateFunction.returns("fn");

                let obj = new Definition({
                    type: "string",
                    value: null,
                    column: "col",
                    primaryKey: 1,
                    validation: [{
                        rule: "string"
                    }],
                    enum: [
                        "hello",
                        "goodbye"
                    ],
                    settings: {
                        hello: "world"
                    }
                });

                expect(Validation.generateFunction).to.be.calledOnce
                    .calledWithExactly({
                        rule: "string"
                    }, null);

                expect(obj.validation).to.be.eql([
                    "fn"
                ]);

                expect(obj).to.have.keys([
                    "type",
                    "value",
                    "column",
                    "primaryKey",
                    "validation",
                    "enum",
                    "settings"
                ]);

                expect(obj.type).to.be.equal("string");
                expect(obj.value).to.be.null;
                expect(obj.column).to.be.equal("col");
                expect(obj.primaryKey).to.be.true;
                expect(obj.validation).to.be.eql([
                    "fn"
                ]);
                expect(obj.enum).to.be.eql([
                    "hello",
                    "goodbye"
                ]);
                expect(obj.settings).to.be.eql({
                    hello: "world"
                });

            });

            it("should create an instance with some data added - value === object", function () {

                Validation.generateFunction.returns("fn");

                let value: any = {
                    my: "value"
                };

                let obj = new Definition({
                    type: "string",
                    value: value,
                    column: "col",
                    primaryKey: 1,
                    validation: [{
                        rule: "string"
                    }],
                    enum: [
                        "hello",
                        "goodbye"
                    ],
                    settings: {
                        hello: "world"
                    }
                });

                expect(Validation.generateFunction).to.be.calledOnce
                    .calledWithExactly({
                        rule: "string"
                    }, value);

                expect(obj.validation).to.be.eql([
                    "fn"
                ]);

                expect(obj).to.have.keys([
                    "type",
                    "value",
                    "column",
                    "primaryKey",
                    "validation",
                    "enum",
                    "settings"
                ]);

                expect(obj.type).to.be.equal("string");
                expect(obj.value).to.be.eql(value)
                    .to.not.be.equal(value);
                expect(obj.column).to.be.equal("col");
                expect(obj.primaryKey).to.be.true;
                expect(obj.validation).to.be.eql([
                    "fn"
                ]);
                expect(obj.enum).to.be.eql([
                    "hello",
                    "goodbye"
                ]);
                expect(obj.settings).to.be.eql({
                    hello: "world"
                });

            });

        });

        describe("#addValidation", function () {

            let obj: any;
            beforeEach(function () {
                obj = new Definition();
            });

            it("should not bother adding a null function", function () {

                expect(obj.addValidation()).to.be.equal(obj);
                expect(obj.addValidation([])).to.be.equal(obj);

                expect(Validation.generateFunction).to.not.be.called;

            });

            it("should do nothing if object passed in", function () {


                expect(obj.addValidation({
                    rule: "rule",
                    param: [
                        1, 2, 3
                    ]
                }));

                expect(Validation.generateFunction).to.not.be.called;

            });

            it("should dispatch to the Validation.generateFunction method if array of objects", function () {

                Validation.generateFunction.returns("fn1");

                expect(obj.addValidation([{
                    rule: "rule",
                    param: [
                        1, 2, 3
                    ]
                }]));

                expect(Validation.generateFunction).to.be.calledOnce
                    .calledWithExactly({
                        rule: "rule",
                        param: [
                            1, 2, 3
                        ]
                    }, null);

                expect(obj.validation).to.be.eql([
                    "fn1"
                ]);

            });

        });

        describe("#getSetting", function () {

            it("should get a setting", function () {

                let obj = new Definition({
                    settings: {
                        hello: "world"
                    }
                });

                expect(obj.getSetting("hello")).to.be.equal("world");

            });

            it("should return undefined if not set", function () {

                let obj = new Definition;

                expect(obj.getSetting("hello")).to.be.undefined;

            });

        });

        describe("#hasPrimaryKey", function () {

            it("should return true when set", function () {

                let obj: any = new Definition({
                    primaryKey: true
                });

                expect(obj.hasPrimaryKey()).to.be.true;

                let obj1: any = new Definition({
                    primaryKey: 1
                });

                expect(obj1.hasPrimaryKey()).to.be.true;

            });

            it("should return false when not set", function () {

                let obj: any = new Definition();

                expect(obj.hasPrimaryKey()).to.be.false;

                let obj1: any = new Definition({
                    primaryKey: false
                });

                expect(obj1.hasPrimaryKey()).to.be.false;

                let obj2: any = new Definition({
                    primaryKey: 0
                });

                expect(obj2.hasPrimaryKey()).to.be.false;

            });

        });

    });

    describe("Static methods", function () {

        describe("#toDefinition", function () {

            it("should create an instance of the Definition - default values", function () {

                let obj = Definition.toDefinition("name", {});

                expect(obj).to.be.instanceof(Definition);

                expect(obj).to.have.keys([
                    "type",
                    "value",
                    "column",
                    "primaryKey",
                    "validation",
                    "enum",
                    "settings"
                ]);

                expect(obj.type).to.be.null;
                expect(obj.value).to.be.null;
                expect(obj.column).to.be.equal("name");
                expect(obj.primaryKey).to.be.false;
                expect(obj.validation).to.be.eql([]);
                expect(obj.enum).to.be.eql([]);
                expect(obj.settings).to.be.eql({});

            });

        });

        it("should create an instance of the Definition - some values", function () {

            Validation.generateFunction.returns(2);

            let obj = Definition.toDefinition("name2", {
                type: "string",
                value: "value",
                column: "col",
                primaryKey: true,
                validation: [{
                    rule: "rule",
                    param: [1]
                }],
                enum: [
                    "hello"
                ],
                settings: {
                    hello: "world"
                }
            });

            expect(obj).to.be.instanceof(Definition);

            expect(obj).to.have.keys([
                "type",
                "value",
                "column",
                "primaryKey",
                "validation",
                "enum",
                "settings"
            ]);

            expect(obj.type).to.be.equal("string");
            expect(obj.value).to.be.equal("value");
            expect(obj.column).to.be.equal("col");
            expect(obj.primaryKey).to.be.true;
            expect(obj.validation).to.be.eql([2]);
            expect(obj.enum).to.be.eql([
                "hello"
            ]);
            expect(obj.settings).to.be.eql({
                hello: "world"
            });

        });

        it("should create an instance of the Definition - null column", function () {

            Validation.generateFunction.returns(2);

            let obj = Definition.toDefinition("name2", {
                type: "string",
                value: "value",
                column: null,
                primaryKey: true,
                validation: [{
                    rule: "rule",
                    param: [1]
                }],
                enum: [
                    "hello"
                ],
                settings: {
                    hello: "world"
                }
            });

            expect(obj).to.be.instanceof(Definition);

            expect(obj).to.have.keys([
                "type",
                "value",
                "column",
                "primaryKey",
                "validation",
                "enum",
                "settings"
            ]);

            expect(obj.type).to.be.equal("string");
            expect(obj.value).to.be.equal("value");
            expect(obj.column).to.be.null;
            expect(obj.primaryKey).to.be.true;
            expect(obj.validation).to.be.eql([2]);
            expect(obj.enum).to.be.eql([
                "hello"
            ]);
            expect(obj.settings).to.be.eql({
                hello: "world"
            });

        });

    });

});
