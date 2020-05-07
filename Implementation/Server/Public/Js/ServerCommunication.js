let socket = io('/user');

let knownDevices = [];

socket.on('updateDevice', function(device) {
    if (knownDevices.includes(device.deviceId)) {
        knownDevices.push(device.deviceId);
        updateDevice(device);
    } else {
        addDevice(device);
    }
});

socket.on('removeDevice', function(device) {
    removeDevice(device);
});
