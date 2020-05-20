const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// Server
const dm = require('./DeviceManager.js');
const sd = require('./Scheduler.js');
const um = require('./UserManager.js');
const dd = require('./DatabaseAccessorDevice.js');
const dg = require('./DatabaseAccessorGraph.js');
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

const port = process.env.PORT || 3000;
const updateInterval = 1 * 1000;
const waterHeaterBaseLoad = 100; // in watts
const ticksPerHour = (3600 / (updateInterval / 1000));
sd.setTicksPerHour(ticksPerHour);
/*
    SECTION: Timers
*/

startServer();

async function startServer() {
    setInterval(() => {
        //    console.log();
        //    console.log();
        update();
    }, updateInterval);
}

/*
    SECTION: Connections
*/

http.listen(port, () => {
    //print("Server started!")
});

const userSpace = io.of('/user');
userSpace.on('connection', (socket) => {

    socket.on('getMainGraphs', () => {
        um.onConnect(socket, dm.getActiveConnections());
    });


});

const deviceSpace = io.of('/device');
deviceSpace.on('connection', (socket) => {
    dm.onConnect(socket);

    socket.on('receiveDeviceId', (id) => {
        console.log("---receiveDeviceId");
        console.log(id);
        dm.receiveId(id, socket);
    });

    socket.on('newDeviceWithId', (deviceInfo) => {
        console.log("---newDeviceWithId");
        dm.deviceInit(deviceInfo, socket);
    });

    socket.on('stateChanged', (state, id) => {
        console.log("---stateChanged to " + state);
        dm.stateChanged(id, state);
    });

    socket.on('deviceUpdate', (device) => {
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
    //print("Update started")
    let devices = dm.getActiveConnections();
    devices.forEach(async (connection) => {
        let device = await dd.getDevice(connection.deviceId);
        if (device !== null) {
            await sd.scheduleDevice(device);
        }
        device = await dd.getDevice(connection.deviceId);
        if (device !== null) {
            dm.manageDevice(device);
        }
    });
    await sd.savePowerStatsToDatabase();

    handleCommands();
    await updateUserManager();
    //print("Update finished")
}

function handleCommands() {
    //print("Handle commands")
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
    // Make work (Remove return) (In case scheduler actually need to send commands)
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
    // print("Send Command: " + command.command + " Payload: " + command.payload);
    let socket = command.socket;
    let payload = command.payload;
    command = command.command;
    if (socket === 'userSpace') {
        userSpace.emit(command, payload);
    } else {
        socket.emit(command, payload);
    }
}

/*
    SECTION: User Manager
*/

async function updateUserManager() {
    //print("Update User Manager")
    let updatedDevices = dm.getUpdatedDevices();
    updatedDevices.concat(sd.getUpdatedDevices());
    um.sendUpdatedDevices(updatedDevices);
    um.graphUpdate();

    // Kwh saved
    let ticksSaved = await sd.getTicksSaved();
    um.sendKwhsSaved(ticksSaved * waterHeaterBaseLoad * 0.001 * (1 / ticksPerHour));
    let powerUsed = await sd.getGoodPowerUsed(waterHeaterBaseLoad * (1 / ticksPerHour));
    um.sendKwhsUsed(powerUsed * 0.001 / 3600);
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