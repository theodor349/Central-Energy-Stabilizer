
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
    
    setTimeout(() => {
        testSetId(socket);
    }, 1000);
});

function testSetId (socket) {
    let Id = 112233;
    socket.emit("setId", Id);
} 