const db = require('./DatabaseAccessorDevice.js');

const functions = {
    onConnect: (socket, connectedDevices) => onConnect(socket, connectedDevices),
    onDisconnect: (socket) => onDisconnect(socket),
    scheduleDevice: (id, timeInterval) => scheduleDevice(id, timeInterval),
    manageUpdatedDevices: (ids) => manageUpdatedDevices(ids),
    graphUpdate: () => graphUpdate(),
    getCommandQueue: () => getCommandQueue(),
}
module.exports = functions;
let commandQueue = [];
let activeConnections = [];

function onConnect(socket, connectedDevices) {
    connectedDevices.forEach((connection) => {
        let device = db.getDevice(connection.id);
        createCommand("Update Device", socket, device);
    });
}

function onDisconnect (socket) {

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
