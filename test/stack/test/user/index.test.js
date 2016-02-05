/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */
var request = require("supertest");


/* Files */


describe("/user", function () {

    describe("GET", function () {

        it("should reject a user with no auth header", function () {

            return request(app.server.getServer())
                .get("/user")
                .expect(401);

        });

        it("should reject a user with an invalid auth header", function () {

            return request(app.server.getServer())
                .get("/user")
                .set("Authorization", "bearer invalid")
                .expect(401);

        });

        it("should get the user data", function () {

            return request(app.server.getServer())
                .get("/user")
                .set("Authorization", "bearer valid")
                .expect(200, "3354");

        });

    });

});
