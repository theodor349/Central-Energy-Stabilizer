
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

function update(waterHeater) {
  updateTemp(waterHeater);
}

function updateTemp(waterHeater) {
  switch (waterHeater.state) {
    case state.OFF:
      waterHeater.currentTemp -= 1 * deltaTime;
      break;
    case state.ON:
      waterHeater.currentTemp += 1 * deltaTime;
      break;
    default:
  }

  checkTemp(waterHeater);
}

function checkTemp(waterHeater) {
  if (waterHeater.currentTemp < waterHeater.lowerLimit && waterHeater.state != state.ON)
    updateState(waterHeater, state.ON);
  else if (waterHeater.currentTemp == waterHeater.lowerLimit && waterHeater.state != state.STANDBY)
    updateState(waterHeater, state.STANDBY);
  else if (waterHeater.currentTemp > waterHeater.upperLimit && waterHeater.state != state.OFF)
    updateState(waterHeater, state.OFF);
  else if (waterHeater.currentTemp == waterHeater.upperLimit && waterHeater.state != state.STANDBY)
    updateState(waterHeater, state.STANDBY);
}

function updateState(waterHeater, state) {
  waterHeater.state = state;
  notifyServer(waterHeater);
}

function notifyServer(waterHeater) {
  console.log("State changed to: " + waterHeater.state);
}

module.exports = functions;
