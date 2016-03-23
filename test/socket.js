/**
 * socket
 */

"use strict";


/* Node modules */


/* Third-party modules */
var io = require("socket.io-client");


/* Files */



var socket = io("http://localhost:3003/user");

socket.on("connect", function () {

    console.log("connected");

    socket.emit("chat", "you", "utter", "twat");

});

socket.on("chat", function () {

    console.log("chat");

});
