let knownDevices = new Array();

const appData = {
  addDevice: (device) => addDevice(device)
}

function getDevice() {

}

function containsDevice() {

}

function addDevice(device) {
  knownDevices.push(device);
  console.log("Number of connected devices: " + knownDevices.length);
  console.log(knownDevices);
}

function removeDevice() {

}

module.exports = appData;