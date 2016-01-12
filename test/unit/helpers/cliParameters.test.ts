/**
 * cliParameters.test
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect} from "../../helpers/configure";
import {cliParameters} from "../../../helpers/cliParameters";


describe("CLI Parameters test", function () {

    it("should receive no arguments", function () {

        var input: any[] = [
        ];

        var args = cliParameters(...input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({});
    });

    it("should receive some string arguments", function () {

        var input: any[] = [
            "this is a string",
            "another string"
        ];

        var args = cliParameters(...input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({
            "this is a string": true,
            "another string": true
        });

    });

    it("should receive arguments with values", function () {

        var input: any[] = [
            "boolT=true",
            "boolF= false",
            "null = null",
            "int=235643",
            "float=2.543",
            "negInt=-235643",
            "negFloat=-2.543",
        ];

        var args = cliParameters(...input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({
            boolT: true,
            boolF: false,
            null: null,
            int: 235643,
            float: 2.543,
            negInt: -235643,
            negFloat: -2.543
        });

    });

    it("should parse a string to an object", function () {

        var input: any[] = [
            "obj.boolF= false"
        ];

        var args = cliParameters(...input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({
            obj: {
                boolF: false
            }
        });

    });

    it("should parse a string to an object and strings", function () {

        var input: any[] = [
            "obj.boolF= false",
            "obj.negInt=-235643"
        ];

        var args = cliParameters(...input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({
            obj: {
                boolF: false,
                negInt: -235643
            }
        });

    });

    it("should parse a string to an object and strings", function () {

        var input: any[] = [
            "boolT=true",
            "obj.boolF= false",
            "null = null",
            "int=235643",
            "float=2.543",
            "obj.negInt=-235643",
            "negFloat=-2.543"
        ];

        var args = cliParameters(...input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({
            boolT: true,
            obj: {
                boolF: false,
                negInt: -235643
            },
            null: null,
            int: 235643,
            float: 2.543,
            negFloat: -2.543
        });

    });

    it("should parse a string to a multilayered object", function () {

        var input: any[] = [
            "boolT=true",
            "obj.boolF= false",
            "obj2.obj.null = null",
            "obj2.obj.int=235643",
            "obj2.obj2.float=2.543",
            "obj.negInt=-235643",
            "negFloat=-2.543"
        ];

        var args = cliParameters(...input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({
            boolT: true,
            obj: {
                boolF: false,
                negInt: -235643
            },
            obj2: {
                obj: {
                    null: null,
                    int: 235643
                },
                obj2: {
                    float: 2.543
                }
            },
            negFloat: -2.543
        });

    });

    it("should ignore non-strings", function () {

        var input: any[] = [
            [],
            {},
            new Date()
        ];

        var args = cliParameters(...input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({
        });

    });

});
