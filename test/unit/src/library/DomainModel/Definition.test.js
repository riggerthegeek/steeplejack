/**
 * Definition
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var Base = rootRequire("src/library/Base");
var Definition = rootRequire("src/library/DomainModel/Definition");

var datautils = Base.datatypes;


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
