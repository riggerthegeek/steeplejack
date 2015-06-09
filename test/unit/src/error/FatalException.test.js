/**
 * Fatal Exception
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var Base = rootRequire("src/library/Base");
var Exception = rootRequire("src/error/Exception");
var FatalException = rootRequire().Exceptions.Fatal;


describe("FatalException test", function () {

    describe("Instantiation tests", function () {

        it("should extend the Exception and Error classes", function () {

            var obj = new FatalException("message");

            expect(obj).to.be.instanceof(FatalException);
            expect(obj).to.be.instanceof(Exception);
            expect(obj).to.be.instanceof(Error);

            expect(obj.type).to.be.equal("Fatal");
            expect(obj.message).to.be.equal("message");
            expect(obj.stack).to.be.a("string").to.have.length.above("0");

        });


    });

});
