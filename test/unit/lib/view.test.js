/**
 * view.test
 */

/* Node modules */

/* Third-party modules */
import { Base } from '@steeplejack/core';

/* Files */
import {expect} from "../../helpers/configure";
import View from "../../../src/lib/view";

describe("view test", function () {

    describe("methods", function () {

        describe("#constructor", function () {

          it('should set the default values if nothing sent in the constructor', function () {

            const obj = new View();

            expect(obj).to.be.instanceof(View)
              .instanceof(Base);

            expect(obj.getRenderTemplate()).to.be.null;
            expect(obj.getRenderData()).to.be.eql({});
            expect(obj.getHeaders()).to.be.eql({});
            expect(obj.getStatusCode()).to.be.null;

          });

            it("should set the template and data to the class", function () {

                const obj = new View({
                    headers: {
                        head1: "val1",
                        head2: "val2"
                    },
                    statusCode: 401,
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
                expect(obj.getHeaders()).to.be.eql({
                    head1: "val1",
                    head2: "val2"
                });
                expect(obj.getStatusCode()).to.be.equal(401);

            });

        });

    });

    describe("static methods", function () {

        describe("#render", function () {

            it("should return a new instance of the view with the template and data set - default values", function () {

                const obj = View.render("a template", {
                    data: "value"
                });

                expect(obj).to.be.instanceof(View);

                expect(obj.getRenderTemplate()).to.be.equal("a template");
                expect(obj.getRenderData()).to.be.eql({
                    data: "value"
                });
                expect(obj.getHeaders()).to.be.eql({});
                expect(obj.getStatusCode()).to.be.null;

            });

            it("should return a new instance of the view with the template and data set - set values", function () {

                const obj = View.render("a template", {
                    data: "value"
                }, 302, {
                    "content-type": "application/json"
                });

                expect(obj).to.be.instanceof(View);

                expect(obj.getRenderTemplate()).to.be.equal("a template");
                expect(obj.getRenderData()).to.be.eql({
                    data: "value"
                });
                expect(obj.getHeaders()).to.be.eql({
                    "content-type": "application/json"
                });
                expect(obj.getStatusCode()).to.be.equal(302);

            });

        });

    });

});
