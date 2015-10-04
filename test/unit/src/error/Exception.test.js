/**
 * Exception
 */

"use strict";


/* Node modules */
var util = require("util");


/* Third-party modules */
var proxyquire = require("proxyquire");


/* Files */
var Exception = rootRequire().Exceptions.Exception;


describe("Exception test", function () {

    describe("Instantiation tests", function () {

        it("should throw an error when trying to instantiate directly", function (done) {

            var fail = false;

            try {
                var obj = new Exception("message");
            } catch (err) {
                fail = true;

                expect(err).to.be.instanceof(SyntaxError);
                expect(err.message).to.be.equal("Exception type must be set");
            }

            expect(fail).to.be.true;

            done();

        });

        describe("building the error string", function () {

            it("should", function () {
                var stackTrace = {
                    parse: function () {
                        return [{}, {}, {
                            fileName: "/opt/dev/steeplejack/test/unit/src/error/ExceptionTest.js",
                            lineNumber: 40,
                            functionName: "Context.it.type",
                            typeName: "Context",
                            methodName: "it.type",
                            columnNumber: 23,
                            native: false,
                            getFileName: function () {
                                return this.fileName;
                            },
                            getLineNumber: function () {
                                return this.lineNumber;
                            }
                        }, {
                            fileName: "/opt/dev/steeplejack/test/unit/src/error/ExceptionTest.js",
                            lineNumber: 50,
                            functionName: "",
                            typeName: "Context",
                            methodName: "type",
                            columnNumber: 23,
                            native: false,
                            getFileName: function () {
                                return this.fileName;
                            },
                            getLineNumber: function () {
                                return this.lineNumber;
                            }
                        }, {
                            fileName: "/opt/dev/steeplejack/test/unit/src/error/ExceptionTest.js",
                            lineNumber: 60,
                            functionName: "",
                            typeName: null,
                            methodName: "type",
                            columnNumber: 23,
                            native: false,
                            getFileName: function () {
                                return this.fileName;
                            },
                            getLineNumber: function () {
                                return this.lineNumber;
                            }
                        }];
                    }
                };

                var Exception2 = proxyquire("../../../../src/error/Exception", {
                    "stack-trace": stackTrace
                });

                function Child() {

                    this.type = "Child";

                    Exception2.apply(this, arguments);

                    return this;

                }

                util.inherits(Child, Exception2);

                var obj = new Child("message");

                expect(obj).to.be.instanceof(Child)
                    .to.be.instanceof(Exception2)
                    .to.be.not.instanceof(Exception);

                expect(obj.stack).to.be.a("string");

            });

        });

    });

    describe("Extension tests", function () {

        it("should extend using the .extend method", function () {

            var Child = Exception.extend({

                type: "Child"

            });

            var obj = new Child("message");

            expect(obj.type).to.be.equal("Child");
            expect(obj.message).to.be.equal("message");
            expect(obj.stack).to.be.a("string").to.have.length.above("0");

            /* Ensure we're getting stacktrace from this file */
            expect(obj.stack).to.contain(__filename);

        });

        it("should extend a child using the .extend method", function () {

            var Parent = Exception.extend({

                type: "Parent"

            });

            var Child = Parent.extend({

                type: "Child"

            });

            var obj = new Child("message");

            expect(obj.type).to.be.equal("Child");
            expect(obj.message).to.be.equal("message");
            expect(obj.stack).to.be.a("string").to.have.length.above("0");

        });

        it("should extend the Exception class", function (done) {

            function Child() {

                this.type = "Child";

                Exception.apply(this, arguments);

                return this;

            }

            util.inherits(Child, Exception);

            var obj = new Child("message");

            expect(obj).to.be.instanceof(Child);
            expect(obj).to.be.instanceof(Exception);
            expect(obj).to.be.instanceof(Error);

            expect(obj.type).to.be.equal("Child");
            expect(obj.message).to.be.equal("message");
            expect(obj.stack).to.be.a("string").to.have.length.above("0");

            /* Ensure we're getting stacktrace from this file */
            expect(obj.stack).to.contain(__filename);

            done();

        });

        it("should throw an error if type not set", function (done) {

            function Child() {

                Exception.apply(this, arguments);

                return this;

            }

            util.inherits(Child, Exception);

            var fail = false;

            try {
                var obj = new Child("message");
            } catch (err) {
                fail = true;

                expect(err).to.be.instanceof(SyntaxError);
                expect(err.message).to.be.equal("Exception type must be set");
            }

            expect(fail).to.be.true;

            done();

        });

        it("should receive an error object as the message", function () {

            function Child() {

                this.type = "Child";

                Exception.apply(this, arguments);

                return this;

            }

            util.inherits(Child, Exception);

            var obj = new Child(new Error("message"));

            expect(obj).to.be.instanceof(Child);
            expect(obj).to.be.instanceof(Exception);
            expect(obj).to.be.instanceof(Error);

            expect(obj.type).to.be.equal("Child");
            expect(obj.message).to.be.equal("message");
            expect(obj.stack).to.be.a("string").to.have.length.above("0");

            /* Ensure we're getting stacktrace from this file */
            expect(obj.stack).to.contain(__filename);

        });

    });

    describe("Methods", function () {

        var Child;
        before(function () {
            Child = function () {

                this.type = "Child";

                Exception.apply(this, arguments);

                return this;

            };

            util.inherits(Child, Exception);
        });

        describe("#fileName", function () {

            it("should return this file name", function (done) {

                var obj = new Child("message");

                expect(obj).to.be.instanceof(Error);
                expect(obj).to.be.instanceof(Exception);
                expect(obj).to.be.instanceof(Child);

                /* This test is a bit flakey as set here, but hey ho */
                expect(obj.stack).to.contain(require("path").join(__dirname, "Exception.test.js"));

                done();

            });

        });

    });

});
