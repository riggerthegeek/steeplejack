/**
 * fatal.test
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Fatal} from "../../../exception/fatal";
import {Exception} from "../../../exception";
import {expect} from "../../helpers/configure";


describe("FatalException test", () => {

    describe("Instantiation tests", () => {

        it("should extend the Exception and Error classes", () => {

            var obj = new Fatal("message");

            expect(obj).to.be.instanceof(Fatal)
                .to.be.instanceof(Exception)
                .to.be.instanceof(Error);

            expect(obj.type).to.be.equal("FATAL");
            expect(obj.message).to.be.equal("message");
            expect(obj.stack).to.be.a("string").to.have.length.above(0);

        });

    });

});
