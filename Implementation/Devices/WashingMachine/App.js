'use strict';

const fs = require('fs');

let deviceInfo = {};

function getLocalDeviceInfo() {
    let idRawData = fs.readFileSync('DeviceId.json');
    let infoRawData = fs.readFileSync('DeviceInfo.json');

    let idDataObject = JSON.parse(idRawData);
    let infoDataObject = JSON.parse(infoRawData);

    infoDataObject.id = idDataObject.id;

    deviceInfo = infoDataObject;
}

getLocalDeviceInfo();
console.log(deviceInfo);

console.log(deviceInfo.isAutomatic);
