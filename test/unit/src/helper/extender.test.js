/**
 * extender.test
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var extender = rootRequire("src/helper/extender");


describe("extender test", function () {


    it("should extend an object with no methods or static methods", function () {

        function Obj (param) {
            this.param = param;
        }

        Obj.extend = extender;

        var Child = Obj.extend();

        expect(Child.super_).to.be.equal(Obj);

        var input = {};

        var obj = new Child(input);

        expect(obj.param).to.be.equal(input);

        expect(obj).to.be.have.keys([
            "param"
        ]);
        expect(Child).to.have.keys([
            "extend",
            "super_"
        ]);

    });

    it("should extend an object with some methods and static methods", function () {

        function Obj (param) {
            this.param = param;
        }

        Obj.extend = extender;

        var Child1 = Obj.extend({
            method1: "foo",
            method2: "bar"
        }, {
            static1: "foo",
            static2: "bar"
        });

        expect(Child1.super_).to.be.equal(Obj);

        var input = {};

        var obj = new Child1(input);

        expect(obj.param).to.be.equal(input);
        expect(obj.method1).to.be.equal("foo");
        expect(obj.method2).to.be.equal("bar");

        expect(Child1.static1).to.be.equal("foo");
        expect(Child1.static2).to.be.equal("bar");

        expect(obj).to.be.have.keys([
            "param"
        ]);
        expect(Child1).to.have.keys([
            "extend",
            "super_",
            "static1",
            "static2"
        ]);

    });


});
