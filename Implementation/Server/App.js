const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// Server
const dm = require('./DeviceManager.js');
const sd = require('./Scheduler.js');
const dd = require('./DatabaseAccessorDevice.js');
const um = require('./UserManager.js');

/*
    SECTION: Parameters
*/

const port = 3000;
const updateInterval = 1000;

/*
    SECTION: Timers
*/

startServer();

function startServer() {
    setInterval(() => {
        console.log();
        update();
    }, updateInterval);
}

/*
    SECTION: Connections
*/

http.listen(port, () => {
    print("Server started!")
});

const deviceSpace = io.of('/device');
deviceSpace.on('connection', (socket) => {
    dm.onConnect(socket);

    socket.on('receiveDeviceId', (Id) => {
        dm.receiveId(id, socket);
    });

    socket.on('newDeviceWithId', (deviceInfo) => {
        dm.deviceInit(deviceInfo, socket);
    });

    socket.on('stateChanged', (state, Id) => {
        dm.stateChanged(id, state);
    });

    socket.on('deviceUpdate', (device) => {
        dm.updateDevice(device);
    });

    socket.on('disconnect', () => {
        dm.onDisconnect(socket);
    });
});

/*
    SECTION: Updateloop and Commands
*/

async function update() {
    print("Update started")
    let devices = dm.getActiveConnections();
    devices.forEach(async (deviceId) => {
        let device = await dd.getDevice(deviceId);
        // TODO: Schedule device
        dm.manageDevice(device);
    });

    handleCommands();
    updateUserManager();
    print("Update finished")
}

function handleCommands() {
    print("Handle commands")
    handleDeviceManagerCommands();
    handleSchedulerCommands();
    handleUserManagerCommands();
}

function handleDeviceManagerCommands() {
    let commands = dm.getCommandQueue();
    commands.forEach((command) => {
        executeCommand(command);
    });
}

function handleSchedulerCommands() {
    // TODO: make work (Remove return)
    return;

    let commands = dm.getCommandQueue();
    commands.forEach((command) => {
        executeCommand(command);
    });
}

function handleUserManagerCommands() {
    // TODO: make work (Remove return)
    return;

    let commands = dm.getCommandQueue();
    commands.forEach((command) => {
        executeCommand(command);
    });
}

function executeCommand(command) {
    let socket = command.socket;
    let payload = command.payload;
    command = command.command;
    socket.emit(command, payload);
}

/*
    SECTION: User Manager
*/

function updateUserManager() {
    print("Update User Manager")
    let updatedDevices = dm.getUpdatedDevices();
    // TODO: updatedDevices.push(sd.getUpdatedDevices());
    // TODO: um.sendUpdates(updatedDevices);
}

/*
    SECTION: User Manager
*/

function print(message) {
    let date = new Date();
    console.log(
        date.getHours() + ":" +
        date.getMinutes() + ":" +
        date.getMilliseconds() + " " +
        message);
}