/**
 * registerSystemComponents.test
 */

/* Node modules */

/* Third-party modules */
import { Base, Exception, FatalException, ValidationException } from '@steeplejack/core';
import { Collection, Model } from '@steeplejack/data';

/* Files */
import { expect, sinon } from '../../helpers/configure';
import registerSystemComponent from '../../../src/helpers/registerSystemComponents';
import Logger from '../../../src/lib/logger';
import Plugin from '../../../src/lib/plugin';
import Router from '../../../src/lib/router';
import Server from '../../../src/lib/server';
import Socket from '../../../src/lib/socket';
import SocketRequest from '../../../src/lib/socketRequest';
import View from '../../../src/lib/view';

describe('registerSystemComponent tests', function () {

  it('should add injector, config and system components', function () {

    const app = sinon.spy();

    const injector = {
      registerComponent: sinon.stub(),
    };

    injector.registerComponent.returns(injector);

    const config = 'configObj';

    expect(registerSystemComponent(app, injector, config)).to.be.undefined;

    expect(injector.registerComponent).to.be.callCount(16)
      .calledWithExactly({
        name: '$steeplejack-app',
        instance: app,
      })
      .calledWithExactly({
        name: '$injector',
        instance: injector,
      })
      .calledWithExactly({
        name: '$config',
        instance: config,
      })
      .calledWithExactly({
        name: 'steeplejack-base',
        instance: Base,
      })
      .calledWithExactly({
        name: 'steeplejack-collection',
        instance: Collection,
      })
      .calledWithExactly({
        name: 'steeplejack-model',
        instance: Model,
      })
      .calledWithExactly({
        name: 'steeplejack-logger',
        instance: Logger,
      })
      .calledWithExactly({
        name: 'steeplejack-plugin',
        instance: Plugin,
      })
      .calledWithExactly({
        name: 'steeplejack-router',
        instance: Router,
      })
      .calledWithExactly({
        name: 'steeplejack-server',
        instance: Server,
      })
      .calledWithExactly({
        name: 'steeplejack-socket',
        instance: Socket,
      })
      .calledWithExactly({
        name: 'steeplejack-socketRequest',
        instance: SocketRequest,
      })
      .calledWithExactly({
        name: 'steeplejack-view',
        instance: View,
      })
      .calledWithExactly({
        name: 'steeplejack-exception',
        instance: Exception,
      })
      .calledWithExactly({
        name: 'steeplejack-fatal-exception',
        instance: FatalException,
      })
      .calledWithExactly({
        name: 'steeplejack-validation-exception',
        instance: ValidationException,
      });

  });

});
