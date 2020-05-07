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

function onConnect(socket, connectedDevices) {
    connectedDevices.forEach((deviceConnection) => {
        let device = db.getDevice(deviceConnection.id);
        createCommand("updateDevice", socket, device);
    });
}

// Not needed for minimal viable product (waterHeater)
function scheduleDevice(id, timeInterval) {

}

function sendUpdatedDevices(updatedDevices) {
    updatedDevices.forEach((deviceConnection) => {
        let device = db.getDevice(deviceConnection.id);
        createCommand("updateDevice", device);
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
