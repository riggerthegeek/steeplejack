/**
 * getFnName.test
 */

/// <reference path="../../../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect} from "../../helpers/configure";
import {
    getFnName
} from "../../../helpers/getFnName";


describe("#getFnName", function () {

    it("should build a public method name", function () {

        expect(getFnName("get", "method")).to.be.equal("getMethod");

    });

    it("should build a protected/private method name", function () {

        expect(getFnName("_get", "othermethod")).to.be.equal("_getOthermethod");

    });

});
