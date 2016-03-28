/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */
var expect = require("chai").expect;
var io = require("socket.io-client");
var request = require("supertest");


/* Files */


describe("/user", function () {

    describe("GET", function () {

        it("should reject a user with no auth header", function (done) {

            request(app.server.getServer())
                .get("/user")
                .expect(401)
                .end(done);

        });

        it("should reject a user with an invalid auth header", function (done) {

            request(app.server.getServer())
                .get("/user")
                .set("Authorization", "bearer invalid")
                .expect(401)
                .end(done);

        });

        it("should get the user data", function (done) {

            request(app.server.getServer())
                .get("/user")
                .set("Authorization", "bearer valid")
                .expect(200, {
                    id: 1,
                    firstName: "Test",
                    lastName: "Testington",
                    emailAddress: "test@test.com"
                })
                .end(done);

        });

    });

    describe("POST", function () {

        it("should reject if no auth header", function (done) {

            request(app.server.getServer())
                .post("/user")
                .expect(401)
                .end(done);

        });

        it("should reject if invalid auth header", function (done) {

            request(app.server.getServer())
                .post("/user")
                .set("Authorization", "bearer invalid")
                .expect(401)
                .end(done);

        });

        it("should reject if no data", function (done) {

            request(app.server.getServer())
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
                })
                .end(done);

        });

        it("should reject if invalid data", function (done) {

            request(app.server.getServer())
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
                })
                .end(done);

        });

        it("should create a new user", function (done) {

            request(app.server.getServer())
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
                })
                .end(done);

        });

    });

    describe("SOCKET", function () {

        beforeEach(function () {

            var port = app.server._options.port;
            var socketUrl = "http://localhost:" + port + "/user";

            this.socket = io(socketUrl);

        });

        it("should connect to a socket and receive something back", function (done) {

            var self = this;

            self.socket.on("connect", function () {
                self.socket.emit("send", "arg1", "arg2", 3);
            });

            self.socket.on("receive", function (v1, v2, v3) {

                expect(arguments).to.have.length(3);

                expect(v1).to.be.equal("arg1");
                expect(v2).to.be.equal("arg2");
                expect(v3).to.be.equal(3);

                done();

            });

        });

    });

});
