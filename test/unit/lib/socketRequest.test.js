/**
 * socketRequest.test
 */

/* Node modules */

/* Third-party modules */
import { Base } from '@steeplejack/core';

/* Files */
import { expect, sinon } from '../../helpers/configure';
import SocketRequest from '../../../src/lib/socketRequest';

describe('socketRequest test', function () {

  beforeEach(function () {

    this.strategy = {
      broadcast: sinon.spy(),
      connect: sinon.spy(),
      createSocket: sinon.spy(),
      disconnect: sinon.spy(),
      getSocketId: sinon.stub(),
      joinChannel: sinon.spy(),
      leaveChannel: sinon.spy(),
      listen: sinon.spy(),
    };

    this.socket = {
      my: 'socket',
    };

    this.obj = new SocketRequest(this.socket, this.strategy);

    expect(this.obj).to.be.instanceof(SocketRequest)
            .instanceof(Base);

    expect(this.obj.socket).to.be.equal(this.socket);
    expect(this.obj.strategy).to.be.equal(this.strategy);

  });

  describe('methods', function () {

    describe('#constructor', function () {

      it('should set the socket and strategy to the class', function () {

        expect(this.obj.params).to.be.eql([]);

        this.obj.params = [
          'hello',
        ];

        expect(this.obj.params).to.be.eql([
          'hello',
        ]);

      });

    });

    describe('#broadcast', function () {

      it('should emit a broadcast event', function (done) {

        this.obj.on('broadcast', (broadcast) => {

          try {

            expect(broadcast).to.be.eql({
              event: 'myEvent',
              data: [
                'this',
                'is',
                'some data',
              ],
              target: {
                hello: 'world',
              },
            });

            done();

          } catch (err) {
            done(err);
          }

        });

        expect(this.obj.broadcast({
          event: 'myEvent',
          data: [
            'this',
            'is',
            'some data',
          ],
          target: {
            hello: 'world',
          },
        })).to.be.equal(this.obj);

      });

    });

    describe('#disconnect', function () {

      it("should dispatch to the strategy's disconnect method", function () {

        expect(this.obj.disconnect()).to.be.undefined;

        expect(this.strategy.disconnect).to.be.calledOnce
                    .calledWithExactly(this.obj.socket);

      });

    });

    describe('#getId', function () {

      it('should get the ID from the strategy', function () {

        this.strategy.getSocketId.returns('1234567890');

        expect(this.obj.getId()).to.be.equal('1234567890');

        expect(this.strategy.getSocketId).to.be.calledOnce
                    .calledWithExactly(this.obj.socket);

      });

    });

    describe('#joinChannel', function () {

      it("should call the strategy's joinChannel method", function () {

        expect(this.obj.joinChannel('some channel')).to.be.equal(this.obj);

        expect(this.strategy.joinChannel).to.be.calledOnce
                    .calledWithExactly(this.socket, 'some channel');

      });

    });

    describe('#leaveChannel', function () {

      it("should call the strategy's leaveChannel method", function () {

        expect(this.obj.leaveChannel('some other channel')).to.be.equal(this.obj);

        expect(this.strategy.leaveChannel).to.be.calledOnce
                    .calledWithExactly(this.socket, 'some other channel');

      });

    });

  });

});
