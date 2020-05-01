let socket = io('/user');

let knowDevices = [];

socket.on('updateDevice', function(device) {
    if (knowDevices.includes(device.deviceId)) {
        knowDevices.push(device.deviceId);
        addDevice(device);
    } else {
        updateDevice(device);
    }
});

socket.on('removeDevice', function(device) {
    removeDevice(device);
});