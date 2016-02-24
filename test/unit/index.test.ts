/**
 * index.test
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect} from "../helpers/configure";
import * as index from "../../index";
import * as Steeplejack from "../../steeplejack";


describe("index test", function () {

    it("should be identical to the steeplejack file", function () {

        expect(index).to.be.equal(Steeplejack);

    });

});
