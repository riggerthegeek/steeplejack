/**
 * cliParameters.test
 */

/* Node modules */

/* Third-party modules */

/* Files */
import { expect } from '../../helpers/configure';
import cliParameters from '../../../src/helpers/cliParameters';

describe('CLI Parameters test', function () {

  it('should receive no arguments', function () {

    const input = [
    ];

    const args = cliParameters(...input);

    expect(args).to.be.an('object');
    expect(args).to.be.eql({});
  });

  it('should receive some string arguments', function () {

    const input = [
      'this is a string',
      'another string',
    ];

    const args = cliParameters(...input);

    expect(args).to.be.an('object');
    expect(args).to.be.eql({
      'this is a string': true,
      'another string': true,
    });

  });

  it('should receive arguments with values', function () {

    const input = [
      'boolT=true',
      'boolF= false',
      'null = null',
      'int=235643',
      'float=2.543',
      'negInt=-235643',
      'negFloat=-2.543',
    ];

    const args = cliParameters(...input);

    expect(args).to.be.an('object');
    expect(args).to.be.eql({
      boolT: true,
      boolF: false,
      null: null,
      int: 235643,
      float: 2.543,
      negInt: -235643,
      negFloat: -2.543,
    });

  });

  it('should parse a string to an object', function () {

    const input = [
      'obj.boolF= false',
    ];

    const args = cliParameters(...input);

    expect(args).to.be.an('object');
    expect(args).to.be.eql({
      obj: {
        boolF: false,
      },
    });

  });

  it('should parse a string to an object and strings', function () {

    const input = [
      'obj.boolF= false',
      'obj.negInt=-235643',
    ];

    const args = cliParameters(...input);

    expect(args).to.be.an('object');
    expect(args).to.be.eql({
      obj: {
        boolF: false,
        negInt: -235643,
      },
    });

  });

  it('should parse a string to an object and strings', function () {

    const input = [
      'boolT=true',
      'obj.boolF= false',
      'null = null',
      'int=235643',
      'float=2.543',
      'obj.negInt=-235643',
      'negFloat=-2.543',
    ];

    const args = cliParameters(...input);

    expect(args).to.be.an('object');
    expect(args).to.be.eql({
      boolT: true,
      obj: {
        boolF: false,
        negInt: -235643,
      },
      null: null,
      int: 235643,
      float: 2.543,
      negFloat: -2.543,
    });

  });

  it('should parse a string to a multilayered object', function () {

    const input = [
      'boolT=true',
      'obj.boolF= false',
      'obj2.obj.null = null',
      'obj2.obj.int=235643',
      'obj2.obj2.float=2.543',
      'obj.negInt=-235643',
      'negFloat=-2.543',
    ];

    const args = cliParameters(...input);

    expect(args).to.be.an('object');
    expect(args).to.be.eql({
      boolT: true,
      obj: {
        boolF: false,
        negInt: -235643,
      },
      obj2: {
        obj: {
          null: null,
          int: 235643,
        },
        obj2: {
          float: 2.543,
        },
      },
      negFloat: -2.543,
    });

  });

  it('should ignore non-strings', function () {

    const input = [
            [],
            {},
      new Date(),
    ];

    const args = cliParameters(...input);

    expect(args).to.be.an('object');
    expect(args).to.be.eql({
    });

  });

});
