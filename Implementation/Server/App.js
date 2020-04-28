
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

http.listen(3000, function() {
  console.log('Server started!');
});

const deviceSpace = io.of('/device');
deviceSpace.on('connection', function(socket) {
    console.log('Device connected to localhost:3000');
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

    setTimeout(() => {
        testSetId(socket);
    }, 1000);

    socket.on('deviceUpdate', function(device){
            console.log(device);
    });

});

function testSetId (socket) {
    let Id = 112233;
    socket.emit("setId", Id);
}

function testChangeStateOn (socket) {
    socket.emit("on");
}

function testChangeStateOff (socket) {
    socket.emit("off");
}
