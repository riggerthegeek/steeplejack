/**
 * Server
 */

"use strict";


/* Node modules */


/* Third-party modules */
var chai = require("chai");
var sinon = require("sinon");

var Main = require("../../../../");

var Base = Main.Base;
var Server = Main.Server;


/* Files */


chai.use(require("sinon-chai"));
var expect = chai.expect;


describe("Server test", function () {

    describe("Instantiation tests", function () {

        it("should fire the _createServer method", function () {

            var serverInst = {};

            expect(Server.prototype._createServer).to.be.undefined;

            Server.prototype._createServer = sinon.stub()
                .returns(serverInst);

            var obj = new Server({
                port: 3000,
                certificate: "certificate",
                formatters: "formatters",
                handleUpgrades: "handleUpgrades",
                key: "key",
                logger: "logger",
                name: "name",
                spdy: "spdy",
                version: "version"
            });

            expect(obj).to.be.instanceof(Server)
                .to.be.instanceof(Base);

            expect(obj._createServer).to.be.calledOnce
                .calledWith({
                    certificate: "certificate",
                    formatters: "formatters",
                    handleUpgrades: "handleUpgrades",
                    key: "key",
                    logger: "logger",
                    name: "name",
                    spdy: "spdy",
                    version: "version"
                });

            expect(obj.getServer()).to.be.equal(serverInst);

        });

        it("should throw an error if port is not an integer", function () {

            [
                "string",
                function () { },
                2.3,
                new Date(),
                {},
                [],
                undefined,
                null,
                NaN,
                Infinity,
                true,
                false
            ].forEach(function (input) {

                var fail = false;

                try {
                    new Server({
                        port: input
                    });
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Server port must be set as an integer");
                } finally {
                    expect(fail).to.be.true;
                }

            })

        });

        it("should throw an error if the _createServer method returns a falsey value", function () {

            [
                null,
                undefined,
                0,
                false,
                "",
                NaN
            ].forEach(function (serverInst) {

                Server.prototype._createServer = sinon.stub()
                    .returns(serverInst);

                var fail = false;

                try {
                    new Server({
                        port: 3000,
                        certificate: "certificate",
                        formatters: "formatters",
                        handleUpgrades: "handleUpgrades",
                        key: "key",
                        logger: "logger",
                        name: "name",
                        spdy: "spdy",
                        version: "version"
                    });
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(SyntaxError);
                    expect(err.message).to.be.equal("Server._createServer must return the server instance");

                } finally {

                    expect(fail).to.be.true;

                    expect(Server.prototype._createServer).to.be.calledOnce
                        .calledWith({
                            certificate: "certificate",
                            formatters: "formatters",
                            handleUpgrades: "handleUpgrades",
                            key: "key",
                            logger: "logger",
                            name: "name",
                            spdy: "spdy",
                            version: "version"
                        });

                }

            });

        });

    });

    describe("#Methods", function () {

        var obj,
            serverInst;
        beforeEach(function () {

            serverInst = {};

            Server.prototype._createServer = sinon.stub()
                .returns(serverInst);

            obj = new Server({
                port: 3000
            });

            expect(obj).to.be.instanceof(Server)
                .to.be.instanceof(Base);

        });

        describe("#acceptParser", function () {

            beforeEach(function () {

                expect(obj._acceptParser).to.be.undefined;

                obj._acceptParser = sinon.spy();

            });

            it("should send to _acceptParser method", function () {

                expect(obj.acceptParser("options")).to.be.equal(obj);

                expect(obj._acceptParser).to.be.calledOnce
                    .calledWith("options");

            });

        });

        describe("#acceptParserStrict", function () {

            beforeEach(function () {

                expect(obj._acceptParserStrict).to.be.undefined;

                obj._acceptParserStrict = sinon.spy();

            });

            it("should send to _acceptParserStrict method", function () {

                expect(obj.acceptParserStrict("options")).to.be.equal(obj);

                expect(obj._acceptParserStrict).to.be.calledOnce
                    .calledWith("options");

            });

        });

        describe("#addRoute", function () {

            beforeEach(function () {
                expect(obj._addRoute).to.be.undefined;

                obj._addRoute = sinon.spy();
            });

            it("should throw an error if httpMethod not a string", function () {

                [
                    null,
                    false,
                    true,
                    new Date(),
                    function () { },
                    undefined
                ].forEach(function (input) {

                    var fail = false;

                    try {
                        obj.addRoute(input);
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("httpMethod must be a string");

                    } finally {

                        expect(fail).to.be.true;

                    }

                });

            });

            it("should throw an error if route not a string", function () {

                [
                    null,
                    false,
                    true,
                    new Date(),
                    function () { },
                    undefined
                ].forEach(function (route) {

                    var fail = false;

                    try {
                        obj.addRoute("get", route);
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("route must be a string");

                    } finally {

                        expect(fail).to.be.true;

                    }

                });

            });

            it("should throw an error if fn not a function or arry", function () {

                [
                    null,
                    false,
                    true,
                    new Date(),
                    2.3,
                    3,
                    undefined,
                    {}
                ].forEach(function (fn) {

                    var fail = false;

                    try {
                        obj.addRoute("get", "/route", fn);
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("fn must be a function or array");

                    } finally {

                        expect(fail).to.be.true;

                    }

                });

            });

            it("should allow a known HTTP method through", function () {

                [
                    "get",
                    "GET",
                    "post",
                    "POST",
                    "DEL",
                    "del",
                    "DELETE",
                    "delete",
                    "head",
                    "HEAD",
                    "patch",
                    "PATCH"
                ].forEach(function (method, i) {

                    var fn = function () {};

                    obj.addRoute(method, "/route", fn);

                    var httpMethod = method.toLowerCase();

                    if (httpMethod === "delete") {
                        httpMethod = "del";
                    }

                    expect(obj._addRoute).to.be.callCount(i + 1)
                        .calledWithExactly(httpMethod, "/route", fn);

                });

            });

            it("should throw an error if an unknown HTTP method", function () {

                var fail = false;

                try {
                    obj.addRoute("method", "/route", function () { });
                } catch (err) {
                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("httpMethod is unknown: method");
                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

        describe("#addRoutes", function () {

            beforeEach(function () {
                expect(obj._addRoute).to.be.undefined;

                obj._addRoute = sinon.spy();
            });

            it("should go through an objects of objects, passing to the _addRoute method", function () {

                var fn1 = function () {};
                var fn2 = function () {};
                var fn3 = function () {};
                var fn4 = function () {};

                var arr = [fn3, fn4];

                var routes = {
                    "/test": {
                        get: fn1,
                        post: fn2
                    },
                    "/test/example": {
                        delete: arr
                    }
                };

                obj.addRoutes(routes);

                expect(obj._addRoute).to.be.calledThrice
                    .calledWith("get", "/test", fn1)
                    .calledWith("post", "/test", fn2)
                    .calledWith("del", "/test/example", arr);

            });

            it("should throw an error if function not third argument", function () {

                var fn1 = function () { };
                var fn2 = function () { };

                var routes = {
                    "/test": {
                        get: fn1,
                        post: fn2
                    },
                    "/test/example": {
                        delete: false
                    }
                };

                var fail = false;

                try {
                    obj.addRoutes(routes);
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal("fn must be a function or array");

                } finally {

                    expect(fail).to.be.true;

                    expect(obj._addRoute).to.be.calledTwice
                        .calledWith("get", "/test", fn1)
                        .calledWith("post", "/test", fn2)

                }

            });

            it("should not parse an object of non-objects", function () {

                var routes = {
                    "/test1": function () {},
                    "/test2": [2],
                    "/test3": null,
                    "/test4": true,
                    "/test5": false,
                    "/test6": 2.3
                };

                obj.addRoutes(routes);

                expect(obj._addRoute).to.not.be.called;

            });

            it("should not pass a non-object", function () {

                var routes = [];

                obj.addRoutes(routes);

                expect(obj._addRoute).to.not.be.called;

            });

        });

        describe("#after", function () {

            beforeEach(function () {
                expect(obj._after).to.be.undefined;

                obj._after = sinon.spy();
            })

            it("should send through to the _after method", function () {

                var fn = function () { };

                expect(obj.after(fn)).to.be.equal(obj);

                expect(obj._after).to.be.calledOnce
                    .calledWith(fn);

            });

            it("should throw an error if a non-function received", function () {

                var fail = false;

                [
                    "string",
                    new Date(),
                    true,
                    false,
                    null,
                    [],
                    {},
                    2.3,
                    4
                ].forEach(function (input) {

                    try {
                        obj.after(input);
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(SyntaxError);
                        expect(err.message).to.be.equal("Server.after must receive a function");

                    } finally {

                        expect(fail).to.be.true;

                        expect(obj._after).to.not.be.called;

                    }

                });

            });

        });

        describe("#bodyParser", function () {

            beforeEach(function () {

                expect(obj._bodyParser).to.be.undefined;

                obj._bodyParser = sinon.spy();

            });

            it("should defer to the _bodyParser method", function () {

                expect(obj.bodyParser()).to.be.equal(obj);

                expect(obj._bodyParser).to.be.calledOnce;

            });

        });

        describe("#close", function () {

            beforeEach(function () {

                expect(obj._close).to.be.undefined;

                obj._close = sinon.spy();

            });

            it("should defer to the _close method", function () {

                expect(obj.close()).to.be.equal(obj);

                expect(obj._close).to.be.calledOnce;

            });

        });

        describe("#enableCORS", function () {

            beforeEach(function () {

                expect(obj._enableCORS).to.be.undefined;

                obj._enableCORS = sinon.spy();

            });

            it("should defer to the _enableClose method", function () {

                var origins = [
                    "http://example.com"
                ];
                var addHeaders = [
                    "auth"
                ];

                expect(obj.enableCORS(origins, addHeaders)).to.be.equal(obj);

                expect(obj._enableCORS).to.be.calledOnce
                    .calledWithExactly(origins, addHeaders);

            });

            it("should throw an error if non-array sent as origins", function () {

                [
                    null,
                    {},
                    new Date(),
                    "string",
                    true,
                    false,
                    undefined,
                    function () { },
                    2.3,
                    3,
                    NaN,
                    Infinity
                ].forEach(function (origins) {

                    var fail = false;
                    try {
                        expect(obj.enableCORS(origins)).to.be.equal(obj);
                    } catch (err) {
                        fail = true;
                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("CORS.origins can only receive an array");
                    } finally {

                        expect(obj._enableCORS).to.not.be.called;
                        expect(fail).to.be.true;

                    }

                });

            });

        });

        describe("#getBacklog", function () {

            it("should return a string as an integer", function () {

                var obj = new Server({
                    backlog: "510",
                    port: 3000
                });

                expect(obj.getBacklog()).to.be.equal(510);

            });

            it("should return an integer", function () {

                var obj = new Server({
                    backlog: 476,
                    port: 3000
                });

                expect(obj.getBacklog()).to.be.equal(476);

            });

            it("should return null", function () {

                var obj = new Server({
                    port: 3000
                });

                expect(obj.getBacklog()).to.be.null;

            });

        });

        describe("#getIP", function () {

            it("should return an IP address", function () {

                var obj = new Server({
                    ip: "192.168.254.1",
                    port: 3000
                });

                expect(obj.getIP()).to.be.equal("192.168.254.1");

            });

            it("should return null", function () {

                var obj = new Server({
                    port: 3000
                });

                expect(obj.getIP()).to.be.null;

            });

        });

        describe("#getPort", function () {

            it("should return port as an integer", function () {

                var obj = new Server({
                    port: "3000"
                });

                expect(obj.getPort()).to.be.equal(3000);

            });

            it("should return another port as an integer", function () {

                var obj = new Server({
                    port: 20034
                });

                expect(obj.getPort()).to.be.equal(20034);

            });

        });

        describe("#getServer", function () {

            it("should return the server instance", function () {

                expect(obj.getServer()).to.be.equal(serverInst);

            });

        });

        describe("#gzipResponse", function () {

            beforeEach(function () {

                expect(obj._gzipResponse).to.be.undefined;

                obj._gzipResponse = sinon.spy();

            });

            it("should defer to the _gzipResponse method", function () {

                expect(obj.gzipResponse()).to.be.equal(obj);

                expect(obj._gzipResponse).to.be.calledOnce
                    .calledWithExactly();

            });

        });

        describe("#outputHandler", function () {

            beforeEach(function () {

                expect(obj._outputHandler).to.be.undefined;

                obj._outputHandler = sinon.spy();

            });

            it("should defer to _outputHandler and call the callback", function () {

                var cb = sinon.spy();

                var err = {};
                var data = {};
                var req = {};
                var res = {};

                obj.outputHandler(err, data, req, res, cb);

                expect(obj._outputHandler).to.be.calledOnce
                    .calledWithExactly(err, data, req, res);

                expect(cb).to.be.calledOnce
                    .calledWithExactly();

            });

            it("should not call callback if it's not a function", function () {

                var err = {};
                var data = {};
                var req = {};
                var res = {};

                obj.outputHandler(err, data, req, res);

                expect(obj._outputHandler).to.be.calledOnce
                    .calledWithExactly(err, data, req, res);

            });

        });

        describe("#pre", function () {

            beforeEach(function () {

                expect(obj._pre).to.be.undefined;

                obj._pre = sinon.spy();

            });

            it("should defer to the _pre method", function () {

                var fn = function () { };

                expect(obj.pre(fn)).to.be.equal(obj);

                expect(obj._pre).to.be.calledOnce
                    .calledWithExactly(fn);

            });

            it("should throw error if non-function sent", function () {

                [
                    undefined,
                    null,
                    true,
                    false,
                    new Date(),
                    {},
                    [],
                    2.3,
                    "string",
                    3
                ].forEach(function (fn) {

                    var fail = false;

                    try {
                        obj.pre(fn);
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("Server.pre must receive a function");

                    } finally {

                        expect(fail).to.be.true;

                        expect(obj._pre).to.not.be.called;

                    }

                });

            });

        });

        describe("#start", function () {

            beforeEach(function () {

                expect(obj._start).to.be.undefined;

                obj._start = sinon.spy();

            });

            it("should defer to the _start method", function () {

                var fn = function () { };

                expect(obj.start(fn)).to.be.equal(obj);

                expect(obj._start).to.be.calledOnce
                    .calledWithExactly(obj.getPort(), obj.getIP(), obj.getBacklog(), fn);

            });

        });

        describe("#queryParser", function () {

            beforeEach(function () {

                expect(obj._queryParser).to.be.undefined;

                obj._queryParser = sinon.spy();

            });

            it("should defer to _queryParser with mapParams defaulting to false", function () {

                expect(obj.queryParser()).to.be.equal(obj);

                expect(obj._queryParser).to.be.calledOnce
                    .calledWithExactly(false);

            });

            it("should defer to _queryParser with mapParams sending true", function () {

                expect(obj.queryParser(true)).to.be.equal(obj);

                expect(obj._queryParser).to.be.calledOnce
                    .calledWithExactly(true);

            });

        });

        describe("#setBacklog", function () {

            beforeEach(function () {
                obj = new Server({
                    port: 4059
                });
            });

            it("should set an integer", function () {

                obj.setBacklog(3456);

                expect(obj.getBacklog()).to.be.equal(3456);

            });

            it("should set a string", function () {

                obj.setBacklog("3468");

                expect(obj.getBacklog()).to.be.equal(3468);

            });

            it("should ignore something else", function () {

                obj.setBacklog([]);

                expect(obj.getBacklog()).to.be.null;

            });

        });

        describe("#setIP", function () {

            beforeEach(function () {
                obj = new Server({
                    port: 4059
                });
            });

            it("should set a string", function () {

                obj.setIP("4.24.34.54");

                expect(obj.getIP()).to.be.equal("4.24.34.54");

            });

            it("ignore something else", function () {

                obj.setIP({});

                expect(obj.getIP()).to.be.equal(null);

            });

        });

        describe("#setPort", function () {

            beforeEach(function () {
                obj = new Server({
                    port: 4059
                });
            });

            it("should set an integer", function () {

                obj.setPort(3456);

                expect(obj.getPort()).to.be.equal(3456);

            });

            it("should set a string", function () {

                obj.setPort("3468");

                expect(obj.getPort()).to.be.equal(3468);

            });

            it("should ignore something else", function () {

                obj.setPort([]);

                expect(obj.getPort()).to.be.null;

            });

        });

        describe("#uncaughtException", function () {

            beforeEach(function () {

                expect(obj._uncaughtException).to.be.undefined;

                obj._uncaughtException = sinon.spy();

            });

            it("should defer to _uncaughtException", function () {

                var fn = function () { };

                expect(obj.uncaughtException(fn)).to.be.equal(obj);

                expect(obj._uncaughtException).to.be.calledOnce
                    .calledWithExactly(fn);

            });

            it("should throw an error when non-function sent", function () {

                [
                    undefined,
                    null,
                    true,
                    false,
                    new Date(),
                    {},
                    [],
                    2.3,
                    "string",
                    3
                ].forEach(function (fn) {

                    var fail = false;

                    try {

                        obj.uncaughtException(fn);

                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("Server.uncaughtException must receive a function");

                    } finally {

                        expect(fail).to.be.true;

                        expect(obj._uncaughtException).to.not.be.called;

                    }

                });

            });

        });

        describe("#use", function () {

            beforeEach(function () {

                expect(obj._use).to.be.undefined;

                obj._use = sinon.spy();

            });

            it("should do one function", function () {

                var fn = function () { };

                expect(obj.use(fn)).to.be.equal(obj);

                expect(obj._use).to.be.calledOnce
                    .calledWithExactly(fn);

            });

            it("should do an array of functions", function () {

                var fn1 = function () { };
                var fn2 = function () { };

                expect(obj.use([fn1, fn2])).to.be.equal(obj);

                expect(obj._use).to.be.calledTwice
                    .calledWithExactly(fn1)
                    .calledWithExactly(fn2);

            });

            it("should throw an error when a non-function sent", function () {

                [
                    {},
                    null,
                    undefined,
                    true,
                    false,
                    2.3,
                    4
                ].forEach(function (fn) {

                    var fail = false;

                    try {
                        obj.use(fn);
                    } catch (err) {

                        fail = true;

                        expect(err).to.be.instanceof(TypeError);
                        expect(err.message).to.be.equal("Server.use can only accept functions");

                    } finally {

                        expect(fail).to.be.true;

                        expect(obj._use).to.not.be.called;

                    }

                });

            });

        });

    });

});
