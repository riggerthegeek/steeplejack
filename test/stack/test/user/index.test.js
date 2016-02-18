/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */
var request = require("supertest-as-promised");


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
                .expect(200, {
                    id: 1,
                    firstName: "Test",
                    lastName: "Testington",
                    emailAddress: "test@test.com"
                });

        });

    });

    describe("POST", function () {

        it("should reject if no auth header", function () {

            return request(app.server.getServer())
                .post("/user")
                .expect(401);

        });

        it("should reject if invalid auth header", function () {

            return request(app.server.getServer())
                .post("/user")
                .set("Authorization", "bearer invalid")
                .expect(401);

        });

        it("should reject if no data", function () {

            return request(app.server.getServer())
                .post("/user")
                .set("Authorization", "bearer valid")
                .expect(400, {
                    code: "VALIDATION",
                    error: {
                        emailAddress: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        firstName: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }],
                        lastName: [{
                            message: "VALUE_REQUIRED",
                            value: null
                        }]
                    },
                    message: "Model validation error"
                });

        });

        it("should reject if invalid data", function () {

            return request(app.server.getServer())
                .post("/user")
                .set("Authorization", "bearer valid")
                .send({
                    firstName: "Jenson",
                    lastName: "Button",
                    emailAddress: "bademail.com"
                })
                .expect(400, {
                    code: "VALIDATION",
                    error: {
                        emailAddress: [{
                            message: "VALUE_NOT_EMAIL",
                            value: "bademail.com"
                        }]
                    },
                    message: "Model validation error"
                });

        });

        it("should create a new user", function () {

            return request(app.server.getServer())
                .post("/user")
                .set("Authorization", "bearer valid")
                .send({
                    firstName: "Jenson",
                    lastName: "Button",
                    emailAddress: "jenson@button.com"
                })
                .expect(200, {
                    id: 2,
                    firstName: "Jenson",
                    lastName: "Button",
                    emailAddress: "jenson@button.com"
                });

        });

    });

});
