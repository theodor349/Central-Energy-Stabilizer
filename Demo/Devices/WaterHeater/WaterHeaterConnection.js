let io = require('socket.io-client');
let waterHeaterFunctions = require('./Waterheater.js');

socket = io.connect("http://localhost:3000/device", {
  reconnection: true,
});



socket.on('connect', function() {
  console.log('connected to localhost:3000');

  socket.on('getDeviceInfo', function() {
    getDeviceInfo(socket);
  });

  socket.on('setId', function(id) {
    waterHeaterFunctions.setId(id)
    socket.emit('idSet', waterHeaterFunctions.getDeviceObject());
  });

  socket.on('updateInfo', function(command) {
    console.log("Device ID: " + waterHeaterFunctions.getDeviceObject().id + " Received command: " + command);
    socket.emit('updateInformation', waterHeaterFunctions.getDeviceObject(), command);
  })

});

function getDeviceInfo(socket) {

  object = waterHeaterFunctions.getDeviceObject();

  socket.emit('newDeviceInfo', object);
  console.log('DeviceInfo send to server');
}