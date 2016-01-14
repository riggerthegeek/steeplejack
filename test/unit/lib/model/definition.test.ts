/**
 * definition.test
 */

/// <reference path="../../../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect, proxyquire, sinon} from "../../../helpers/configure";
import {Definition} from "../../../../lib/model/definition";


describe("Model Definition", function () {

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

        });

        describe("#addValidation", function () {

            let obj: any,
                OtherDefinition: any,
                Validation: any;
            beforeEach(function () {

                Validation = {
                    generateFunction: sinon.stub()
                };

                OtherDefinition = proxyquire("../../lib/model/definition", {
                    "./validation": {
                        Validation: Validation
                    }
                }).Definition;

                obj = new OtherDefinition();

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
                    .calledWith({
                        rule: "rule",
                        param: [
                            1, 2, 3
                        ]
                    });

                expect(obj.validation).to.be.eql([
                    "fn1"
                ]);

            });

        });

    });

});
