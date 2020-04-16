'use strict';

const fs = require('fs');
const updateInterval = 1000;
const tempGainPrSecond = 0.0033;
const tempLossPrSecond = 0.0017;

let deviceInfo = {};

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

getLocalDeviceInfo();
console.log(deviceInfo);
setDeviceId('10222P1-11');
console.log(deviceInfo);

// Unique function for water heater
setInterval(() => {
    checkState();

}, updateInterval);

function checkState() {
    let uniqueProperties = deviceInfo.uniqueProperties;

    if (deviceInfo.isConnected === false &&
        uniqueProperties.currentTemp < uniqueProperties.minTemp &&
        deviceInfo.state === "On") {
        changeStateToOff();
    }
    else if (uniqueProperties.currentTemp <= uniqueProperties.minTemp &&
            deviceInfo.state === "Off") {
        changeStateToOn();
    }
    else if (deviceInfo.isConnected === true &&
            deviceInfo.serverMessage === "Off" &&
            deviceInfo.state === "On") {
        changeStateToOff();
    }
    else if (deviceInfo.isConnected === true &&
            deviceInfo.serverMessage === "On" &&
            deviceInfo.state === "Off") {
        changeStateToOn();
    }
    else if (deviceInfo.onDisconnect === true &&
            deviceInfo.state === "On") {
        changeStateToOff();
    }
}

let waterHeaterOn = setInterval(() => {
    deviceInfo.currentTemp += tempGainPrSecond;
}, updateInterval);

let waterHeaterOff = setInterval(() => {
    deviceInfo.currentTemp -= tempLossPrSecond;
}, updateInterval);

function changeStateToOff() {
    deviceInfo.onDisconnect = false;

    clearInterval(waterHeaterOn);
    waterHeaterOff();
    deviceInfo.state = "Off";
}

function changeStateToOn() {
    clearInterval(waterHeaterOff);
    waterHeaterOn();
    deviceInfo.state = "On";
}
