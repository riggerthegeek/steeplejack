/**
 * Base.test
 */

"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */


/* Files */
import {Base} from "../../../lib/Base";
import {expect} from "../../helpers/configure";


describe("Base class", function () {

    describe("Methods", function () {

        describe("#constructor", function () {

            it("should call the _construct function when set", function () {

                let called = false;
                Base.prototype._construct = function (...args: any[]) {

                    called = true;

                    expect(args).to.be.an("array")
                        .to.have.length(6);

                    expect(args[0]).to.be.equal("string");
                    expect(args[1]).to.be.equal(23);
                    expect(args[2]).to.be.true;
                    expect(args[3]).to.be.eql([]);
                    expect(args[4]).to.be.eql({});
                    expect(args[5]).to.be.a("function");

                };

                let obj = new Base("string", 23, true, [], {}, function () {});

                expect(obj).to.be.instanceof(Base)
                    .to.be.instanceof(EventEmitter);

                expect(called).to.be.true;

            });

        });

    });

});
