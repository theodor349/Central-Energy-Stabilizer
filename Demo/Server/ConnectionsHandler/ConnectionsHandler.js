let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let appData = require('../Core/DeviceStorage.js')
let deviceManager = require('./../DeviceManager/DeviceManager.js');

console.log(__dirname + '/Public');

app.use("/Public", express.static(__dirname + '/Public'));
app.use("/images", express.static(__dirname + '/Public/Images'));
app.use("/js", express.static(__dirname + '/Public/Js'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

const userSpace = io.of('/user');

userSpace.on('connection', function(socket) {
  runUserInit();

  socket.on('chat message', function(msg) {
    console.log('message from user: ' + msg);
  });

  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });

});

const deviceSpace = io.of('/device');
deviceSpace.on('connection', function(socket) {
  runDeviceInit(socket);

  socket.on('newDeviceInfo', function(device) {
    registerNewDevice(device, socket);
  });

  socket.on('idSet', function(device) {
    console.log("Id: " + device.id + " given to device: " + device.type);
    registerNewDevice(device, socket);
  });

  socket.on('disconnect', function() {
    console.log('a device disconnected');
    appData.removeConnection(socket);
  });

  socket.on('updateInformation', function(command, device) {
    device.socket = socket;
    appData.updateDevice(device);
    switch (command) {
      case "schedule":
        deviceManager.schedule(appData.getDevice(device.id));
        break;
      default:
    }
  });

});

http.listen(3000, function() {
  console.log('Server started!');
});

function runUserInit() {
  console.log('a user connected');
}

function runDeviceInit(socket) {
  console.log('a device connected');
  let device = socket.emit('getDeviceInfo');
}

function registerNewDevice(device, socket) {
  if (device.id == undefined) {
    let id = getNewId();
    device.id = id;
    socket.emit('setId', id);
  } else {
    device.socket = socket;
    if (!appData.containsDevice(device.id)) {
      appData.addDevice(device);
    }
  }
}

let nextId = 0;

function getNewId() {
  let temp = nextId;
  nextId++;
  return temp;
}
