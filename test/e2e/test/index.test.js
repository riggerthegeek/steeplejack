/**
 * index.test
 */

/* Node modules */

/* Third-party modules */
const io = require('socket.io-client');

/* Files */
const { config, request, expect } = require('../../helpers/e2e');

describe('e2e tests', function () {

  describe('404 tests', function () {

    it('should return a 404 on a missing page', function () {

      return request
        .get('/some-non-existent-endpoint')
        .expect(404);

    });

  });

  describe("/user", function () {

    describe("/empty", function () {

      describe("GET", function () {

        it("should return a 204 status", function () {

          return request
            .get("/user/empty")
            .expect(204);

        });

      });

    });

    describe("GET", function () {

      it("should reject a user with no auth header", function () {

        return request
          .get("/user")
          .expect(401);

      });

      it("should reject a user with an invalid auth header", function () {

        return request
          .get("/user")
          .set("Authorization", "bearer invalid")
          .expect(401);

      });

      it("should get the user data", function () {

        return request
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

        return request
          .post("/user")
          .expect(401);

      });

      it("should reject if invalid auth header", function () {

        return request
          .post("/user")
          .set("Authorization", "bearer invalid")
          .expect(401);

      });

      it("should reject if no data", function () {

        return request
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

        return request
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

        return request
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

    describe("SOCKET", function () {

      beforeEach(function () {

        this.port = config.instance.server.port;

      });

      it("should connect to a socket and receive something back", function (done) {

        const socketUrl = `http://localhost:${this.port}/user`;

        const socket = io(socketUrl);

        socket.on("connect", () => {
          socket.emit("send", "arg1", "arg2", 3);
        });

        socket.on("receive", (...args) => {

          const [ v1, v2, v3 ] = args;

          expect(args).to.have.length(3);

          expect(v1).to.be.equal("arg1");
          expect(v2).to.be.equal("arg2");
          expect(v3).to.be.equal(3);

          done();

        });

      });

      it("should disconnect from the socket", function (done) {

        const socketUrl = `http://localhost:${this.port}/disconnection`;

        const socket = io(socketUrl);

        let hasConnected = false;

        socket.on("connect", () => {
          hasConnected = true;
        });

        socket.on("disconnect", () => {
          expect(hasConnected).to.be.true;

          done();
        });

      });

    });

  });

});
