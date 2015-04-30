var expect = require("chai").expect;
var cliParams = require("../../../../src/helper/cliParameters");


describe("CLI Parameters test", function () {

    it("should receive no arguments", function (done) {

        var input = [
        ];

        var args = cliParams.apply(this, input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({});

        done();

    });

    it("should receive some string arguments", function (done) {

        var input = [
            "this is a string",
            "another string"
        ];

        var args = cliParams.apply(this, input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({
            "this is a string": true,
            "another string": true
        });

        done();

    });

    it("should receive arguments with values", function (done) {

        var input = [
            "boolT=true",
            "boolF= false",
            "null = null",
            "int=235643",
            "float=2.543",
            "negInt=-235643",
            "negFloat=-2.543",
        ];

        var args = cliParams.apply(this, input);

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

        done();

    });

    it("should parse a string to an object", function (done) {

        var input = [
            "obj.boolF= false"
        ];

        var args = cliParams.apply(this, input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({
            obj: {
                boolF: false
            }
        });

        done();

    });

    it("should parse a string to an object and strings", function (done) {

        var input = [
            "obj.boolF= false",
            "obj.negInt=-235643"
        ];

        var args = cliParams.apply(this, input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({
            obj: {
                boolF: false,
                negInt: -235643
            }
        });

        done();

    });

    it("should parse a string to an object and strings", function (done) {

        var input = [
            "boolT=true",
            "obj.boolF= false",
            "null = null",
            "int=235643",
            "float=2.543",
            "obj.negInt=-235643",
            "negFloat=-2.543"
        ];

        var args = cliParams.apply(this, input);

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

        done();

    });

    it("should parse a string to a multilayered object", function (done) {

        var input = [
            "boolT=true",
            "obj.boolF= false",
            "obj2.obj.null = null",
            "obj2.obj.int=235643",
            "obj2.obj2.float=2.543",
            "obj.negInt=-235643",
            "negFloat=-2.543"
        ];

        var args = cliParams.apply(this, input);

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

        done();

    });

    it("should ignore non-strings", function (done) {

        var input = [
            [],
            {},
            new Date()
        ];

        var args = cliParams.apply(this, input);

        expect(args).to.be.an("object");
        expect(args).to.be.eql({
        });

        done();

    });

});
