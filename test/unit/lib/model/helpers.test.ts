/**
 * helpers.test
 */

/// <reference path="../../../../typings/tsd.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect} from "../../../helpers/configure";
import {
    dataCasting,
    getFnName,
    scalarValues
} from "../../../../lib/model/helpers";


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

    describe("#scalarValues", function () {

        it("should return the original value if not an object", function () {

            [
                null,
                true,
                false,
                void 0,
                "string",
                2.3
            ].forEach(function (value) {

                expect(scalarValues(value)).to.be.equal(value);

            });

        });

        it("should stringify a Date instance", function () {

            let date = new Date;

            expect(scalarValues(date)).to.be.equal(date.toISOString());

        });

        it("should stringify an object", function () {

            let obj = {
                hello: "world"
            };

            expect(scalarValues(obj)).to.be.equal(JSON.stringify(obj));

        });

        it("should stringify an array", function () {

            let arr = [
                "hello",
                "world"
            ];

            expect(scalarValues(arr)).to.be.equal(JSON.stringify(arr));

        });

    });

});
