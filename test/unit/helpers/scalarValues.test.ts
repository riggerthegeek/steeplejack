/**
 * scalarValues.test
 */

/// <reference path="../../../typings/index.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect} from "../../helpers/configure";
import {
    scalarValues
} from "../../../helpers/scalarValues";


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
