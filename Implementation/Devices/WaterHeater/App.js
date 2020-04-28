'use strict';

const functions = {
    // functions for testing
    testSetup: () => testSetup(),
    getDeviceInfo: () => getDeviceInfo(),
    setDeviceId: (Id) => setDeviceId(Id),
    changeStateToOff: (waterHeater) => changeStateToOff(waterHeater),
    changeStateToOn: (waterHeater) => changeStateToOn(waterHeater),
    checkState: (waterHeater) => checkState(waterHeater),
    setWaterHeaterOn: (waterHeater) => setWaterHeaterOn(waterHeater),
    setWaterHeaterOff: (waterHeater) => setWaterHeaterOff(waterHeater),
    setEnergyUsage: (waterHeater) => setEnergyUsage(waterHeater),
    stopEnergyUsageInterval: (waterHeater) => stopEnergyUsageInterval(waterHeater),
    changeConnectionString: (connectionString) => changeConnectionString(connectionString),
};
module.exports = functions;

const fs = require('fs');
const io = require('socket.io-client');
const updateInterval = 1000;
const graphInterval = 60000;
const constDeviceUpdateInterval = 60000;
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

let connectionString = "http://localhost:3000/device";
setTimeout(function () {
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
}, 50);

function changeConnectionString(cs) {
    connectionString = cs;
}


function getLocalDeviceInfo() {
    let idRawData = fs.readFileSync('DeviceId.json');
    let infoRawData = fs.readFileSync('DeviceInfo.json');

    let idDataObject = JSON.parse(idRawData);
    let infoDataObject = JSON.parse(infoRawData);

    deviceInfo = infoDataObject;
    deviceInfo.state = null;
    deviceInfo.isConnected = false;
    deviceInfo.serverMessage = null;
    deviceInfo.onDisconnect = false;
    deviceInfo.graphIndex = 0;
    deviceInfo.programs = [
        {
            pointArray: [
                0,
                750,
                1500,
                2250,
                3000,
                Infinity
            ]
        }
    ]
    setDeviceId(idDataObject.Id);
}

function startEnergyUsageInterval(waterHeater) {
    energyUsageInterval = setInterval(function () {
        setEnergyUsage(waterHeater);
        }, graphInterval);
}

function setEnergyUsage(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;
    if (waterHeater.programs[0].pointArray[waterHeater.graphIndex + 1] !== Infinity) {
        waterHeater.graphIndex++;
    }
    uniqueProperties.currentPower = waterHeater.programs[0].pointArray[waterHeater.graphIndex];
}

function stopEnergyUsageInterval(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;
    clearInterval(energyUsageInterval);
    waterHeater.graphIndex = 0;
    uniqueProperties.currentPower = 0;
}

function getCurrentPower(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;
    console.log(uniqueProperties.currentPower);
}

function setDeviceId(Id) {
    deviceInfo.Id = Id;

    let idObject = {
        Id: Id
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
        waterHeater.state = "on";
        waterHeaterOn(waterHeater);
    } else {
        waterHeater.state = "off";
        waterHeaterOff(waterHeater);
    }
}

function checkState(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;

    if (uniqueProperties.currentTemp > uniqueProperties.maxTemp) {
        changeStateToOff(waterHeater);
    } else if (waterHeater.isConnected === false &&
        uniqueProperties.currentTemp > uniqueProperties.minTemp &&
        waterHeater.state === "on") {
        changeStateToOff(waterHeater);
    } else if (uniqueProperties.currentTemp <= uniqueProperties.minTemp &&
        waterHeater.state === "off") {
        changeStateToOn(waterHeater);
    } else if (waterHeater.isConnected === true &&
        waterHeater.serverMessage === "off" &&
        waterHeater.state === "on") {
        console.log("Server told me to off");
        changeStateToOff(waterHeater);
        waterHeater.serverMessage = null;
    } else if (waterHeater.isConnected === true &&
        waterHeater.serverMessage === "on" &&
        waterHeater.state === "off") {
        console.log("Server told me to on");
        changeStateToOn(waterHeater);
        waterHeater.serverMessage = null;
    } else if (waterHeater.onDisconnect === true &&
        waterHeater.state === "on") {
        changeStateToOff(waterHeater);
        waterHeater.serverMessage = null;
    }
}

function changeStateToOff(waterHeater) {
    waterHeater.onDisconnect = false;
    clearInterval(waterHeaterOnInterval);
    waterHeaterOff(waterHeater);
    waterHeater.state = "off";

    if (socket.connected === true) {
        socket.emit("stateChanged", waterHeater.state, waterHeater.Id);
    }
}

function changeStateToOn(waterHeater) {
    clearInterval(waterHeaterOffInterval);
    waterHeaterOn(waterHeater);
    waterHeater.state = "on";

    if (socket.connected === true) {
        socket.emit("stateChanged", waterHeater.state, waterHeater.Id);
    }
}

function waterHeaterOn(waterHeater) {
    startEnergyUsageInterval(waterHeater);
    waterHeaterOnInterval = setInterval(() => {
        setWaterHeaterOn(waterHeater);
    }, updateInterval);
}

function setWaterHeaterOn(waterHeater){
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

// Connection
function connectionSetup() {
    socket.on('connect', function() {
        console.log('Connected to localhost:3000');
        deviceInfo.isConnected = true;

        socket.on('askForId', function() {
            socket.emit('receiveDeviceId', deviceInfo.Id);
        });

        socket.on('setId', function(Id) {
            setDeviceId(Id);
            socket.emit('newDeviceWithId', deviceInfo);
        });

        socket.on('on', function() {
            deviceInfo.serverMessage = "on";
        });

        socket.on('off', function() {
            deviceInfo.serverMessage = "off";
        });

        deviceUpdateInterval = setInterval(function () {
            socket.emit('deviceUpdate', deviceInfo);
        }, constDeviceUpdateInterval);
    });

    socket.on('disconnect', function() {
        console.log('Lost connection with localhost:3000');
        deviceInfo.isConnected = false;
        clearInterval(deviceUpdateInterval);
    });
}
