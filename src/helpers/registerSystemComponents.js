/**
 * registerSystemComponents
 *
 * This registers Steeplejack components to the
 * injector to make life (and testing) easier in
 * production.
 */

/* Node modules */

/* Third-party modules */
import { Base } from '@steeplejack/core';
import { Collection, Model } from '@steeplejack/data';

/* Files */
import Logger from '../lib/logger';
import Plugin from '../lib/plugin';
import Router from '../lib/router';
import Server from '../lib/server';
import Socket from '../lib/socket';
import SocketRequest from '../lib/socketRequest';
import View from '../lib/view';

export default (app, injector, config) => {
  /* Register the instance stuff */
  injector
    .registerComponent({
      name: '$steeplejack-app',
      instance: app,
    })
    .registerComponent({
      name: '$injector',
      instance: injector,
    })
    .registerComponent({
      name: '$config',
      instance: config,
    });

  /* Register Steeplejack dependencies */
  injector
    .registerComponent({
      name: 'steeplejack-base',
      instance: Base,
    })
    .registerComponent({
      name: 'steeplejack-collection',
      instance: Collection,
    })
    .registerComponent({
      name: 'steeplejack-model',
      instance: Model,
    })
    .registerComponent({
      name: 'steeplejack-logger',
      instance: Logger,
    })
    .registerComponent({
      name: 'steeplejack-plugin',
      instance: Plugin,
    })
    .registerComponent({
      name: 'steeplejack-router',
      instance: Router,
    })
    .registerComponent({
      name: 'steeplejack-server',
      instance: Server,
    })
    .registerComponent({
      name: 'steeplejack-socket',
      instance: Socket,
    })
    .registerComponent({
      name: 'steeplejack-socketRequest',
      instance: SocketRequest,
    })
    .registerComponent({
      name: 'steeplejack-view',
      instance: View,
    });
};
