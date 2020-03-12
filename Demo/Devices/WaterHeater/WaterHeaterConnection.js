let io = require('socket.io-client');
let waterHeaterFunctions = require('./WaterHeaterFunctions.js');
const state = {
  OFF: 0,
  KEEP_TEMP: 1,
  ON: 2,
}

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

  socket.on('updateInfo', function(command, device) {
    console.log("Received command: " + command);
    console.log(device);
    socket.emit('updateInformation', command, waterHeaterFunctions.getDeviceObject(device));
  })

  socket.on('command', function(command, info) {
    commandHandler(command, info, socket);
  })
});

function commandHandler(command, info, socket) {
  console.log("Device ID: " + waterHeaterFunctions.getDeviceObject().id + " Received command: " + command);
  switch (command) {
    case "turnOn":
      waterHeaterFunctions.updateState(state.ON);
      break;
    case "turnOff":
      waterHeaterFunctions.updateState(state.OFF);
      break;
    case "keepTemp":
      waterHeaterFunctions.updateState(state.KEEP_TEMP)
      break;
    default:

  }
}

function getDeviceInfo(socket) {

  object = waterHeaterFunctions.getDeviceObject();

  socket.emit('newDeviceInfo', object);
  console.log('DeviceInfo send to server');
}