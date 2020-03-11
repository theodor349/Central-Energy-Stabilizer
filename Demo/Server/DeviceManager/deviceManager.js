let appData = require('../Core/DeviceStorage.js')

const functions = {
  add: (waterHeater) => add(waterHeater),
  remove: (waterHeater) => remove(waterHeater),
  schedule: (waterHeater) => schedule(waterHeater),
  doActions: (waterHeater) => doActions(waterHeater),
}

const state = {
  OFF: 0,
  STANDBY: 1,
  ON: 2,
}

let testerWaterHeater = {
  id: NaN, // ID
  currentTemp: 55, // Current temperature
  lowerLimit: 55, // When under it should start
  upperLimit: 85, // When abow it turns off
  effect: 1000, // Watts
  state: 1, // 0 = off, 1 = standby, 2 = full power
  timeOn: undefined,
  timeOff: undefined,
}

const timer = setInterval(function() {
  console.log("Updating devices");
  for (var i = 0; i < appData.getAmountOfDevices(); i++) {
    let device = appData.getDevice(i);
    if (device != undefined) {
      update(device);
    }
  }
}, 1000);

function update(device) {
  if (device.timeOn == undefined && device.timeOff == undefined)
    updateDeviceInfo(device, "schedule");
  doActions(device);
}

function schedule(device) {
  let date = new Date();
  date.setSeconds(date.getSeconds() + 5);
  device.timeOn = date;

  date = new Date();
  date.setSeconds(date.getSeconds() + 10);
  device.timeOff = date;

  console.log("Time to turn on " +
    device.timeOn.getHours() + ":" +
    device.timeOn.getMinutes() + ":" +
    device.timeOn.getSeconds());
  console.log("Time to turn off " +
    device.timeOff.getHours() + ":" +
    device.timeOff.getMinutes() + ":" +
    device.timeOff.getSeconds());
}

function updateDeviceInfo(device, command) {
  if (device.socket != undefined)
    device.socket.emit('updateInfo', command);
}

function doActions(device) {
  let date = new Date();
  if (device.timeOn !== undefined && device.state != state.ON) {
    if (device.timeOn <= date) {
      turnOnDevice(device);
    }
  } else if (device.timeOff !== undefined && device.state != state.OFF) {
    if (device.timeOff <= date) {
      turnOffDevice(device);
    }
  }
}

function turnOnDevice(device) {
  device.state = state.ON;
  notifyWaterHeater(device.state);
}

function turnOffDevice(device) {
  device.state = state.OFF;
  device.timeOn = undefined;
  device.timeOff = undefined;
  notifyWaterHeater(device.state);
}

function notifyWaterHeater(_state) {
  console.log("Commanding device to turn " + _state.toString());
}

module.exports = functions;