let io = require('socket.io-client');
let socket = io('/device');
socket = io.connect("http://localhost:3000/device", {
    reconnection: true,
});



socket.on('connect', function () {
    console.log('connected to localhost:3000');

    socket.on('clientEvent', function (data) {
        console.log('message from the server:', data);
        socket.emit('serverEvent', "thanks server! for sending '" + data + "'");
    });
});
