let socket = io('/user');

socket.on('updateWindmill', function(meterPerSecond) {
    updateWindmillSpeed(meterPerSecond);
});

socket.on('addDevice', function(device) {
    addWaterHeater(device);
});

socket.on('updateDevice', function(device) {
    updateWaterHeater(device);
});

socket.on('removeDevice', function(device) {
    removeDevice(device);
});