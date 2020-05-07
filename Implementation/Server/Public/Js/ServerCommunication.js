let socket = io('/user');

let knownDevices = [];

socket.on('updateDevice', function(device) {
    if (knownDevices.includes(device.deviceId)) {
        updateDevice(device);
    } else {
        knownDevices.push(device.deviceId);
        addDevice(device);
    }
});

socket.on('removeDevice', function(device) {
    removeDevice(device);
});
