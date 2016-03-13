/**
 * validation.rule.test
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var config = require("../../helpers/configure");
var _Validation = require("../../../lib/validation");

var expect = config.expect;
var sinon = config.sinon;
var Validation = _Validation.Validation;


describe("validation rule test", function () {

    let stub;
    beforeEach(function () {
        stub = sinon.stub(Validation, "createClosure");
    });

    afterEach(function () {
        stub.restore();
    });

    it("should throw an error if the rule is not a function or a string", function () {

        [
            {},
            [],
            null,
            true,
            2
        ].forEach(function (rule) {

            let fail = false;

            try {
                Validation.generateFunction({
                    rule
                });
            } catch (err) {

                fail = true;

                var message = "IDefinitionValidation.rule must be a function or a string, not a " + typeof rule;

                expect(err).to.be.instanceof(TypeError);
                expect(err.message).to.be.equal(message);

            } finally {
                expect(fail).to.be.true;

                expect(stub).to.not.be.called;
            }

        });

    });

});
