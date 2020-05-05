const db = require('./DatabaseAccessorDevice.js');

const functions = {
    onConnect: (socket) => onConnect(socket),
    onDisconnect: (socket) => onDisconnect(socket),
    scheduleDevice: (id, timeInterval) => scheduleDevice(id, timeInterval),
    manageUpdatedDevices: (ids) => manageUpdatedDevices(ids),
    graphUpdate: () => graphUpdate(),
    getCommandQueue: () => getCommandQueue(),
}
module.exports = functions;
let commandQueue = [];
let activeConnections = [];

function onConnect(socket) {
    
}

/*
    SECTION: Helper Functions
*/

function getCommandQueue() {
    let cq = commandQueue;
    commandQueue = [];
    return cq;
}

function getActiveConnections() {
    return activeConnections;
}

function addConnection(id, socket) {
    let connection = {
        deviceId: id,
        socket: socket
    };
    activeConnections.push(connection);
}

function removeConnectionWithSocket(socket) {
    let index = getConnectionIndexSocket(socket)
    if (index !== null) {
        activeConnections.splice(index, 1);
        return true;
    }
    return false;
}

function getConnectionIndexSocket(socket) {
    for (let i = 0; i < activeConnections.length; i++) {
        if (activeConnections[i].socket === socket) {
            return i;
        }
    }
    return null;
}

function clearAllConnections() {
    activeConnections = [];
}
