var chai = require("chai");
var expect = chai.expect;
var Exception = require("../../../../src/Main").Exceptions.Exception;
var util = require("util");
var proxyquire = require("proxyquire");
var sinon = require("sinon");

chai.use(require("sinon-chai"));


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
                            fileName: '/opt/dev/steeplejack/test/unit/src/error/ExceptionTest.js',
                            lineNumber: 40,
                            functionName: 'Context.it.type',
                            typeName: 'Context',
                            methodName: 'it.type',
                            columnNumber: 23,
                            native: false,
                            getFileName: function () {
                                return this.fileName;
                            },
                            getLineNumber: function () {
                                return this.lineNumber;
                            }
                        }, {
                            fileName: '/opt/dev/steeplejack/test/unit/src/error/ExceptionTest.js',
                            lineNumber: 50,
                            functionName: '',
                            typeName: 'Context',
                            methodName: 'type',
                            columnNumber: 23,
                            native: false,
                            getFileName: function () {
                                return this.fileName;
                            },
                            getLineNumber: function () {
                                return this.lineNumber;
                            }
                        }, {
                            fileName: '/opt/dev/steeplejack/test/unit/src/error/ExceptionTest.js',
                            lineNumber: 60,
                            functionName: '',
                            typeName: null,
                            methodName: 'type',
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

            expect(obj.getType()).to.be.equal("Child").to.be.equal(obj.type);
            expect(obj.getMessage()).to.be.equal("message").to.be.equal(obj.message);
            expect(obj.getStack()).to.be.a("string").to.have.length.above("0").to.be.equal(obj.stack);

            /* Ensure we're getting stacktrace from this file */
            expect(obj.getFileName()).to.be.equal(__filename);

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

            expect(obj.getType()).to.be.equal("Child").to.be.equal(obj.type);
            expect(obj.getMessage()).to.be.equal("message").to.be.equal(obj.message);
            expect(obj.getStack()).to.be.a("string").to.have.length.above("0").to.be.equal(obj.stack);

            /* Ensure we're getting stacktrace from this file */
            expect(obj.getFileName()).to.be.equal(__filename);

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
                expect(obj.getFileName()).to.be.equal(require("path").join(__dirname, "ExceptionTest.js"));

                done();

            });

        });

        describe("#lineNumber", function () {

            /**
             * These tests are a little dodgy as we have to
             * specify the line number manually.  If we ever
             * add more tests above, this will make these
             * tests fail.
             */

            it("should return the called line number", function () {

                var obj = new Child("message");

                expect(obj).to.be.instanceof(Error);
                expect(obj).to.be.instanceof(Exception);
                expect(obj).to.be.instanceof(Child);

                expect(obj.getLineNumber()).to.be.a("number").to.be.equal(255);

            });

            it("should return the line number of where an error object is created not the Exception", function () {

                var err = new Error("message");

                var obj = new Child(err);

                expect(obj).to.be.instanceof(Error);
                expect(obj).to.be.instanceof(Exception);
                expect(obj).to.be.instanceof(Child);

                expect(obj.getLineNumber()).to.be.a("number").to.be.equal(267);

            });

        });

        describe("#getStackTrace", function () {

            it("should return an array when id left empty", function (done) {

                var obj = new Child("message");

                expect(obj.getStackTrace()).to.be.an("array");

                done();

            });

            it("should return an object when id given", function (done) {

                var obj = new Child("message");

                expect(obj.getStackTrace(2)).to.be.an("object").to.not.be.null;

                done();

            });

            it("should return an null when id given and nothing set", function (done) {

                var obj = new Child("message");

                var length = obj.getStackTrace().length;

                expect(obj.getStackTrace(length + 1)).to.be.null;

                done();

            });

        });

    });

});
