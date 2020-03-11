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

let nextId = 0;
let devices = new Array();

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

//add(testerWaterHeater);
//const timer = setInterval(function() {
//  for (var i = 0; i < devices.length; i++) {
//    updateLoop(devices[i]);
//  }
//}, 1000);

function updateLoop(device) {
  if (device.timeOn == undefined && device.timeOff == undefined)
    schedule(device);
  doActions(device);
}

function schedule(device) {
  updateDeviceInfo(device);

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

function updateDeviceInfo(device) {}

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