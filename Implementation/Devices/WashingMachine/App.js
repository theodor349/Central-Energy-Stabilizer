'use strict';

const fs = require('fs');
const updateInterval = 1000;

let deviceInfo = {};

function getLocalDeviceInfo() {
    let idRawData = fs.readFileSync('DeviceId.json');
    let infoRawData = fs.readFileSync('DeviceInfo.json');

    let idDataObject = JSON.parse(idRawData);
    let infoDataObject = JSON.parse(infoRawData);

    deviceInfo = infoDataObject;
    deviceInfo.state = null;
    deviceInfo.isConnected = false;

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
setDeviceId('10222P1-12');
console.log(deviceInfo);

// Unique function for washing machine
setInterval(() => {
    checkState();

}, updateInterval);

function checkState() {
    let uniqueProperties = deviceInfo.uniqueProperties;

    if () {

        deviceInfo.state = "Off";
    }
    if (uniqueProperties.currentTemp <= uniqueProperties.minTemp) {
        deviceInfo.state = "Heating";
    }
}
