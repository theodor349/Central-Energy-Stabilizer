'use strict';
const uuid = require('uuidv4');
const db = require('./DatabaseAccessorDevice.js');

const functions = {
    onConnect: (socket) => onConnect(socket),
    receiveId: (id, socket) => receiveId(id, socket),
    deviceInit: (deviceInfo, socket) => deviceInit(deviceInfo, socket),
    onDisconnect: (socket) => onDisconnect(socket),
    deleteDevice: (id) => deleteDevice(id),
    updateDevice: (deviceInfo) => updateDevice(deviceInfo),
    manageDevice: (deviceInfo) => manageDevice(deviceInfo),
    getScheduledState: (deviceInfo, time) => getScheduledState(deviceInfo, time),
    changeState: (id, nextState) => changeState(id, nextState),
    stateChanged: (id, newState) => stateChanged(id, newState),
    receiveUpdate: (deviceInfo) => receiveUpdate(deviceInfo),
    removeSchedule: (id) => removeSchedule(id),
    getCommandQueue: () => getCommandQueue(),
    getActiveConnections: () => getActiveConnections(),
    clearAllConnections: () => clearAllConnections(),
    // FOR TESTING
    testDeviceInit: (deviceInfo, socket) => testDeviceInit(deviceInfo, socket),
}
module.exports = functions;
let commandQueue = [];
let activeConnections = [];

function onConnect(socket) {
    createCommand(socket, "askForId");
}

function receiveId(id, socket) {
    // TODO: Check for existing ID on DB
    if (uuid.isUuid(id) === true) {
        addConnection(id, socket);
        return true;
    } else {
        sendNewId(socket);
        return false;
    }
}

function deviceInit(deviceInfo, socket) {
    if (uuid.isUuid(deviceInfo.deviceId) === false) {
        return false;
    }
    deviceInfo.scheduledByUser = false;
    deviceInfo.isScheduled = false;
    deviceInfo.nextState = undefined;
    deviceInfo.schedule = undefined;
    deviceInfo.scheduledInterval = undefined;
    return new Promise(async (resolve, reject) => {
        db.createDevice(deviceInfo)
            .then((val) => {
                if (val !== null) {
                    addConnection(val.deviceId, socket);
                    resolve(true);
                } else {
                    resolve(false)
                }
            })
            .catch((err) => {
                reject(err);
            })
    })
}

function onDisconnect(socket) {
    return removeConnectionWithSocket(socket);
}

function deleteDevice(id) {
    return new Promise(async (resolve, reject) => {
        db.deleteDevice(id)
            .then((val) => {
                if (val === true) {
                    removeConnectionWithId(id);
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((err) => {
                reject(err);
            })
    })
}

async function updateDevice(deviceInfo) {
    let dbDevice = await db.getDevice(deviceInfo.deviceId);
    if (dbDevice === null) {
        return 0;
    }
    let fieldsToUpdate = getFieldsToUpdate(deviceInfo, dbDevice);
    for (let i = 0; i < fieldsToUpdate.length; i++) {
        await db.updateDevice(deviceInfo.deviceId,
            fieldsToUpdate[i].field,
            fieldsToUpdate[i].value);
    }
    return fieldsToUpdate.length;
}

function manageDevice(deviceInfo) {
    let time = new Date();
    let nextState = getScheduledState(deviceInfo, time);
    if (nextState === null) {
        return false;
    }
    changeState(deviceInfo.deviceId, nextState);
    return true;
}

async function stateChanged(id, newState) {
    return new Promise((resolve, reject) => {
        db.updateDevice(id, "currentState", newState)
            .then((val) => {
                resolve(val);
            })
            .catch((err) => {
                reject(err);
            })
    })
}

/*
    SECTION: Helper Functions
*/

function getScheduledState(deviceInfo, time) {
    if (deviceInfo.schedule.start < time &&
        deviceInfo.schedule.end > time) {
        if (deviceInfo.nextState === deviceInfo.currentState) {
            return null;
        } else {
            return deviceInfo.nextState;
        }
    } else {
        if (deviceInfo.currentState === "off") {
            return null;
        } else {
            return "off";
        }
    }
}

function changeState(id, nextState) {
    let index = getConnectionIndexId(id);
    if (index === null) {
        return false;
    }
    if (nextState === "off") {
        createCommand(activeConnections[index].socket, "off", nextState);
    } else {
        createCommand(activeConnections[index].socket, "on", nextState);
    }
    return true;
}

function getFieldsToUpdate(device, other) {
    let fieldsToUpdate = [];
    if (device.isAutomatic !== other.isAutomatic) {
        fieldsToUpdate.push({
            field: "isAutomatic",
            value: device.isAutomatic
        });
    }
    if (device.currentPower !== other.currentPower) {
        fieldsToUpdate.push({
            field: "currentPower",
            value: device.currentPower
        });
    }
    if (device.currentState !== other.currentState) {
        fieldsToUpdate.push({
            field: "currentState",
            value: device.currentState
        });
    }
    if (device.deviceType !== other.deviceType) {
        fieldsToUpdate.push({
            field: "deviceType",
            value: device.deviceType
        });
    }
    if (JSON.stringify(device.programs) !== JSON.stringify(other.programs)) {
        fieldsToUpdate.push({
            field: "programs",
            value: device.programs
        });
    }
    if (JSON.stringify(device.uniqueProperties) !== JSON.stringify(other.uniqueProperties)) {
        fieldsToUpdate.push({
            field: "uniqueProperties",
            value: device.uniqueProperties
        });
    }
    return fieldsToUpdate;
}

function sendNewId(socket) {
    let id = uuid.uuid();
    createCommand(socket, "setId", id);
}

function clearAllConnections() {
    activeConnections = [];
}

function removeConnectionWithSocket(socket) {
    let index = getConnectionIndexSocket(socket)
    if (index !== null) {
        activeConnections.splice(index, 1);
        return true;
    }
    return false;
}

function removeConnectionWithId(id) {
    let index = getConnectionIndexId(id);
    if (index !== null) {
        activeConnections.splice(index, 1);
        return true;
    }
    return false;
}

function getConnectionIndexId(id) {
    for (let i = 0; i < activeConnections.length; i++) {
        if (activeConnections[i].deviceId === id) {
            return i;
        }
    }
    return null;
}

function getConnectionIndexSocket(socket) {
    for (let i = 0; i < activeConnections.length; i++) {
        if (activeConnections[i].socket === socket) {
            return i;
        }
    }
    return null;
}

function addConnection(id, socket) {
    let connection = {
        deviceId: id,
        socket: socket
    };
    activeConnections.push(connection);
}

function getActiveConnections() {
    return activeConnections;
}

function getCommandQueue() {
    let cq = commandQueue;
    commandQueue = [];
    return cq;
}

function createCommand(socket, command, payload) {
    let commandObj = {
        socket: socket,
        command: command,
        payload: payload,
    }
    commandQueue.push(commandObj);
}


/*
    SECTION:
            DISCLAIMER THIS IS ONLY FOR TESTING PURPOSES
*/
function testDeviceInit(deviceInfo, socket) {
    if (uuid.isUuid(deviceInfo.deviceId) === false) {
        return false;
    }
    return new Promise(async (resolve, reject) => {
        db.createDevice(deviceInfo)
            .then((val) => {
                if (val !== null) {
                    addConnection(val.deviceId, socket);
                    resolve(true);
                } else {
                    resolve(false)
                }
            })
            .catch((err) => {
                reject(err);
            })
    })
}
