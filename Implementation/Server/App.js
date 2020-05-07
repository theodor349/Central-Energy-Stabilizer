const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// Server
const dm = require('./DeviceManager.js');
const sd = require('./Scheduler.js');
const dd = require('./DatabaseAccessorDevice.js');
const um = require('./UserManager.js');
const apiG = require('./ForecasterAPI.js');

app.use("/Public", express.static(__dirname + '/Public'));
app.use("/images", express.static(__dirname + '/Public/Images'));
app.use("/js", express.static(__dirname + '/Public/Js'));
app.use("/Css", express.static(__dirname + '/Public/Css'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/Public/index.html');
});

/*
    SECTION: Parameters
*/

const port = 3000;
const updateInterval = 5 * 1000;

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

const userSpace = io.of('/user');
userSpace.on('connection', (socket) => {
    um.onConnect(socket, dm.getActiveConnections());
})

const deviceSpace = io.of('/device');
deviceSpace.on('connection', (socket) => {
    dm.onConnect(socket);

    socket.on('receiveDeviceId', (id) => {
        console.log("---receiveDeviceId");
        console.log(id);
        console.log();
        dm.receiveId(id, socket);
    });

    socket.on('newDeviceWithId', (deviceInfo) => {
        console.log("---newDeviceWithId");
        console.log(deviceInfo);
        console.log();
        dm.deviceInit(deviceInfo, socket);
    });

    socket.on('stateChanged', (state, id) => {
        console.log("---stateChanged");
        console.log(state + " " + id);
        console.log();
        dm.stateChanged(id, state);
    });

    socket.on('deviceUpdate', (device) => {
        console.log("---deviceUpdate");
        console.log(device);
        console.log();
        dm.updateDevice(device);
    });

    socket.on('disconnect', () => {
        console.log("---disconnect");
        console.log();
        dm.onDisconnect(socket);
    });
});

/*
    SECTION: Updateloop and Commands
*/

async function update() {
    print("Update started")
    let devices = dm.getActiveConnections();
    devices.forEach(async (connection) => {
        let device = await dd.getDevice(connection.deviceId);
        await sd.scheduleDevice(device);
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

    let commands = sd.getCommandQueue();
    commands.forEach((command) => {
        executeCommand(command);
    });
}

function handleUserManagerCommands() {
    let commands = um.getCommandQueue();
    commands.forEach((command) => {
        executeCommand(command);
    });
}

function executeCommand(command) {
    print("Command: " + command.command + " Payload: " + command.payload);
    let socket = command.socket;
    let payload = command.payload;
    command = command.command;
    if (socket === 'userSpace') {
        io.to('userSpace').emit(command, payload);
    } else {
        socket.emit(command, payload);
    }
}

/*
    SECTION: User Manager
*/

function updateUserManager() {
    print("Update User Manager")
    let updatedDevices = dm.getUpdatedDevices();
    updatedDevices.push(sd.getUpdatedDevices());
    um.sendUpdatedDevices(updatedDevices);
}

/*
    SECTION: Helper Functions
*/

function print(message) {
    let date = new Date();
    console.log(
        date.getHours() + ":" +
        date.getMinutes() + ":" +
        date.getMilliseconds() + " " +
        message);
}
