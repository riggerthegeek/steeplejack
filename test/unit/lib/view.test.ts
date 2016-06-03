/**
 * view.test
 */

/// <reference path="../../../typings/index.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect} from "../../helpers/configure";
import {Base} from "../../../lib/base";
import {View} from "../../../lib/view";


describe("view test", function () {

    describe("methods", function () {

        describe("#constructor", function () {

            it("should the template and data to the class", function () {

                const obj = new View({
                    template: "some template",
                    data: {
                        hello: "world"
                    }
                });

                expect(obj).to.be.instanceof(View)
                    .instanceof(Base);

                expect(obj.getRenderTemplate()).to.be.equal("some template");
                expect(obj.getRenderData()).to.be.eql({
                    hello: "world"
                });

            });

        });

    });

    describe("static methods", function () {

        describe("#render", function () {

            it("should return a new instance of the view with the template and data set", function () {

                const obj = View.render("a template", {
                    data: "value"
                });

                expect(obj).to.be.instanceof(View);

                expect(obj.getRenderTemplate()).to.be.equal("a template");
                expect(obj.getRenderData()).to.be.eql({
                    data: "value"
                });

            });

        });

    });

});
