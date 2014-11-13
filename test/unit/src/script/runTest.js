var chai = require("chai");
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

var Run = require("../../../../src/script/").run;
var Main = require("../../../../");

var EventEmitter = require("events").EventEmitter;

var path = require("path");


describe("Run script test", function () {

    describe("#run", function () {

        var fnOut;
        beforeEach(function () {
            fnOut = function () {

            };
        });

        it("should receive no params", function (done) {

            var config = sinon.stub(Run, "loadConfigFilePath");
            var Target = sinon.stub(Run, "loadTargetFilePath");

            config.returns({
                key: "value",
                bool: false,
                number: 2
            });
            Target.returns(Main.Base.extend({
                _construct: function (config, cli) {
                    this.config = config;
                    this.cli = cli;
                }
            }));

            var obj = Run({
                params: null,
                configFile: "path/to/config",
                filePath:"path/to/target"
            }, fnOut);

            expect(obj).to.be.instanceof(Main.Base);

            expect(obj.config).to.be.eql({
                key: "value",
                bool: false,
                number: 2
            });
            expect(obj.cli).to.be.equal(fnOut);

            config.restore();
            Target.restore();

            done();

        });

        it("should receive overridden params", function (done) {

            var config = sinon.stub(Run, "loadFile");
            var Target = sinon.stub(Run, "loadTargetFilePath");

            config.returns({
                key: "value",
                bool: false,
                number: 2
            });
            Target.returns(Main.Base.extend({
                _construct: function (config, cli) {
                    this.config = config;
                    this.cli = cli;
                }
            }));

            var obj = Run({
                params: {
                    bool: true,
                    param: "key"
                },
                configFile: "path/to/config",
                filePath: "path/to/target"
            }, fnOut);

            expect(obj).to.be.instanceof(Main.Base);

            expect(obj.config).to.be.eql({
                key: "value",
                bool: true,
                param: "key",
                number: 2
            });
            expect(obj.cli).to.be.equal(fnOut);

            config.restore();
            Target.restore();

            done();

        });

        it("should listen for the config event", function (done) {

            var config = sinon.stub(Run, "loadFile");
            var Target = sinon.stub(Run, "loadTargetFilePath");

            var write = sinon.stub(console, "log");

            config.returns({
                key: "value",
                bool: false,
                number: 2
            });
            Target.returns(Main.Base.extend({
                _construct: function (config, cli) {
                    this.config = config;
                    this.cli = cli;
                }
            }));

            var obj = Run({
                params: {
                    bool: true,
                    param: "key"
                },
                configFile: "path/to/config",
                filePath: "path/to/target"
            }, fnOut);

            obj.emit("config", {
                hello: "world"
            });

            expect(write).to.have.been.called.calledWith([
                "--- CONFIG ---",
                "",
                JSON.stringify({hello: "world"}, null, 2),
                "--------------",
                ""
            ].join("\n"));

            write.restore();
            config.restore();
            Target.restore();

            done();

        });

        it("should listen for the kill event", function (done) {

            var config = sinon.stub(Run, "loadFile");
            var Target = sinon.stub(Run, "loadTargetFilePath");

            config.returns({
                key: "value",
                bool: false,
                number: 2
            });
            Target.returns(Main.Base.extend({
                _construct: function (config, cli) {
                    this.config = config;
                    this.cli = cli;
                }
            }));

            var obj = Run({
                params: {
                    bool: true,
                    param: "key"
                },
                configFile: "path/to/config",
                filePath: "path/to/target"
            }, fnOut);

            obj.on("close", function () {
                done();
            });

            obj.emit("kill");

            config.restore();
            Target.restore();


        });

        describe("env vars", function () {

            it("should load with an override file", function (done) {

                var loadFile = sinon.stub(Run, "loadFile");
                var Target = sinon.stub(Run, "loadTargetFilePath");

                process.env.ENV_BOOL = true;
                process.env.ENV_VALUE = "465";
                process.env.ENV_VAL = 7890;

                loadFile.withArgs("path/to/envvars").returns({
                    bool: "ENV_BOOL",
                    obj: {
                        value: "ENV_VALUE",
                        obj: {
                            val: "ENV_VAL",
                            notfound: "ENV_NOTFOUND"
                        }
                    }
                });

                loadFile.returns({
                    key: "value",
                    bool: false,
                    number: 2,
                    obj: {
                        value: "2",
                        obj: {
                            val: 3,
                            notfound: "ooops"
                        }
                    }
                });

                Target.returns(Main.Base.extend({
                    _construct: function (config, cli) {
                        this.config = config;
                        this.cli = cli;
                    }
                }));

                var obj = Run({
                    params: {
                    },
                    configFile: "path/to/config",
                    filePath: "path/to/target",
                    envvars: "path/to/envvars"
                }, fnOut);

                expect(obj).to.be.instanceof(Main.Base);

                expect(obj.config).to.be.eql({
                    key: "value",
                    bool: "true",
                    number: 2,
                    obj: {
                        value: "465",
                        obj: {
                            val: "7890",
                            notfound: "ooops"
                        }
                    }
                });
                expect(obj.cli).to.be.equal(fnOut);

                loadFile.restore();
                Target.restore();

                done();

            });

        });

    });

    describe("#loadConfigFilePath", function () {

        it("should load a valid config file", function (done) {

            expect(Run.loadConfigFilePath(path.join(__dirname + "/../../../sample/src/script/runConfig"))).to.be.eql({
                key: "value",
                bool: false,
                number: 2
            });

            done();

        });

        it("should load a valid config file and add params", function (done) {

            expect(Run.loadConfigFilePath(path.join(__dirname + "/../../../sample/src/script/runConfig"), {param: "key"})).to.be.eql({
                key: "value",
                bool: false,
                number: 2,
                param: "key"
            });

            done();

        });

        it("should load a valid config file and overwrite params", function (done) {

            expect(Run.loadConfigFilePath(path.join(__dirname + "/../../../sample/src/script/runConfig"), {bool: true, param: "key"})).to.be.eql({
                key: "value",
                bool: true,
                number: 2,
                param: "key"
            });

            done();

        });

        it("should throw error when no config file passed", function (done) {

            var fail = false;
            try {
                expect(Run.loadConfigFilePath(null));
            } catch (err) {
                fail = true;

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.equal("CONFIG_FILE_NOT_SET");
            }

            expect(fail).to.be.true;

            done();

        });

        it("should throw error if invalid file given", function (done) {

            var fail = false;
            try {
                expect(Run.loadConfigFilePath("some/nonexistent/file"));
            } catch (err) {
                fail = true;

                expect(err).to.be.instanceof(Error);
                expect(err.code).to.be.equal("MODULE_NOT_FOUND");
            }

            expect(fail).to.be.true;

            done();

        });

    });

    describe("#loadTargetFilePath", function () {

        it("should load a valid target file", function (done) {

            expect(Run.loadTargetFilePath(path.join(__dirname + "/../../../sample/src/script/Target"))).to.be.equal("target file");

            done();

        });

        it("should throw error if filepath is null", function (done) {

            var fail = false;

            try {
                Run.loadTargetFilePath(null);
            } catch (err) {
                fail = true;

                expect(err).to.be.instanceof(Error);
                expect(err.message).to.be.equal("MAIN_FILE_NOT_SET");
            }

            expect(fail).to.be.true;

            done();

        });

    });

    describe("#resolveFilePath", function () {

        it("should resolve an absolute Unix path", function (done) {

            expect(Run.resolveFilePath("/path/to/file/config.json")).to.be.equal("/path/to/file/config.json");

            done();

        });

        it("should resolve a relative path", function (done) {

            expect(Run.resolveFilePath("./path/to/file/config.json")).to.be.equal(path.resolve(process.cwd(), "./path/to/file/config.json"));

            done();

        });

        it("should resolve a relative path", function (done) {

            expect(Run.resolveFilePath("../../path/to/file/config.json")).to.be.equal(path.resolve(process.cwd(), "../../path/to/file/config.json"));

            done();

        });

        it("should ignore the path if given path is non-string", function (done) {

            expect(Run.resolveFilePath(null)).to.be.null;
            expect(Run.resolveFilePath(new Date())).to.be.null;
            expect(Run.resolveFilePath([])).to.be.null;
            expect(Run.resolveFilePath(undefined)).to.be.null;
            expect(Run.resolveFilePath({})).to.be.null;
            expect(Run.resolveFilePath(function () {
            })).to.be.null;

            done();

        });


    });

});
