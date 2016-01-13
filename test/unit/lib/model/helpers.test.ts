/**
 * helpers.test
 */

/// <reference path="../../../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect} from "../../../helpers/configure";
import {dataCasting, getFnName} from "../../../../lib/model/helpers";


describe("Model helpers", function () {

    describe("#dataCasting", function () {

        it("should map the types to the datatypes method name", function () {

            expect(dataCasting).to.be.eql({
                array: "setArray",
                boolean: "setBool",
                date: "setDate",
                float: "setFloat",
                integer: "setInt",
                object: "setObject",
                string: "setString"
            });

        });

    });

    describe("#getFnName", function () {

        it("should build a public method name", function () {

            expect(getFnName("get", "method")).to.be.equal("getMethod");

        });

        it("should build a protected/private method name", function () {

            expect(getFnName("_get", "othermethod")).to.be.equal("_getOthermethod");

        });

    });

});
