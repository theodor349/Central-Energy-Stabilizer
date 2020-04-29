'use strict';
const uuid = require('uuidv4');
const db = require('./DatabaseAccessorDevice.js');

const functions = {
    onConnect: (socket) => onConnect(socket),
    receiveId: (id, socket) => receiveId(id, socket),
    deviceInit: (deviceInfo, socket) => deviceInit(deviceInfo, socket),
    onDisconnect: (socket) => onDisconnect(socket),
    deleteDevice: (id) => deleteDevice(id),
    updateDevice: (id) => updateDevice(id),
    manageDevice: (deviceInfo) => manageDevice(deviceInfo),
    getScheduledState: (deviceInfo, time) => getScheduledState(deviceInfo, time),
    changeState: (id) => changeState(id),
    stateChanged: (id, newState) => stateChanged(id, newState),
    receiveUpdate: (deviceInfo) => receiveUpdate(deviceInfo),
    removeSchedule: (id) => removeSchedule(id),
    getCommandQueue: () => getCommandQueue(),
    getActiveConnections: () => getActiveConnections(),
}
module.exports = functions;
let commandQueue = [];
let activeConnections = [];

function onConnect(socket) {
    createCommand(socket, "askForId");
}

function receiveId(id, socket) {
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
    /*  Check Id
        Add server props to device
            scheduledByUser = false
            isScheduled = false
            nextState = ""
            schedule = ""
            scheduledInterval = ""
        Send to databse
        Add connection
    */
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

/*
    SECTION: Helper Functions
*/

function sendNewId(socket) {
    let id = uuid.uuid();
    createCommand(socket, "setId", id);
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