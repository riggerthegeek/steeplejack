/**
 * Validation
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var Base = rootRequire("src/library/Base");
var Validation = rootRequire("src/library/DomainModel/Validation");

var datautils = Base.datatypes;


describe("DomainModel Validation tests", function () {

    describe("Static methods", function () {

        describe("#generateFunction", function () {

            it("should return null if empty no object given", function (done) {

                expect(Validation.generateFunction()).to.be.null;

                done();

            });

            it("should return null if empty non object given", function (done) {

                expect(Validation.generateFunction(null)).to.be.null;
                expect(Validation.generateFunction("string")).to.be.null;
                expect(Validation.generateFunction(false)).to.be.null;

                done();

            });

        });

    });

});
