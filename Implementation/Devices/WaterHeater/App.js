'use strict';

const functions = {
    // functions for testing
    testSetup: () => testSetup(),
    getDeviceInfo: () => getDeviceInfo(),
    setDeviceId: (deviceId) => setDeviceId(deviceId),
    changeStateToOff: (waterHeater) => changeStateToOff(waterHeater),
    changeStateToOn: (waterHeater) => changeStateToOn(waterHeater),
    changeConnectionString: (connectionString) => changeConnectionString(connectionString),
    sendUpdate: (deviceInfo) => sendUpdate(deviceInfo),
    setState: (deviceInfo) => setState(deviceInfo),
    setPower: (deviceInfo) => setPower(deviceInfo),
    setTemp: (deviceInfo) => setTemp(deviceInfo),
};
module.exports = functions;

const fs = require('fs');
const io = require('socket.io-client');
const updateInterval = 1000;
const graphInterval = 1000;
const constDeviceUpdateInterval = 1000; //60000;
const tempGainPrSecond = 0.0095; // Energy: (3000/3600)Watts Mass: 75kg Substance: Water 25C | https://www.omnicalculator.com/physics/specific-heat#heat-capacity-formula
const tempLossPrSecond = 0.000159; // Energy: (50/3600)Watts Mass: 75kg Substance: Water 25C | https://www.omnicalculator.com/physics/specific-heat#heat-capacity-formula
const initTemp = 54;

let deviceInfo = {};
let updater;
let socket;

let connectionString;
let shouldConnectToServer = false;
if (shouldConnectToServer) { // Server
    connectionString = "https://central-energy-stabilizer.herokuapp.com/device";
} else { // Local
    connectionString = "http://localhost:3000/device"
}
setTimeout(function() {
    init();
}, 10); // For testing

/*
    SECTION: Initialization
*/

function init() {
    console.log("Device Started");
    socket = io.connect(connectionString, {
        reconnection: true,
    });

    getLocalDeviceInfo();
    initCurrentTemp(deviceInfo);
    initState(deviceInfo);

    updater = setInterval(() => {
        update(deviceInfo);
    }, updateInterval);

    connectionSetup();
}

function getLocalDeviceInfo() {
    let idRawData = fs.readFileSync('DeviceId.json');
    let infoRawData = fs.readFileSync('DeviceInfo.json');

    let idDataObject = JSON.parse(idRawData);
    let infoDataObject = JSON.parse(infoRawData);

    deviceInfo = infoDataObject;
    deviceInfo.currentState = null;
    deviceInfo.currentPower = 0;
    deviceInfo.isConnected = false;
    deviceInfo.serverMessage = null;
    deviceInfo.onDisconnect = false;
    deviceInfo.graphIndex = 0;
    deviceInfo.programs = [{
        pointArray: [
            0,
            750,
            1500,
            2250,
            3000,
            Infinity
        ]
    }]
    setDeviceId(idDataObject.deviceId);
}

function setDeviceId(deviceId) {
    deviceInfo.deviceId = deviceId;

    let idObject = {
        deviceId: deviceId
    }

    let idJsonObject = JSON.stringify(idObject);

    fs.writeFileSync('DeviceId.json', idJsonObject);
}

/*
    SECTION: Update
*/

function update(deviceInfo) {
    setState(deviceInfo);
    setPower(deviceInfo);
    setTemp(deviceInfo);

    deviceInfo.isConnected = socket.connected;
    if (socket.connected === true) {
        sendUpdate(deviceInfo);
    }
}

function setPower(waterHeater) {
    if (waterHeater.currentState === "on") {
        if (waterHeater.programs[0].pointArray[waterHeater.graphIndex + 1] !== Infinity) {
            waterHeater.graphIndex++;
        }
        waterHeater.currentPower = waterHeater.programs[0].pointArray[waterHeater.graphIndex];
    } else {
        waterHeater.currentPower = 0;
        waterHeater.graphIndex = 0;
    }
}

function setTemp(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;
    if (waterHeater.currentState === "on") {
        uniqueProperties.currentTemp += tempGainPrSecond;
    } else {
        uniqueProperties.currentTemp -= tempLossPrSecond;
    }
}

function changeStateToOff(waterHeater) {
    waterHeater.onDisconnect = false;
    waterHeater.currentState = "off";
}

function changeStateToOn(waterHeater) {
    waterHeater.currentState = "on";
}

/*
    SECNTION: Connection
*/

function changeConnectionString(cs) {
    connectionString = cs;
}

function sendUpdate(deviceInfo) {
    console.log();
    console.log("Sending Update to Server");
    console.log("Temp: " + deviceInfo.uniqueProperties.currentTemp);
    console.log("State: " + deviceInfo.currentState);
    socket.emit('deviceUpdate', deviceInfo);
}

function connectionSetup() {
    socket.once('connect', function() {
        console.log('Connected to ' + connectionString);
        deviceInfo.isConnected = true;

        socket.on('askForId', function() {
            console.log("Recieved Command: askForID");
            socket.emit('receiveDeviceId', deviceInfo.deviceId);
        });

        socket.on('setId', function(deviceId) {
            console.log("Recieved Command: setId");
            setDeviceId(deviceId);
            socket.emit('newDeviceWithId', deviceInfo);
        });

        socket.on('on', function() {
            console.log("---");
            console.log("Recieved Command: on");
            console.log("---");
            deviceInfo.serverMessage = "on";
        });

        socket.on('off', function() {
            console.log("---");
            console.log("Recieved Command: off");
            console.log("---");
            deviceInfo.serverMessage = "off";
        });
    });

    socket.on('disconnect', function() {
        console.log('Lost connection with localhost:3000');
        deviceInfo.isConnected = false;
    });
}

/*
    SECTION: Unique functions
*/

// Unique function for water heater
// Due to the lack of sensors, we assume the waterHeater to be 0 degrees on startup
function initCurrentTemp(deviceInfo) {
    let uniqueProperties = deviceInfo.uniqueProperties;
    if (uniqueProperties.currentTemp === null) {
        uniqueProperties.currentTemp = initTemp;
    }
}

function initState(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;
    waterHeater.currentState = "off";
}

function setState(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;

    if (uniqueProperties.currentTemp > uniqueProperties.maxTemp) {
        changeStateToOff(waterHeater);
    } else if (waterHeater.isConnected === false &&
        uniqueProperties.currentTemp > uniqueProperties.minTemp &&
        waterHeater.currentState === "on") {
        changeStateToOff(waterHeater);
    } else if (uniqueProperties.currentTemp <= uniqueProperties.minTemp) {
        changeStateToOn(waterHeater);
    } else if (waterHeater.isConnected === true &&
        waterHeater.serverMessage === "off" &&
        waterHeater.currentState === "on") {
        changeStateToOff(waterHeater);
        waterHeater.serverMessage = null;
    } else if (waterHeater.isConnected === true &&
        waterHeater.serverMessage === "on" &&
        waterHeater.currentState === "off") {
        changeStateToOn(waterHeater);
        waterHeater.serverMessage = null;
    } else if (waterHeater.onDisconnect === true &&
        waterHeater.currentState === "on") {
        changeStateToOff(waterHeater);
        waterHeater.serverMessage = null;
    }
}