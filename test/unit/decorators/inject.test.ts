/**
 * inject
 */

/// <reference path="../../../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Inject, injectFlag} from "../../../decorators/inject";
import {expect} from "../../helpers/configure";


describe("Inject decorator test", function () {

    describe("factory = false", function () {

        it("should decorate a class with no constructor dependencies", function () {

            expect(injectFlag).to.be.equal("__INJECT__");

            @Inject({
                name: "injectName"
            })
            class Test {
            }

            expect((<any>Test)[injectFlag]).to.be.eql({
                name: "injectName",
                deps: [],
                factory: false
            });

        });

        it("should decorate a class with no deps in inject and ignoring constructor dependencies", function () {

            @Inject({
                name: "injectName2",
                deps: []
            })
            class Test {
                constructor(hello:any) {
                }
            }

            expect((<any>Test)[injectFlag]).to.be.eql({
                name: "injectName2",
                deps: [],
                factory: false
            });

        });

        it("should decorate a class with some constructor dependencies", function () {

            @Inject({
                name: "otherName"
            })
            class Test {
                constructor(protected hello:any, goodbye:any) {
                }
            }

            expect((<any>Test)[injectFlag]).to.be.eql({
                name: "otherName",
                deps: [
                    "hello",
                    "goodbye"
                ],
                factory: false
            });

        });

        it("should decorate a class with deps in inject and ignoring constructor dependencies", function () {

            @Inject({
                name: "otherName",
                deps: [
                    "$hello",
                    "$goodbye"
                ]
            })
            class Test {
                constructor(protected hello:any, goodbye:any) {
                }
            }

            expect((<any>Test)[injectFlag]).to.be.eql({
                name: "otherName",
                deps: [
                    "$hello",
                    "$goodbye"
                ],
                factory: false
            });

        });

    });

    describe("factory = true", function () {

        it("should decorate a class with no constructor dependencies", function () {

            expect(injectFlag).to.be.equal("__INJECT__");

            @Inject({
                name: "injectName",
                factory: true
            })
            class Test {
            }

            expect((<any>Test)[injectFlag]).to.be.eql({
                name: "injectName",
                deps: [],
                factory: true
            });

        });

        it("should decorate a class with no deps in inject and ignoring constructor dependencies", function () {

            @Inject({
                name: "injectName2",
                deps: [],
                factory: true
            })
            class Test {
                constructor(hello:any) {
                }
            }

            expect((<any>Test)[injectFlag]).to.be.eql({
                name: "injectName2",
                deps: [],
                factory: true
            });

        });

        it("should decorate a class and ignore constructor dependencies", function () {

            @Inject({
                name: "otherName",
                factory: true
            })
            class Test {
                constructor(protected hello:any, goodbye:any) {
                }
            }

            expect((<any>Test)[injectFlag]).to.be.eql({
                name: "otherName",
                deps: [
                ],
                factory: true
            });

        });

        it("should decorate a class with deps in inject and ignoring constructor dependencies", function () {

            @Inject({
                name: "otherName",
                deps: [
                    "$hello",
                    "$goodbye"
                ],
                factory: true
            })
            class Test {
                constructor(protected hello:any, goodbye:any) {
                }
            }

            expect((<any>Test)[injectFlag]).to.be.eql({
                name: "otherName",
                deps: [
                    "$hello",
                    "$goodbye"
                ],
                factory: true
            });

        });

    });

});
