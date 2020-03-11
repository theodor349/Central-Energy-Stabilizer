let connection = require('./WaterHeaterConnection.js');

const functions = {
  update: (waterHeater) => update(waterHeater),
  updateTemp: (waterHeater) => updateTemp(waterHeater),
  updateState: (waterHeater, state) => updateState(waterHeater, state),
  checkTemp: (waterHeater) => checkTemp(waterHeater),
  notifyServer: (waterHeater) => waterHeater,
}

const state = {
  OFF: 0,
  STANDBY: 1,
  ON: 2,
}

const deltaTime = 1;

let testerWaterHeater = {
  currentTemp: 55, // Current temperature
  lowerLimit: 55, // When under it should start
  upperLimit: 85, // When abow it turns off
  effect: 1000, // Watts
  state: state.ON, // 0 = off, 1 = standby, 2 = full power
}

let myWaterHeater = undefined;

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
  else if (currTemp == lowerLimit && currState != state.STANDBY)
    updateState(state.STANDBY);
  else if (currTemp > upperLimit && currState != state.OFF)
    updateState(state.OFF);
  else if (currTemp == upperLimit && currState != state.STANDBY)
    updateState(state.STANDBY);
}

function getTemp() {
  return myWaterHeater.currentTemp;
}

function getDeviceInfo() {
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