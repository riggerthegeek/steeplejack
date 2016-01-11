/**
 * fatal.test
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {FatalException} from "../../../exception/fatal";
import {Exception} from "../../../exception/index";
import {expect} from "../../helpers/configure";


describe("FatalException test", () => {

    describe("Instantiation tests", () => {

        it("should extend the Exception and Error classes", () => {

            var obj = new FatalException("message");

            expect(obj).to.be.instanceof(FatalException)
                .to.be.instanceof(Exception)
                .to.be.instanceof(Error);

            expect(obj.type).to.be.equal("FATAL");
            expect(obj.message).to.be.equal("message");
            expect(obj.stack).to.be.a("string").to.have.length.above(0);

        });

    });

});
