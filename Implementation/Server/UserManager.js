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
    sendSurplusGraph: (socket, date) => sendSurplusGraph(socket, date),
    sendKwhsSaved: (kwhSaved) => sendKwhsSaved(kwhSaved),
    sendKwhsUsed: (kwhUsed) => sendKwhsUsed(kwhUsed),
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
        date = new Date();
        await sendSurplusGraph(socket, date);
        resolve(true);
    });
}

async function sendAPISurplusGraph(socket, date) {
    return new Promise(async (resolve, reject) => {
        if (process.env.PORT) {
            date.setHours(date.getHours());
        }
        for (var i = 0; i < 24; i++) {
            let id = util.dateToId("apiSurplusGraph", date);
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
    return new Promise(async (resolve, reject) => {
        lastGraphUpdate = new Date(date.getTime());
        let hours = date.getHours();
        date.setHours(0);


        for (var i = 0; i < hours; i++) {
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

        let minutes = date.getMinutes();
        let id = util.dateToId("surplusGraph", date);
        let graph = await dbG.getGraph(id);
        let values = [];
        for (var i = 0; i < minutes; i++) {
            values.push(graph.values[i]);
        }
        let payload = {
            name: "surplusGraph",
            hour: hours,
            values: values
        }
        createCommand(socket, "createGraphValues", payload)

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
    let date = new Date()
    if (lastGraphUpdate !== undefined &&
        lastGraphUpdate.getMinutes() === date.getMinutes()) {
        //    console.log("Do not send update");
        return false;
    }
    //console.log("Send update");
    lastGraphUpdate = new Date();
    return new Promise(async (resolve, reject) => {
        date = new Date(); // 10:12
        date.setMinutes(date.getMinutes() - 1); // 10:11
        let graph = await dbG.getGraph(util.dateToId("surplusGraph", date));
        let minute = date.getMinutes();
        let point = [graph.values[minute]];
        let payload = {
            name: "surplusGraph",
            hour: date.getHours(),
            minute: minute,
            values: point
        }
        createCommand("userSpace", "graphValueUpdate", payload);
    });
}

function sendKwhsSaved(kwhSaved) {
    createCommand("userSpace", "savedKwhData", kwhSaved.toFixed(3));
}

function sendKwhsUsed(kwhUsed) {
    createCommand("userSpace", "usedKwhData", kwhUsed.toFixed(3));
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