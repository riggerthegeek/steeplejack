/**
 * Plugin.test
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var Main = rootRequire();

var Base = Main.Base;
var Plugin = Main.Plugin;


describe("Plugin tests", function () {

    describe("Instantiation", function () {

        it("should extend the Base method and set no plugins by default", function () {

            var obj = new Plugin;

            expect(obj).to.be.instanceof(Plugin)
                .to.be.instanceof(Base);

            expect(obj.getModules()).to.be.eql([]);

        });

        it("should set a single file string on instantiation", function () {

            var obj = new Plugin("singlefile");

            expect(obj.getModules()).to.be.eql([
                "singlefile"
            ]);

        });

        it("should set a single function on instantiation", function () {

            var func = function () { };

            var obj = new Plugin(func);

            expect(obj.getModules()).to.be.eql([
                func
            ]);

        });

        it("should set an array of files on instantiation", function () {

            var func = function () { };

            var obj = new Plugin([
                "singlefile2",
                func,
                null,
                undefined
            ]);

            expect(obj.getModules()).to.be.eql([
                "singlefile2",
                func
            ]);

        });

    });

});
