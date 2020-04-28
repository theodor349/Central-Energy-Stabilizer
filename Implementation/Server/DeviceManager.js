'use strict';
const functions = {
    onConnect: (socket) => onConnect(socket),
    receiveId: (id) => receiveId(id),
    deviceInit: (deviceInfo) => deviceInit(deviceInfo),
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
}
module.exports = functions;
let commandQueue = [];

function getCommandQueue() {
    let cq = commandQueue;
    commandQueue.clear();
    return cq;
}

function createCommand(command, payload) {
    let commandObj = {
        command: command,
        payload: payload,
    }
    commandQueue.push(commandObj);
}