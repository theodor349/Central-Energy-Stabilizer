const db = require('./DatabaseAccessorDevice.js');

const functions = {
    onConnect: (socket, connectedDevices) => onConnect(socket, connectedDevices),
    scheduleDevice: (id, timeInterval) => scheduleDevice(id, timeInterval),
    sendUpdatedDevices: (updatedDevices) => sendUpdatedDevices(updatedDevices),
    graphUpdate: () => graphUpdate(),
    getCommandQueue: () => getCommandQueue(),
}
module.exports = functions;
let commandQueue = [];

async function onConnect(socket, connectedDevices) {
    connectedDevices.forEach(async (deviceConnection) => {
        let device = await db.getDevice(deviceConnection.deviceId);
        createCommand(socket, "updateDevice", device);
    });
}

// Not needed for minimal viable product (waterHeater)
function scheduleDevice(id, timeInterval) {

}

async function sendUpdatedDevices(updatedDevices) {
    updatedDevices.forEach(async (deviceConnection) => {
        let device = await db.getDevice(deviceConnection.deviceId);
        createCommand('userSpace', "updateDevice",  device);
    });
}

function graphUpdate() {

}

/*
    SECTION: Helper Functions
*/


function createCommand(socket, command, payload) {
    let commandObj = {
        socket: socket,
        command: command,
        payload: payload,
    }
    commandQueue.push(commandObj);
}

function getCommandQueue() {
    let cq = commandQueue;
    commandQueue = [];
    return cq;
}
