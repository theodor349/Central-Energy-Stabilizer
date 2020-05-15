'use strict';

const functions = {
    // functions for testing
    testSetup: () => testSetup(),
    getDeviceInfo: () => getDeviceInfo(),
    setDeviceId: (deviceId) => setDeviceId(deviceId),
    changeStateToOff: (waterHeater) => changeStateToOff(waterHeater),
    changeStateToOn: (waterHeater) => changeStateToOn(waterHeater),
    checkState: (waterHeater) => checkState(waterHeater),
    setWaterHeaterOn: (waterHeater) => setWaterHeaterOn(waterHeater),
    setWaterHeaterOff: (waterHeater) => setWaterHeaterOff(waterHeater),
    setEnergyUsage: (waterHeater) => setEnergyUsage(waterHeater),
    stopEnergyUsageInterval: (waterHeater) => stopEnergyUsageInterval(waterHeater),
    changeConnectionString: (connectionString) => changeConnectionString(connectionString),
    sendUpdate: (deviceInfo) => sendUpdate(deviceInfo),
};
module.exports = functions;

const fs = require('fs');
const io = require('socket.io-client');
const updateInterval = 1000;
const graphInterval = 1000;
const constDeviceUpdateInterval = 1000; //60000;
const tempGainPrSecond = 0.0033;
const tempLossPrSecond = 0.0017;
const initTemp = 66;

let deviceInfo = {};
let waterHeaterOnInterval;
let waterHeaterOffInterval;
let energyUsageInterval;
let deviceUpdateInterval;
let updater;
let socket;

let connectionString = "https://central-energy-stabilizer.herokuapp.com/device";
setTimeout(function() {
    socket = io.connect(connectionString, {
        reconnection: true,
    });

    getLocalDeviceInfo();
    initCurrentTemp();
    initState(deviceInfo);

    updater = setInterval(() => {
        checkState(deviceInfo);
    }, updateInterval);

    connectionSetup();
}, 10);

function changeConnectionString(cs) {
    connectionString = cs;
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

function startEnergyUsageInterval(waterHeater) {
    energyUsageInterval = setInterval(function() {
        setEnergyUsage(waterHeater);
    }, graphInterval);
}

function setEnergyUsage(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;
    if (waterHeater.programs[0].pointArray[waterHeater.graphIndex + 1] !== Infinity) {
        waterHeater.graphIndex++;
    }
    waterHeater.currentPower = waterHeater.programs[0].pointArray[waterHeater.graphIndex];
}

function stopEnergyUsageInterval(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;
    clearInterval(energyUsageInterval);
    waterHeater.graphIndex = 0;
    waterHeater.currentPower = 0;
}

function getCurrentPower(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;
    console.log(deviceInfo.currentPower);
}

function setDeviceId(deviceId) {
    deviceInfo.deviceId = deviceId;

    let idObject = {
        deviceId: deviceId
    }

    let idJsonObject = JSON.stringify(idObject);

    fs.writeFileSync('DeviceId.json', idJsonObject);
}


// Unique function for water heater
// Due to the lack of sensors, we assume the waterHeater to be 0 degrees on startup
function initCurrentTemp() {
    let uniqueProperties = deviceInfo.uniqueProperties;
    if (uniqueProperties.currentTemp === null) {
        uniqueProperties.currentTemp = initTemp;
    }
}

function initState(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;
    if (uniqueProperties.currentTemp < uniqueProperties.minTemp) {
        waterHeater.currentState = "on";
        waterHeaterOn(waterHeater);
    } else {
        waterHeater.currentState = "off";
        waterHeaterOff(waterHeater);
    }
}

function checkState(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;

    if (uniqueProperties.currentTemp > uniqueProperties.maxTemp) {
        changeStateToOff(waterHeater);
    } else if (waterHeater.isConnected === false &&
        uniqueProperties.currentTemp > uniqueProperties.minTemp &&
        waterHeater.currentState === "on") {
        changeStateToOff(waterHeater);
    } else if (uniqueProperties.currentTemp <= uniqueProperties.minTemp &&
        waterHeater.currentState === "off") {
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

function changeStateToOff(waterHeater) {
    waterHeater.onDisconnect = false;
    clearInterval(waterHeaterOnInterval);
    waterHeaterOff(waterHeater);
    waterHeater.currentState = "off";

    if (socket.connected === true) {
        socket.emit("currentStateChanged", waterHeater.currentState, waterHeater.deviceId);
    }
}

function changeStateToOn(waterHeater) {
    clearInterval(waterHeaterOffInterval);
    waterHeaterOn(waterHeater);
    waterHeater.currentState = "on";

    if (socket.connected === true) {
        socket.emit("currentStateChanged", waterHeater.currentState, waterHeater.deviceId);
    }
}

function waterHeaterOn(waterHeater) {
    startEnergyUsageInterval(waterHeater);
    waterHeaterOnInterval = setInterval(() => {
        setWaterHeaterOn(waterHeater);
    }, updateInterval);
}

function setWaterHeaterOn(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;
    uniqueProperties.currentTemp += tempGainPrSecond;
}

function waterHeaterOff(waterHeater) {
    stopEnergyUsageInterval(waterHeater);
    waterHeaterOffInterval = setInterval(() => {
        setWaterHeaterOff(waterHeater);
    }, updateInterval);
}

function setWaterHeaterOff(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;
    uniqueProperties.currentTemp -= tempLossPrSecond;
}

function sendUpdate(deviceInfo) {
    console.log();
    console.log("Sending Update to Server");
    console.log("Temp: " + deviceInfo.uniqueProperties.currentTemp);
    console.log("State: " + deviceInfo.currentState);
    socket.emit('deviceUpdate', deviceInfo);
}
// Connection
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

        deviceUpdateInterval = setInterval(function() {
            sendUpdate(deviceInfo);
        }, constDeviceUpdateInterval);
    });

    socket.on('disconnect', function() {
        console.log('Lost connection with localhost:3000');
        deviceInfo.isConnected = false;
        clearInterval(deviceUpdateInterval);
    });
}