/**
 * Validation Exception
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var Base = rootRequire("src/library/Base");
var Exception = rootRequire("src/error/Exception");
var ValidationException = rootRequire().Exceptions.Validation;

var ValidationExceptionDetail = rootRequire("src/error/Validation/Detail");


describe("ValidationException test", function () {

    describe("Instantiation tests", function () {

        it("should extend the Exception and Error classes", function (done) {

            var obj = new ValidationException("message");

            expect(obj).to.be.instanceof(ValidationException);
            expect(obj).to.be.instanceof(Exception);
            expect(obj).to.be.instanceof(Error);

            expect(obj.type).to.be.equal("Validation");
            expect(obj.message).to.be.equal("message");
            expect(obj.stack).to.be.a("string").to.have.length.above("0");

            expect(obj.addError).to.be.a("function");
            expect(obj.getErrors).to.be.a("function");
            expect(obj.hasErrors).to.be.a("function");

            done();

        });

        it("should use detail message", function (done) {

            var obj = new ValidationException();

            expect(obj).to.be.instanceof(ValidationException);
            expect(obj).to.be.instanceof(Exception);
            expect(obj).to.be.instanceof(Error);

            expect(obj.type).to.be.equal("Validation");
            expect(obj.message).to.be.equal("UNKNOWN_ERROR");
            expect(obj.stack).to.be.a("string").to.have.length.above("0");

            done();

        });

    });

    describe("Methods", function () {

        describe("#addError", function () {

            var obj;
            beforeEach(function () {
                obj = new ValidationException();
            });

            it("should add an error with key, value and message", function (done) {

                expect(obj.hasErrors()).to.be.false;

                obj.addError("key", "value", "message");

                expect(obj.hasErrors()).to.be.true;
                expect(obj.getErrors()).to.be.eql({
                    key: [
                        {
                            message: "message",
                            value: "value"
                        }
                    ]
                });

                done();

            });

            it("should add additional information", function (done) {

                expect(obj.hasErrors()).to.be.false;

                obj.addError("key", "value", "message", "string");
                obj.addError("key", "value", "message", {object: null});
                obj.addError("key2", "value", "message", ["array", null, {object: null}]);

                expect(obj.hasErrors()).to.be.true;
                expect(obj.getErrors()).to.be.eql({
                    key: [
                        {
                            message: "message",
                            value: "value",
                            additional: "string"
                        },
                        {
                            message: "message",
                            value: "value",
                            additional: {
                                object: null
                            }
                        }
                    ],
                    key2: [
                        {
                            message: "message",
                            value: "value",
                            additional: [
                                "array", null,
                                {
                                    object: null
                                }
                            ]
                        }
                    ]
                });

                done();


            });

            it("should allow falsey values", function (done) {

                expect(obj.hasErrors()).to.be.false;

                obj.addError("key", null, "message");
                obj.addError("key", false, "message", null);
                obj.addError("key2", undefined, "message");
                obj.addError("key", 0, "message");

                expect(obj.hasErrors()).to.be.true;
                expect(obj.getErrors()).to.be.eql({
                    key: [
                        {
                            message: "message",
                            value: null
                        },
                        {
                            message: "message",
                            value: false,
                            additional: null
                        },
                        {
                            message: "message",
                            value: 0
                        }
                    ],
                    key2: [
                        {
                            message: "message",
                            value: undefined
                        }
                    ]
                });

                done();


            });

            it("should throw an error if key not set", function (done) {

                var fail = false;

                expect(obj.hasErrors()).to.be.false;

                try {
                    obj.addError(null, null, "message");
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("KEY_MUST_BE_SET");
                }

                expect(fail).to.be.true;

                done();

            });

            it("should throw an error if message not set", function (done) {

                var fail = false;

                expect(obj.hasErrors()).to.be.false;

                try {
                    obj.addError("key", null, null);
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("MESSAGE_MUST_BE_SET");
                }

                expect(fail).to.be.true;

                done();

            });

        });

        describe("#getErrors", function () {

            var obj;
            beforeEach(function () {
                obj = new ValidationException();
            });

            it("should return empty array when no errors", function (done) {

                expect(obj.getErrors()).to.be.eql([]);

                done();

            });

        });

    });

});
