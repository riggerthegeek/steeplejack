/**
 * dataCasting.test
 */

/// <reference path="../../../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect} from "../../helpers/configure";
import {
    dataCasting
} from "../../../helpers/dataCasting";


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
