/**
 * injector
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';
import { Base } from '@steeplejack/core';

/* Files */

/**
 * Construct
 *
 * Factory method to create a new instance of
 * the constructor.
 *
 * @param {object} constructor
 * @param {*[]} args
 * @return {Factory}
 */
const construct = (constructor, args) => {
  function Factory () {
    return constructor.apply(this, args);
  }

  Factory.prototype = constructor.prototype;

  return new Factory();
};

class Injector extends Base {

  constructor () {
    super();

    this.components = {};
  }

  /**
   * Get Component
   *
   * Get the components by name
   *
   * @param {string} name
   * @returns {object}
   */
  getComponent (name) {
    if (_.has(this.components, name)) {
      return this.components[name];
    }
  }

  getDependencies (dependencies) {
    return dependencies.map((name) => {
      const dependency = this.getComponent(name);

      if (!dependency) {
        throw new Error(`Missing dependency: ${name}`);
      }

      /* If instance hasn't already been processed, process it */
      if (!dependency.instance) {
        dependency.instance = this.process(dependency.factory);
      }

      return dependency.instance;
    });
  }

  process (target, dependencies = []) {
    const resolvedDeps = this.getDependencies(dependencies);

    return construct(target, resolvedDeps);
  }

  register (filePath) {

    const isRequirable = _.isString(filePath);

    // eslint-disable-next-line import/no-dynamic-require, global-require
    const module = isRequirable ? require(filePath) : filePath;
    const path = isRequirable ? filePath : undefined;

    const inject = module.inject || {};
    const exportable = inject.export || 'default';
    const type = inject.type || 'factory';
    const deps = inject.deps;
    const injectable = module[exportable];

    return this.registerComponent({
      deps,
      factory: type === 'factory' ? injectable : undefined,
      instance: type === 'instance' ? injectable : undefined,
      name: inject.name,
      path,
    });
  }

  registerComponent (inject) {
    // @todo - check everything in correct format

    /* Register with the components object */
    this.components[inject.name] = {
      deps: inject.deps || [],
      factory: inject.factory,
      instance: inject.instance,
      path: inject.path
    };

    return this;
  }

}

module.exports = Injector;
