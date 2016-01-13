/**
 * Base.test
 */

"use strict";


/* Node modules */
import {EventEmitter} from "events";


/* Third-party modules */
import {data as datatypes} from "datautils";


/* Files */
import {Base} from "../../../lib/base";
import {expect} from "../../helpers/configure";


describe("Base class", function () {

    describe("Methods", function () {

        describe("#clone", function () {

            it("should clone the Base method and remain an instance", () => {

                let obj = new Base();

                let clone = obj.clone();

                expect(clone).to.be.an.instanceof(Base)
                    .to.be.an.instanceof(EventEmitter)
                    .to.not.be.equal(obj);

            });

            it("should clone an extended Base method and remain an instance", () => {

                class Model extends Base {

                    values: any;

                    get constant () {
                        return 23;
                    }

                    constructor (obj: any) {
                        super();

                        this.values = {};

                        for (var key in obj) {
                            this.setValue(key, obj[key]);
                        }
                    }

                    _hidden () {
                        return "hello";
                    }

                    getValues () {
                        return this.values;
                    }

                    setValue (key: any, value: any) {
                        this.values[key] = value;
                        return true;
                    }

                }

                var obj = new Model({
                    key1: "val1"
                });

                var clone = obj.clone();

                expect(clone).to.be.an.instanceof(Model)
                    .to.be.an.instanceof(Base)
                    .to.be.an.instanceof(EventEmitter)
                    .to.be.not.equal(obj);

                expect(clone.constant).to.be.equal(23);
                expect(clone.values).to.be.eql({
                    key1: "val1"
                });
                expect(clone.values).to.be.eql(obj.values)
                    .to.not.be.equal(obj.values);
                expect(clone.getValues()).to.be.eql(obj.getValues())
                    .to.not.be.equal(obj.getValues());
                expect(clone.setValue).to.be.equal(obj.setValue);
                expect(clone._hidden).to.be.equal(obj._hidden);
                expect(clone._hidden()).to.be.equal(obj._hidden());

                clone.setValue("key2", "val2");
                expect(obj.values).to.be.eql({
                    key1: "val1"
                });
                expect(clone.values).to.be.eql({
                    key1: "val1",
                    key2: "val2"
                });

                /* Changing the values entirely now */
                expect(clone.getValues()).to.not.be.eql(obj.getValues());

            });

        });

    });

    describe("Static methods", function () {

        describe("datatypes", function () {

            it("should expose the datautils.data object", function () {

                expect(Base.datatypes).to.be.equal(datatypes);

            });

        });

    });

});
