'use strict';

const fs = require('fs');

let deviceInfo = {};

function getLocalDeviceInfo() {
    let idRawData = fs.readFileSync('DeviceId.json');
    let infoRawData = fs.readFileSync('DeviceInfo.json');

    let idDataObject = JSON.parse(idRawData);
    let infoDataObject = JSON.parse(infoRawData);

    deviceInfo = infoDataObject;

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