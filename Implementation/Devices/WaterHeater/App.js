'use strict';

const functions = {
    // functions for testing
    testSetup: () => testSetup(),
    getDeviceInfo: () => getDeviceInfo(),
    setDeviceId: (id) => setDeviceId(id),
    changeStateToOff: (waterheater) => changeStateToOff(waterheater),
    changeStateToOn: (waterheater) => changeStateToOn(waterheater),
    checkState: (waterheater) => checkState(waterheater),
    waterHeaterOn: (waterheater) => waterHeaterOn(waterheater),
    waterHeaterOff: (waterheater) => waterHeaterOff(waterheater),
};
module.exports = functions;

const fs = require('fs');
const updateInterval = 1;
const tempGainPrSecond = 0.0033;
const tempLossPrSecond = 0.0017;

let deviceInfo = {};
let waterHeaterOnInterval;
let waterHeaterOffInterval;

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

    setDeviceId(idDataObject.id);
}

function setDeviceId(id) {
    deviceInfo.id = id;

    let idObject = {
        id: id
    }

    let idJsonObject = JSON.stringify(idObject);

    fs.writeFileSync('DeviceId.json', idJsonObject);
}



// Unique function for water heater
// Due to the lack of sensors, we assume the waterheater to be 0 degrees on startup
function initCurrentTemp() {
    let uniqueProperties = deviceInfo.uniqueProperties;
    if (uniqueProperties.currentTemp === null) {
        uniqueProperties.currentTemp = 0;
    }
}

function initState(waterheater) {
    let uniqueProperties = waterheater.uniqueProperties;
    if (uniqueProperties.currentTemp < uniqueProperties.minTemp) {
        waterheater.state = "On";
        waterHeaterOn(waterheater);
    } else {
        waterheater.state = "Off";
        waterHeaterOff(waterheater);
    }
}

let updater = setInterval(() => {
    //checkState(deviceInfo);
}, updateInterval);

function checkState(waterheater) {
    let uniqueProperties = waterheater.uniqueProperties;

    if (uniqueProperties.currentTemp > uniqueProperties.maxTemp) {
        changeStateToOff(waterheater);
    } else if (waterheater.isConnected === false &&
        uniqueProperties.currentTemp > uniqueProperties.minTemp &&
        waterheater.state === "On") {
        changeStateToOff(waterheater);
    } else if (uniqueProperties.currentTemp <= uniqueProperties.minTemp &&
        waterheater.state === "Off") {
        changeStateToOn(waterheater);
    } else if (waterheater.isConnected === true &&
        waterheater.serverMessage === "Off" &&
        waterheater.state === "On") {
        changeStateToOff(waterheater);
    } else if (waterheater.isConnected === true &&
        waterheater.serverMessage === "On" &&
        waterheater.state === "Off") {
        changeStateToOn(waterheater);
    } else if (waterheater.onDisconnect === true &&
        waterheater.state === "On") {
        changeStateToOff(waterheater);
    }
}

function changeStateToOff(waterheater) {
    waterheater.onDisconnect = false;

    clearInterval(waterHeaterOnInterval);
    waterHeaterOff(waterheater);
    waterheater.state = "Off";
}

function changeStateToOn(waterheater) {
    clearInterval(waterHeaterOffInterval);
    waterHeaterOn(waterheater);
    waterheater.state = "On";
}

function waterHeaterOn(waterheater) {
    let uniqueProperties = waterheater.uniqueProperties;
    waterHeaterOnInterval = setInterval(() => {
        uniqueProperties.currentTemp += tempGainPrSecond;
    }, updateInterval);
}

function waterHeaterOff(waterheater) {
    let uniqueProperties = waterheater.uniqueProperties;
    waterHeaterOffInterval = setInterval(() => {
        uniqueProperties.currentTemp -= tempLossPrSecond;
    }, updateInterval);
}