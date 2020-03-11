let knownDevices = new Array();

const appData = {
  addDevice: (device) => addDevice(device),
  containsDevice: (id) => containsDevice(id),
  removeConnection: (socket) => removeConnection(socket),
  updateDevice: (device) => updateDevice(device),
  getDevice: (id) => getDevice(id),
  getAmountOfDevices: () => getAmountOfDevices(),
}

function removeConnection(socket) {
  let device = knownDevices.find((device) => device.socket == socket, socket);

  if (device != undefined) {

    console.log("Disconnecting id: " + device.id);
    device.socket = undefined;
  } else
    console.log("Could not find socket to remove");

  console.log(knownDevices.length);
}

function containsConnection(id) {
  for (var i = 0; i < activeConnections.length; i++) {
    if (activeConnections[i].id == id)
      return true;
  }
  return false;
}

function getAmountOfDevices() {
  return knownDevices.length;
}

function getDevice(id) {
  return knownDevices[getIndexOf(id)];
}

function getIndexOf(id) {
  for (var i = 0; i < knownDevices.length; i++) {
    if (knownDevices[i].id == id)
      return i;
  }
}

function containsDevice(id) {
  for (var i = 0; i < knownDevices.length; i++) {
    if (knownDevices[i].id == id)
      return true;
  }
  return false;
}

function addDevice(device) {
  knownDevices.push(device);
  console.log("Number of connected devices: " + knownDevices.length);
  console.log(knownDevices);
}

function removeDevice() {

}

function updateDevice(device) {
  let index = getIndexOf(device.id);
  device.socket = knownDevices[index].socket;
  console.log("index: " + index + " socket: " + device.socket);
  knownDevices[index] = device;
}

module.exports = appData;