'use strict'
const dbD = require('./DatabaseAccessorDevice.js');
const dbG = require('./DatabaseAccessorGraph.js');
const util = require('./Utilities.js');

const functions = {
    onConnect: (socket, connectedDevices) => onConnect(socket, connectedDevices),
    onConnectDevice: (socket, connectedDevices) => onConnectDevice(socket, connectedDevices),
    onConnectGraph: (socket) => onConnectGraph(socket),
    scheduleDevice: (id, timeInterval) => scheduleDevice(id, timeInterval),
    sendUpdatedDevices: (updatedDevices) => sendUpdatedDevices(updatedDevices),
    graphUpdate: () => graphUpdate(),
    getCommandQueue: () => getCommandQueue(),
}
module.exports = functions;
let commandQueue = [];

async function onConnect(socket, connectedDevices) {
    await onConnectDevice(socket, connectedDevices);
    await onConnectGraph(socket);
}

async function onConnectDevice(socket, connectedDevices) {
    return new Promise(async (resolve, reject) => {
        if (connectedDevices.length === 0) {
            resolve(true);
        } else {
            for (let i = 0; i < connectedDevices.length; i++) {
                let device = await dbD.getDevice(connectedDevices[i].deviceId);
                createCommand(socket, "updateDevice", device);
            }
            resolve(true);
        }
    });
}

async function onConnectGraph(socket) {
    return new Promise(async (resolve, reject) => {
        let date = new Date();
        await sendSurplus(socket, date);
        resolve(true);
    });
}

async function sendSurplus(socket, date) {
    return new Promise(async (resolve, reject) => {
        for (var i = 0; i < 24; i++) {
            let id = util.dateToId("surplusGraph", date);
            let graph = await dbG.getGraph(id);
            let payload = {
                name: "surplusGraph",
                hour: i,
                values: graph.values
            }
            createCommand(socket, "createGraphValues", payload);
        }
        resolve(true);
    });
}

// Not needed for minimal viable product (waterHeater)
function scheduleDevice(id, timeInterval) {

}

async function sendUpdatedDevices(updatedDevices) {
    return new Promise(async (resolve, reject) => {
        if (updatedDevices.length === 0) {
            resolve(true);
        } else {
            for (let i = 0; i < updatedDevices.length; i++) {
                let device = await dbD.getDevice(updatedDevices[i]);
                createCommand("userSpace", "updateDevice", device);
            }
            resolve(true);
        }

    });
}

async function graphUpdate() {

}

/*
    SECTION: Helper Functions
*/
/*
async function testFunc(socket, connectedDevices) {
    await connectedDevices.forEach(async (deviceConnection) => {
        return new Promise(async (resolve, reject) => {
            let device = await db.getDevice(deviceConnection.deviceId);
            createCommand(socket, "updateDevice", device);
        });
        resolve(true);
    });
}
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