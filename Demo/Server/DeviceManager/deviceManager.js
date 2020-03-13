let appData = require('../Core/DeviceStorage.js')

const functions = {
  add: (waterHeater) => add(waterHeater),
  remove: (waterHeater) => remove(waterHeater),
  schedule: (waterHeater) => schedule(waterHeater),
  doActions: (waterHeater) => doActions(waterHeater),
  startConstantInfoFrom: (device) => startConstantInfoFrom(device),
  stopConstantInfoFrom: (device) => stopConstantInfoFrom(device),
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
  for (var i = 0; i < appData.getAmountOfDevices(); i++) {
    let device = appData.getDevice(i);
    if (device != undefined) {
      update(device);
    }
  }
}, 1000);

function update(device) {
  console.log(appData.getStrippedVersionOfDevice(device));
  if (device.constantUpdates == undefined || !device.constantUpdates) {
    startConstantInfoFrom(device);
  } else if (device.constantUpdates) {
    retriveConstUpdate(device);
  }
  if (device.timeOn == undefined && device.timeOff == undefined) {
    updateDeviceInfo(device, "schedule");
  }
  doActions(device);
}

function retriveConstUpdate(device) {
  if (device.socket != undefined)
    device.socket.emit('constantUpdates', appData.getStrippedVersionOfDevice(device))
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
  if (device.socket != undefined) {
    device.socket.emit('updateInfo', command, appData.getStrippedVersionOfDevice(device));
  }
}

function doActions(device) {
  turnOnOff(device)
}

function turnOnOff(device) {
  let date = new Date();
  if (device.timeOn !== undefined && device.state != state.ON) {
    let on = new Date(device.timeOn);
    if (on <= date) {
      turnOnDevice(device);
    }
  } else if (device.timeOff !== undefined && device.state != state.OFF) {
    let off = new Date(device.timeOff);
    if (off <= date) {
      turnOffDevice(device);
    }
  }
}

function turnOnDevice(device) {
  console.log("Turning on device: " + device.id);
  device.state = state.ON;
  device.timeOn = undefined;
  if (device.socket != undefined) {
    device.socket.emit('command', "turnOn");
  } else {
    console.log("Could not send message");
  }
}

function turnOffDevice(device) {
  console.log("Turning off device: " + device.id);
  device.state = state.OFF;
  device.timeOff = undefined;
  if (device.socket != undefined) {
    device.socket.emit('command', "turnOff");
  } else {
    console.log("Could not send message");
  }
}

function notifyWaterHeater(device) {
  if (device.socket != undefined) {
    device.socket.emit('command', "turnOn");
  } else
    console.log("No socket to send command on");
}

function startConstantInfoFrom(device) {
  console.log("Starting Const update on: " + device.id);
  if (device.socket == undefined)
    return;

  device.constantUpdates = true;
}

function stopConstantInfoFrom(device) {
  if (device.socket == undefined)
    return;

  device.constantUpdates = false;
}

module.exports = functions;