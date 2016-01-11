/**
 * exception.es5.test
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var Exception = require("../../../exception").Exception;
var expect = require("../../helpers/configure").expect;


describe("Exception ES5 test", function () {

    describe("Instantiation tests", function () {

        it("should throw an error if no type set", function () {

            var Child = Exception.extend();

            var fail = false;

            try {
                new Child();
            } catch (err) {
                fail = true;

                expect(err).to.be.instanceof(SyntaxError);
                expect(err.message).to.be.equal("Exception type must be set");
            } finally {
                expect(fail).to.be.true;
            }

        });

        it("should allow a type to be set as a getter", function () {

            var Child = Exception.extend({

                type: "SOME_TYPE"

            });

            var obj = new Child();

            expect(obj).to.be.instanceof(Child)
                .instanceof(Exception)
                .instanceof(Error);

            expect(obj.type).to.be.equal("SOME_TYPE");

        });

        it("should allow a type to be set in a construct", function () {

            var Child = Exception.extend({

                __construct: function () {
                    this.type = "OTHER_TYPE";
                }

            });

            var obj = new Child();

            expect(obj.message).to.be.equal("UNKNOWN_ERROR");

            expect(obj).to.be.instanceof(Child)
                .instanceof(Exception)
                .instanceof(Error);

            expect(obj.type).to.be.equal("OTHER_TYPE");

        });

        it("should receive the arguments in the __construct and set message", function () {

            var Child = Exception.extend({

                type: "type",

                __construct: function (message, arg1, arg2) {

                    this.arg1 = arg1;
                    this.arg2 = arg2;

                }

            });

            var obj = new Child("message", "arg1", "arg2");

            expect(obj.message).to.be.equal("message");
            expect(obj.arg1).to.be.equal("arg1");
            expect(obj.arg2).to.be.equal("arg2");


            expect(obj.stack).to.be.a("string")
                .to.contain(require.resolve("../../../exception"));

        });

        it("should receive an instance of error as message and use that for message and stack", function () {

            var Child = Exception.extend({

                type: "type"

            });

            var err = new Error("uh oh");

            var obj = new Child(err);

            expect(obj.message).to.be.equal("uh oh");

            expect(obj.stack).to.be.equal(err.stack);

        });

    });

});
