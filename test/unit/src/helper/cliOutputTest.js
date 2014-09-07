var expect = require("chai").expect;
var sinon = require("sinon");
var CliOutput = require("../../../../src/helper/cliOutput");


describe("CLI Output test", function () {

    var stub;
    var stubError;
    var processExit;
    beforeEach(function () {
        var reportback = CliOutput.reportback();

        stub = reportback.log.info = sinon.stub(reportback.log, "info");
        stubError = reportback.log.error = sinon.stub(reportback.log, "error");

        CliOutput.reportback = function () {
            return reportback;
        };

        processExit = process.exit;
    });

    afterEach(function () {
        stub.restore();
        stubError.restore();
        process.exit = processExit;
    });

    describe("Success", function () {

        it("should use the default success function", function (done) {

            var cb = CliOutput();

            cb(null, "Hello");

            expect(stub.calledWith("Hello")).to.be.true;

            done();

        });

        it("should use the specified success function", function (done) {

            var cb = CliOutput(function (message) {
                return message + " world!";
            });

            cb(null, "Hello");

            expect(stub.calledWith("Hello world!")).to.be.true;

            done();

        });

        it("should throw an error if it returns a non-string", function (done) {

            var cb = CliOutput(function (message) {
                return new Date();
            });

            var fail = false;

            try {
                cb(null, "Hello");
            } catch (err) {
                fail = true;

                expect(err).to.be.instanceof(TypeError);
                expect(err.message).to.be.equal("Success output must be a string");
            }

            done();

        });

    });

    describe("Error", function () {

        beforeEach(function () {
            process.exit = function (code) {
                expect(code).to.be.equal(1);
            };
        });

        it("should return an error stack", function (done) {

            var cb = CliOutput();

            var err = new Error("This is an error");

            cb(err);

            expect(stubError.calledWith(err.stack)).to.be.true;

            done();

        });

        it("should return an error message", function (done) {

            var cb = CliOutput();

            cb("Some string");

            expect(stubError.calledWith("Some string")).to.be.true;

            done();

        });

    });

});
