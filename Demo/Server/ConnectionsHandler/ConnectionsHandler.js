let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const userSpace = io.of('/user');

    userSpace.on('connection', function(socket){
    console.log('a user connected');

    userSpace.on('chat message', function(msg){
    console.log('message from user: ' + msg);
    });

    userSpace.on('disconnect', function(){
      console.log('a user disconnected');
    });

});

const deviceSpace = io.of('/device');
deviceSpace.on('connection', function(socket){
  console.log('a device connected');

  deviceSpace.on('disconnect', function(){
    console.log('a device disconnected');
  });

});

http.listen(3000, function(){
  console.log('Server started!');
});
