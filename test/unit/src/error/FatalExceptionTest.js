var expect = require("chai").expect;
var Base = require("../../../../src/library/Base");
var Exception = require("../../../../src/error/Exception");
var FatalException = require("../../../../src/Main").Exceptions.Fatal;


describe("FatalException test", function () {

    describe("Instantiation tests", function () {

        it("should extend the Exception and Error classes", function (done) {

            var obj = new FatalException("message");

            expect(obj).to.be.instanceof(FatalException);
            expect(obj).to.be.instanceof(Exception);
            expect(obj).to.be.instanceof(Error);

            expect(obj.getType()).to.be.equal("Fatal").to.be.equal(obj.type);
            expect(obj.getMessage()).to.be.equal("message").to.be.equal(obj.message);
            expect(obj.getStack()).to.be.a("string").to.have.length.above("0").to.be.equal(obj.stack);
            expect(obj.getStackTrace()).to.be.an("array");
            expect(obj.getStackTrace(1)).to.be.an("object");
            expect(obj.getStackTrace(2)).to.be.equal(obj.getStackTrace()[2]);
            expect(obj.getLineNumber()).to.be.a("number").to.be.equal(13);
            expect(obj.getFileName()).to.be.equal(require("path").join(__dirname, "FatalExceptionTest.js"));

            done();

        });


    });

});
