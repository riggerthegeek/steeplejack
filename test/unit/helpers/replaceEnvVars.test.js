/**
 * replaceEnvVars.test
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';

/* Files */
import { expect } from '../../helpers/configure';
import replaceEnvVars from '../../../src/helpers/replaceEnvVars';

describe('replaceEnvVars test', function () {

  it('should ignore if no environment variables set', function () {

    const obj = {
      envvar1: 'ENVVAR1',
      child: {
        envvar2: 'ENVVAR2',
      },
    };

    expect(replaceEnvVars(obj)).to.be.eql({
      child: {},
    });

  });

  it('should replace with the environment variable if present', function () {

    const oldEnv = _.cloneDeep(process.env);

    process.env = {
      ENVVAR1: 'var1',
      ENVVAR2: 'var2',
      ENVVAR3: 'var3',
    };

    const obj = {
      envvar1: 'ENVVAR1',
      envvar4: 'ENVVAR4',
      child: {
        envvar2: 'ENVVAR2',
      },
    };

    expect(replaceEnvVars(obj)).to.be.eql({
      envvar1: 'var1',
      child: {
        envvar2: 'var2',
      },
    });

    process.env = oldEnv;

  });

  it('should pass in envvar value if begins with a $', function () {

    const oldEnv = _.cloneDeep(process.env);

    process.env = {
      ENVVAR1: 'var1',
      ENVVAR2: 'var2',
      ENVVAR3: 'var3',
      ENVVAR1_VALUE: '$ENVVAR1',
      ENVVAR2_VALUE: '$ENVVAR2',
      ENVVAR3_VALUE: '$ENVVAR3',
    };

    const obj = {
      envvar1: 'ENVVAR1_VALUE',
      envvar4: 'ENVVAR4_VALUE',
      child: {
        envvar2: 'ENVVAR2',
      },
    };

    expect(replaceEnvVars(obj)).to.be.eql({
      envvar1: 'var1',
      child: {
        envvar2: 'var2',
      },
    });

    process.env = oldEnv;

  });

});
