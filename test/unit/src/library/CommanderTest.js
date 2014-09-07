var expect = require("chai").expect;
var Commander = require("../../../../src/library/Commander");

var EventEmitter = require("events").EventEmitter;


describe("Commander library", function () {

    describe("#usageMinusWildcard", function () {

        it("should check that it exists", function (done) {

            var oldExit = process.exit;

            /* Override the process.exit */
            process.exit = function () {
                /* Put it back */
                process.exit = oldExit;
                done();
            };

            expect(Commander.usageMinusWildcard).to.be.a("function");

            Commander.usageMinusWildcard();

        });

    });

    describe("#versionInformation", function () {

        it("should receive a version event", function (done) {

            expect(Commander).to.be.instanceof(EventEmitter);

            Commander.on("version", function () {
                done();
            });

            /* Emit the event */
            Commander.versionInformation();

        });

    });

});
