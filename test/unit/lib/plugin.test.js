/**
 * Plugin.test
 */

/* Node modules */

/* Third-party modules */
import { Base } from '@steeplejack/core';

/* Files */
import { expect } from '../../helpers/configure';
import Plugin from '../../../src/lib/plugin';

describe('Plugin test', function () {

  describe('Methods', function () {

    describe('#constructor', function () {

      it('should extend the Base method and set no plugins by default', function () {

        const obj = new Plugin();

        expect(obj).to.be.instanceof(Plugin)
          .to.be.instanceof(Base);

        expect(obj.modules).to.be.eql([]);

      });

      it('should set a single file string on instantiation', function () {

        const obj = new Plugin('singlefile');

        expect(obj.modules).to.be.eql([
          'singlefile',
        ]);

      });

      it('should set a single function on instantiation', () => {

        const func = () => { };

        const obj = new Plugin(func);

        expect(obj.modules).to.be.eql([
          func,
        ]);

      });

      it('should set an array of files on instantiation', () => {

        const func = () => { };

        const obj = new Plugin([
          'singlefile2',
          func,
          null,
          undefined,
        ]);

        expect(obj.modules).to.be.eql([
          'singlefile2',
          func,
        ]);

      });

    });

  });

});
