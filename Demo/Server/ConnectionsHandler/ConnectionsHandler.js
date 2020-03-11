let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let appData = require('../Core/DeviceStorage.js')

console.log(__dirname + '/Public');

app.use("/public", express.static(__dirname + '/Public'));

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
    appData.addDevice(device);
  }
}

let nextId = 0;

function getNewId() {
  nextId++;
  return nextId--;
}