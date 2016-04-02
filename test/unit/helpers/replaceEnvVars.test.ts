/**
 * replaceEnvVars.test
 */

/// <reference path="../../../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {expect, sinon} from "../../helpers/configure";
import {replaceEnvVars} from "../../../helpers/replaceEnvVars";


describe("replaceEnvVars test", function () {

    it("should ignore if no environment variables set", function () {

        var obj = {
            envvar1: "ENVVAR1",
            child: {
                envvar2: "ENVVAR2"
            }
        };

        expect(replaceEnvVars(obj)).to.be.eql({
            child: {}
        });

    });

    it("should replace with the environment variable if present", function () {

        var stub = sinon.sandbox.create().stub(process, "env", {
            "ENVVAR1": "var1",
            "ENVVAR2": "var2",
            "ENVVAR3": "var3"
        });

        var obj = {
            envvar1: "ENVVAR1",
            envvar4: "ENVVAR4",
            child: {
                envvar2: "ENVVAR2"
            }
        };

        expect(replaceEnvVars(obj)).to.be.eql({
            envvar1: "var1",
            child: {
                envvar2: "var2"
            }
        });

        stub.restore();

    });

});
