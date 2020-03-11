let io = require('socket.io-client');
let waterHeaterFunctions = require('./Waterheater.js');

socket = io.connect("http://localhost:3000/device", {
    reconnection: true,
});



socket.on('connect', function () {
    console.log('connected to localhost:3000');

    socket.on('getDeviceInfo', function(){
        getDeviceInfo(socket);
    })


});

function getDeviceInfo(socket){

    object = waterHeaterFunctions.getDeviceObject();

    socket.emit('newDeviceInfo', object);
    console.log('DeviceInfo send to server');
}
