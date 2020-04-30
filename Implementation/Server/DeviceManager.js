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
    changeState: (id) => changeState(id),
    stateChanged: (id, newState) => stateChanged(id, newState),
    receiveUpdate: (deviceInfo) => receiveUpdate(deviceInfo),
    removeSchedule: (id) => removeSchedule(id),
    getCommandQueue: () => getCommandQueue(),
    getActiveConnections: () => getActiveConnections(),
    clearAllConnections: () => clearAllConnections(),
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

/*
    SECTION: Helper Functions
*/

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
    for (let i = 0; i < activeConnections.length; i++) {
        if (activeConnections[i].socket === socket) {
            activeConnections.splice(i, 1);
            return true;
        }
    }
    return false;
}

function removeConnectionWithId(id) {
    for (let i = 0; i < activeConnections.length; i++) {
        if (activeConnections[i].deviceId === id) {
            activeConnections.splice(i, 1);
            return true;
        }
    }
    return false;
}

function addConnection(id, socket) {
    let connection = {
        deviceId: id,
        socket: socket
    };
    activeConnections.push(connection);
}

function isIdValid(id) {
    if (id === undefined) {
        return false;
    }
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
