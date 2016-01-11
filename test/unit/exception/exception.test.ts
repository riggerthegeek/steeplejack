/**
 * exception.test
 */

/// <reference path="../../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Exception} from "../../../exception";
import {expect} from "../../helpers/configure";


describe("Exception test", function () {

    describe("Instantiation tests", function () {

        it("should throw an error if no type set", function () {

            class Child extends Exception { }

            let fail = false;

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

            class Child extends Exception {

                get type () {
                    return "SOME_TYPE";
                }

            }

            let obj = new Child();

            expect(obj.message).to.be.equal("UNKNOWN_ERROR");

            expect(obj).to.be.instanceof(Child)
                .instanceof(Exception)
                .instanceof(Error);

            expect(obj.type).to.be.equal("SOME_TYPE");

        });

        it("should receive the arguments in the constructor and set message", function () {

            class Child extends Exception {

                get type () {
                    return "type";
                }

                arg1: string;

                arg2: string;

                constructor (message: any, ...args: any[]) {

                    super(message);

                    this.arg1 = args[0];
                    this.arg2 = args[1];

                }

            }

            let obj = new Child("message", "arg1", "arg2");

            expect(obj.message).to.be.equal("message");
            expect(obj.arg1).to.be.equal("arg1");
            expect(obj.arg2).to.be.equal("arg2");

            expect(obj.stack).to.be.a("string")
                .to.contain(require.resolve("../../../exception"));

        });

        it("should receive an instance of error as message and use that for message and stack", function () {

            class Child extends Exception {

                get type () {
                    return "type";
                }

            }

            let err = new Error("uh oh");

            let obj = new Child(err);

            expect(obj.message).to.be.equal("uh oh");

            expect(obj.stack).to.be.equal(err.stack);

        });

    });

});
