/**
 * steeplejack.test
 */

/* Node modules */

/* Third-party modules */

/* Files */
import { expect, proxyquire, sinon } from '../../helpers/configure';

describe('Steeplejack binary tests', function () {

  beforeEach(function () {
    this.yargs = {
      argv: 'argvResult',
      command: sinon.stub(),
      help: sinon.stub(),
      usage: sinon.stub(),
      version: sinon.stub(),
    };

    this.yargs.command.returns(this.yargs);
    this.yargs.help.returns(this.yargs);
    this.yargs.usage.returns(this.yargs);
    this.yargs.version.returns(this.yargs);
  });

  describe('#setup', function () {

    it('should load the package from one level up', function () {

      const pkg = {
        version: 'pkg-version',
      };

      const steeplejack = proxyquire('../../src/bin/steeplejack', {
        '../package': pkg,
        yargs: this.yargs,
      });

      expect(steeplejack).to.be.eql({
        default: 'argvResult',
      });

      expect(this.yargs.usage).to.be.calledOnce
        .calledWithExactly('$0 <cmd> [args]');

      expect(this.yargs.help).to.be.calledOnce
        .calledWithExactly();

      expect(this.yargs.command).to.be.calledOnce
        .calledWith('config <config> [env]', 'Display the config JSON for the current environment', {});

      expect(this.yargs.version).to.be.calledOnce;

      expect(this.yargs.version.args[0][0]()).to.be.equal('pkg-version');

    });

    it('should load the package from two levels up', function () {

      const pkg = {
        version: 'pkg-version-2',
      };

      const steeplejack = proxyquire('../../src/bin/steeplejack', {
        '../../package': pkg,
        yargs: this.yargs,
      });

      expect(steeplejack).to.be.eql({
        default: 'argvResult',
      });

      expect(this.yargs.usage).to.be.calledOnce
        .calledWithExactly('$0 <cmd> [args]');

      expect(this.yargs.help).to.be.calledOnce
        .calledWithExactly();

      expect(this.yargs.command).to.be.calledOnce
        .calledWith('config <config> [env]', 'Display the config JSON for the current environment', {});

      expect(this.yargs.version).to.be.calledOnce;

      expect(this.yargs.version.args[0][0]()).to.be.equal('pkg-version-2');

    });

  });

  describe('commands', function () {

    beforeEach(function () {

      const pkg = {
        version: 'pkg-version',
      };

      this.cliParams = sinon.stub();
      this.replaceEnvvars = sinon.stub();

      this.steeplejack = proxyquire('../../src/bin/steeplejack', {
        '../../package': pkg,
        '../helpers/cliParameters': this.cliParams,
        '../helpers/replaceEnvVars': this.replaceEnvvars,
        [`${process.cwd()}/configFile`]: {
          config: true,
        },
        [`${process.cwd()}/envvarFile`]: {
          envvar: true,
        },
        yargs: this.yargs,
      });

    });

    describe('#config', function () {

      beforeEach(function () {
        this.displayConfig = this.yargs.command.args[0][3];
      });

      it('should combine the config, envvars and args and output it', function () {

        this.cliParams.returns({
          cliArgs: true,
        });

        this.replaceEnvvars.returns({
          envvars: true,
        });

        const spy = sinon.stub(console, 'log');

        expect(this.displayConfig({
          config: 'configFile',
          env: 'envvarFile',
          _: [
            'ignored',
            'arg1',
            'arg2',
          ],
        })).to.be.undefined;

        expect(this.cliParams).to.be.calledOnce
          .calledWithExactly('arg1', 'arg2');

        expect(this.replaceEnvvars).to.be.calledOnce
          .calledWithExactly({
            envvar: true,
          });

        expect(spy).to.be.calledOnce
          .calledWithExactly(JSON.stringify({
            config: true,
            envvars: true,
            cliArgs: true,
          }, null, 2));

        spy.restore();

      });

      it('should only return the config if no envvars and args', function () {

        this.cliParams.returns({
          cliArgs: true,
        });

        this.replaceEnvvars.returns({
          envvars: true,
        });

        const spy = sinon.stub(console, 'log');

        expect(this.displayConfig({
          config: 'configFile',
          _: [
            'ignored',
          ],
        })).to.be.undefined;

        expect(this.cliParams).to.be.calledOnce
          .calledWithExactly();

        expect(this.replaceEnvvars).to.not.be.called;

        expect(spy).to.be.calledOnce
          .calledWithExactly(JSON.stringify({
            config: true,
            cliArgs: true,
          }, null, 2));

        spy.restore();

      });

      it('should throw an error if no config', function () {

        let fail = false;
        try {
          this.displayConfig({});
        } catch (err) {
          fail = true;

          expect(err).to.be.instanceof(Error);
          expect(err.message).to.be.equal('config file location is a required argument');
        } finally {
          expect(fail).to.be.true;
        }

      });

    });

  });

});
