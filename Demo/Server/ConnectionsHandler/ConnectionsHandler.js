let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let appData = require('../Core/DeviceStorage.js')

console.log(__dirname + '/Public');

app.use("/public", express.static(__dirname + '/Public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const userSpace = io.of('/user');

userSpace.on('connection', function(socket){
    runUserInit();

    socket.on('chat message', function(msg){
    console.log('message from user: ' + msg);
    });

    socket.on('disconnect', function(){
      console.log('a user disconnected');
    });

});

const deviceSpace = io.of('/device');
deviceSpace.on('connection', function(socket){
    runDeviceInit();

    socket.on('newDeviceInfo', function(device){
        registerNewDevice(device);
    })


    socket.on('disconnect', function(){
    console.log('a device disconnected');
    });

});

http.listen(3000, function(){
  console.log('Server started!');
});



function runUserInit(){
    console.log('a user connected');
}





function runDeviceInit(){
    console.log('a device connected');
    deviceSpace.emit('getDeviceInfo');
}

function registerNewDevice(device){
    appData.addDevice(device);
}
