var expect = require("chai").expect;
var Base = require("../../../../../src/library/Base");

var datautils = Base.datatypes;

var Definition = require("../../../../../src/library/DomainModel/Definition");


describe("DomainModel Definition tests", function () {

    describe("Methods", function () {

        describe("#addValidation", function () {

            it("should not add a non-object", function (done) {

                var obj = new Definition();
                expect(obj.addValidation()).to.be.undefined;

                done();

            });

        });

    });

});
