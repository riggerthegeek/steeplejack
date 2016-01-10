/**
 * Plugin.test
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect} from "../../helpers/configure";
import {Base} from "../../../lib/Base";
import {Plugin} from "../../../lib/Plugin";


describe("Plugin test", function () {

    describe("Methods", function () {

        describe("#constructor", function () {

            it("should extend the Base method and set no plugins by default", function () {

                let obj = new Plugin();

                expect(obj).to.be.instanceof(Plugin)
                    .to.be.instanceof(Base);

                expect(obj.modules).to.be.eql([]);

            });

            it("should set a single file string on instantiation", function () {

                let obj = new Plugin("singlefile");

                expect(obj.modules).to.be.eql([
                    "singlefile"
                ]);

            });

            it("should set a single function on instantiation", () => {

                let func = () => { };

                let obj = new Plugin(func);

                expect(obj.modules).to.be.eql([
                    func
                ]);

            });

            it("should set an array of files on instantiation", () => {

                let func = () => { };

                let obj = new Plugin([
                    "singlefile2",
                    func,
                    null,
                    undefined
                ]);

                expect(obj.modules).to.be.eql([
                    "singlefile2",
                    func
                ]);

            });

        });

    });

});
