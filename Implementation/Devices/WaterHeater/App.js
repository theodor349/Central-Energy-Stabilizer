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
};
module.exports = functions;

const fs = require('fs');
const io = require('socket.io-client');
const updateInterval = 1000;
const graphInterval = 60000;
const tempGainPrSecond = 0.0033;
const tempLossPrSecond = 0.0017;


let deviceInfo = {};
let waterHeaterOnInterval;
let waterHeaterOffInterval;
let energyUsageInterval;

getLocalDeviceInfo();
initCurrentTemp();
initState(deviceInfo);

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
        uniqueProperties.currentTemp = 0;
    }
}

function initState(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;
    if (uniqueProperties.currentTemp < uniqueProperties.minTemp) {
        waterHeater.state = "On";
        waterHeaterOn(waterHeater);
    } else {
        waterHeater.state = "Off";
        waterHeaterOff(waterHeater);
    }
}

let updater = setInterval(() => {
    checkState(deviceInfo);
}, updateInterval);

function checkState(waterHeater) {
    let uniqueProperties = waterHeater.uniqueProperties;

    if (uniqueProperties.currentTemp > uniqueProperties.maxTemp) {
        changeStateToOff(waterHeater);
    } else if (waterHeater.isConnected === false &&
        uniqueProperties.currentTemp > uniqueProperties.minTemp &&
        waterHeater.state === "On") {
        changeStateToOff(waterHeater);
    } else if (uniqueProperties.currentTemp <= uniqueProperties.minTemp &&
        waterHeater.state === "Off") {
        changeStateToOn(waterHeater);
    } else if (waterHeater.isConnected === true &&
        waterHeater.serverMessage === "Off" &&
        waterHeater.state === "On") {
        changeStateToOff(waterHeater);
    } else if (waterHeater.isConnected === true &&
        waterHeater.serverMessage === "On" &&
        waterHeater.state === "Off") {
        changeStateToOn(waterHeater);
    } else if (waterHeater.onDisconnect === true &&
        waterHeater.state === "On") {
        changeStateToOff(waterHeater);
    }
}

function changeStateToOff(waterHeater) {
    waterHeater.onDisconnect = false;
    clearInterval(waterHeaterOnInterval);
    waterHeaterOff(waterHeater);
    waterHeater.state = "Off";
}

function changeStateToOn(waterHeater) {
    clearInterval(waterHeaterOffInterval);
    waterHeaterOn(waterHeater);
    waterHeater.state = "On";
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
let socket = io.connect("http://localhost:3000/device", {
    reconnection: true,
});

socket.on('connect', function() {
    console.log('Connected to localhost:3000');
    deviceInfo.isConnected = true;

    socket.on('askForId', function() {
        socket.emit('receiveDeviceId', deviceInfo.Id);
    });

});

socket.on('disconnect', function() {
    console.log('Lost connection with localhost:3000');

    deviceInfo.isConnected = false;
});
