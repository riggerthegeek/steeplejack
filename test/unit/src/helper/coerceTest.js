/**
 * coerceTest
 */

"use strict";


/* Node modules */


/* Third-party modules */
var expect = require("chai").expect;


/* Files */
var coerce = require("../../../../src/helper/coerce");


describe("coerce test", function () {

    it("should typecast integers", function () {

        for (var i = 1; i <= 100000; i++) {
            expect(coerce(String(i))).to.be.equal(i);
        }

    });

    it("should typecast negative integers", function () {

        for (var i = -1; i >= -100000; i--) {
            expect(coerce(String(i))).to.be.equal(i);
        }

    });

    it("should typecast zero", function () {
        expect(coerce("0")).to.be.equal(0);
    });

    it("should typecast floats", function () {

        expect(coerce("0.03")).to.be.equal(.03);
        expect(coerce("1.03")).to.be.equal(1.03);
        expect(coerce("3.623438")).to.be.equal(3.623438);

    });

    it("should typecast negative floats", function () {

        expect(coerce("-2.405301")).to.be.equal(-2.405301);

    });

    it("should typecast a boolean", function () {

        expect(coerce("true")).to.be.true;
        expect(coerce("false")).to.be.false;

    });

    it("should typecast a null", function () {

        expect(coerce("null")).to.be.null;

    });

    it("should put everything else as a string", function () {

        expect(coerce("tru")).to.be.equal("tru");
        expect(coerce("t")).to.be.equal("t");
        expect(coerce("f")).to.be.equal("f");
        expect(coerce("1.203980493454f")).to.be.equal("1.203980493454f");

    });

});
