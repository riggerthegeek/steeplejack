/**
 * socket
 */

/* Node modules */

/* Third-party modules */
const io = require('socket.io-client');

/* Files */

const socketUrl = 'http://localhost:3000/user';

const socket = io(socketUrl);

console.log({
  socketUrl
});

socket.on('connect', () => {
  console.log(`${Date.now()} connect`);
  socket.emit('send', 'arg1', 'arg2', 3);
});

socket.on('receive', (...args) => {

  console.log(`${Date.now()} receive`);
  const [v1, v2, v3] = args;

  console.log(args);

});
