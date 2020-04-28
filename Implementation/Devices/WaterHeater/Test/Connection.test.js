const assert = require('assert');
const waterHeater = require('./../App.js');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

http.listen(3001, function() {
  console.log('Server started!');
});

const deviceSpace = io.of('/device');
deviceSpace.on('connection', function(socket) {
    console.log('Device connected to localhost:3001');
    socket.emit('askForId');
    socket.on('receiveDeviceId', function(Id) {
    console.log("Current id: " + Id);
    });

    socket.on('newDeviceWithId', function(deviceInfo) {
        console.log(deviceInfo);
    });

    socket.on('stateChanged', function(state, Id) {
        console.log(state);
        console.log(Id);
    });

    socket.on('deviceUpdate', function(device){
        console.log(device);
    });

});
