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
    sendAPISurplusGraph: (socket, date) => sendAPISurplusGraph(socket, date),
    sendSurplusGraph: (socket, date) => sendSurplusGraph(socket, date)
}
module.exports = functions;
let commandQueue = [];
let lastGraphUpdate;

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
        date.setHours(0);
        await sendAPISurplusGraph(socket, date);
        //await sendSurplusGraph(socket, date);
        resolve(true);
    });
}

async function sendAPISurplusGraph(socket, date) {
    return new Promise(async (resolve, reject) => {
        for (var i = 0; i < 24; i++) {
            let id = util.dateToId("apiSurplus", date);
            let graph = await dbG.getGraph(id);
            let payload = {
                name: "apiSurplusGraph",
                hour: i,
                values: graph.values
            }
            createCommand(socket, "createGraphValues", payload);
            date = incrementHour(date, 1);
        }

        let endOfGraphPayload = {
            name: "apiSurplusGraph",
            hour: -1,
            values: "done"
        }
        createCommand(socket, "createGraphValues", endOfGraphPayload);

        resolve(true);
    });
}

async function sendSurplusGraph(socket, date) {
    lastGraphUpdate = new Date();
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
            date = incrementHour(date, 1);
        }

        let endOfGraphPayload = {
            name: "surplusGraph",
            hour: -1,
            values: "done"
        }
        createCommand(socket, "createGraphValues", endOfGraphPayload);
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
    return new Promise(async (resolve, reject) => {

    });
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

function incrementHour(date, increment) {
    date.setHours(date.getHours() + increment);
    return date;
}

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