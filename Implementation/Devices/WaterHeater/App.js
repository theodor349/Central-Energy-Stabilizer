'use strict';

const functions = {
    // functions for testing
    testSetup: () => testSetup(),
    getDeviceInfo: () => getDeviceInfo(),
    setDeviceId: (id) => setDeviceId(id),
    changeStateToOff: () => changeStateToOff(),
    changeStateToOn: () => changeStateToOn(),

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
initState();


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

function initState() {
    let uniqueProperties = deviceInfo.uniqueProperties;
    if (uniqueProperties.currentTemp < uniqueProperties.minTemp) {
        deviceInfo.state = "On";
        waterHeaterOn();
    } else {
        deviceInfo.state = "Off";
        waterHeaterOff();
    }
}



let updater = setInterval(() => {
    checkState(deviceInfo);
}, updateInterval);

function checkState(waterheater) {

    let uniqueProperties = waterheater.uniqueProperties;

    if (waterheater.isConnected === false &&
        uniqueProperties.currentTemp > uniqueProperties.minTemp &&
        waterheater.state === "On") {
        changeStateToOff();
    } else if (uniqueProperties.currentTemp <= uniqueProperties.minTemp &&
        waterheater.state === "Off") {
        changeStateToOn();
    } else if (waterheater.isConnected === true &&
        waterheater.serverMessage === "Off" &&
        waterheater.state === "On") {
        changeStateToOff();
    } else if (waterheater.isConnected === true &&
        waterheater.serverMessage === "On" &&
        waterheater.state === "Off") {
        changeStateToOn();
    } else if (waterheater.onDisconnect === true &&
        waterheater.state === "On") {
        changeStateToOff();
    }
}

function changeStateToOff() {
    deviceInfo.onDisconnect = false;

    clearInterval(waterHeaterOnInterval);
    waterHeaterOff();
    deviceInfo.state = "Off";
}

function changeStateToOn() {
    clearInterval(waterHeaterOffInterval);
    waterHeaterOn();
    deviceInfo.state = "On";
}

function waterHeaterOn() {
    let uniqueProperties = deviceInfo.uniqueProperties;
    waterHeaterOnInterval = setInterval(() => {
        uniqueProperties.currentTemp += tempGainPrSecond;
    }, updateInterval);
}

function waterHeaterOff() {
    let uniqueProperties = deviceInfo.uniqueProperties;
    waterHeaterOffInterval = setInterval(() => {
        uniqueProperties.currentTemp -= tempLossPrSecond;
    }, updateInterval);
}