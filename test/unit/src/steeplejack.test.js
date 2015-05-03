/**
 * steeplejack
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var Main = rootRequire();
var Base = rootRequire("/src/library/Base");
var pkg = rootRequire("package");


describe("Main test", function () {

    describe("Instantiation method", function () {

    });

    describe("Static methods", function () {

        describe("#Base", function () {

            it("should be the same as the Base object", function (done) {

                expect(Main.Base).to.be.equal(Base);

                done();

            });

        });

        describe("#Collection", function () {

            it("should be the same as the Collection object", function (done) {

                expect(Main.Collection).to.be.equal(require("../../../src/library/Collection"));

                done();

            });

        });

        describe("#Exceptions", function () {

            it("should present an object of exceptions", function (done) {

                var Exceptions = Main.Exceptions;

                expect(Exceptions.Exception).to.be.equal(require("../../../src/error/Exception"));
                expect(Exceptions.Fatal).to.be.equal(require("../../../src/error/Fatal"));
                expect(Exceptions.Validation).to.be.equal(require("../../../src/error/Validation"));

                done();

            });

        });

        describe("#Injector", function () {

            it("should present the Injector object", function () {

                expect(Main.Injector).to.be.equal(require("../../../src/library/Injector"));

            });

        });

        describe("#Model", function () {

            it("should be the same as the DomainModel object", function (done) {

                expect(Main.Model).to.be.equal(require("../../../src/library/DomainModel"));

                done();

            });

        });

        describe("#Router", function () {

            it("should be the same as the Router", function () {
                expect(Main.Router).to.be.equal(require("../../../src/library/Router"));
            });

        });

    });

});
