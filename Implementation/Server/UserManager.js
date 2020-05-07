'use strict'
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
    return new Promise(async (resolve, reject) => {
        if (connectedDevices.length === 0) {
            resolve(true);
        } else {
            for (let i = 0; i < connectedDevices.length; i++) {
                    let device = await db.getDevice(connectedDevices[i].deviceId);
                    createCommand(socket, "updateDevice", device);
            }
            resolve(true);
        }
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
                let device = await db.getDevice(updatedDevices[i]);
                createCommand("userSpace", "updateDevice", device);
                console.log(updatedDevices[i]);
            }
            resolve(true);
        }

    });

}

function graphUpdate() {

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
