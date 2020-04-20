'use strict';

const fs = require('fs');
const updateInterval = 1;
const tempGainPrSecond = 0.0033;
const tempLossPrSecond = 0.0017;

let deviceInfo = {};
let waterHeaterOnInterval;
let waterHeaterOffInterval;

const functions = {
    testSetup: () => testSetup(),
    getDeviceInfo: () => getDeviceInfo(),
    setDeviceId: (id) => setDeviceId(id),
    changeStateToOff: () => changeStateToOff(),
    changeStateToOn: () => changeStateToOn(),

};
module.exports = functions;

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
//console.log(deviceInfo);
setDeviceId('10222P1-11');
//console.log(deviceInfo);

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

initCurrentTemp();
initState();

//console.log(deviceInfo.state);

let updater = setInterval(() => {
    checkState();
    //console.log(deviceInfo.state);
    //console.log(deviceInfo.uniqueProperties.currentTemp);
}, updateInterval);

function checkState() {
    let uniqueProperties = deviceInfo.uniqueProperties;

    if (deviceInfo.isConnected === false &&
        uniqueProperties.currentTemp > uniqueProperties.minTemp &&
        deviceInfo.state === "On") {
        changeStateToOff();
    } else if (uniqueProperties.currentTemp <= uniqueProperties.minTemp &&
        deviceInfo.state === "Off") {
        changeStateToOn();
    } else if (deviceInfo.isConnected === true &&
        deviceInfo.serverMessage === "Off" &&
        deviceInfo.state === "On") {
        changeStateToOff();
    } else if (deviceInfo.isConnected === true &&
        deviceInfo.serverMessage === "On" &&
        deviceInfo.state === "Off") {
        changeStateToOn();
    } else if (deviceInfo.onDisconnect === true &&
        deviceInfo.state === "On") {
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

/*
    TESTING ONLY
*/

function testSetup() {
    clearInterval(updater);
}

function getDeviceInfo() {
    return deviceInfo;
}