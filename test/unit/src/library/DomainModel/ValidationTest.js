var expect = require("chai").expect;
var Base = require("../../../../../src/library/Base");

var datautils = Base.datatypes;

var Validation = require("../../../../../src/library/DomainModel/Validation");


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
