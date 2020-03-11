// const connection = require('./WaterHeaterConnection.js');
const fs = require('fs');

const functions = {
  update: () => update(),
  updateTemp: () => updateTemp(),
  updateState: (state) => updateState(state),
  checkTemp: () => checkTemp(),
  notifyServer: () => notifyServer(),
  makeWaterHeater: (waterHeater) => makeWaterHeater(waterHeater),
  getDeviceObject: () => getDeviceObject(),
}

const state = {
  OFF: 0,
  KEEP_TEMP: 1,
  ON: 2,
}

const deltaTime = 1;

let myWaterHeater = {
  type: "WaterHeater",
  currentTemp: 55, // Current temperature
  lowerLimit: 55, // When under it should start
  upperLimit: 85, // When abow it turns off
  maxEffect: 1000, // Watts
  state: state.ON, // 0 = off, 1 = KEEP_TEMP, 2 = full power
}

function makeWaterHeater(_waterHeater) {
  myWaterHeater = _waterHeater;
}

function update() {
  updateTemp(myWaterHeater);
}

function updateTemp() {
  switch (myWaterHeater.state) {
    case state.OFF:
      myWaterHeater.currentTemp -= 1 * deltaTime;
      break;
    case state.ON:
      myWaterHeater.currentTemp += 1 * deltaTime;
      break;
    default:
  }

  checkTemp();
}

function checkTemp() {
  let currTemp = myWaterHeater.currentTemp;
  let lowerLimit = myWaterHeater.lowerLimit;
  let upperLimit = myWaterHeater.upperLimit;
  let currState = myWaterHeater.state;

  if (currTemp < lowerLimit && currState != state.ON)
    updateState(state.ON);
  else if (currTemp == lowerLimit && currState != state.KEEP_TEMP)
    updateState(state.KEEP_TEMP);
  else if (currTemp > upperLimit && currState != state.OFF)
    updateState(state.OFF);
  else if (currTemp == upperLimit && currState != state.KEEP_TEMP)
    updateState(state.KEEP_TEMP);
}

function getDeviceObject() {
  return myWaterHeater;
}

function updateState(state) {
  myWaterHeater.state = state;
  notifyServer(myWaterHeater);
}

function notifyServer() {
  console.log("State changed to: " + myWaterHeater.state);
}

module.exports = functions;