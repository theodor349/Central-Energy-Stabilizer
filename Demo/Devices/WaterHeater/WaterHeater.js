const _progress = require('cli-progress');

const functions = {
  update: (waterHeater) => update(waterHeater),
  updateTemp: (waterHeater) => updateTemp(waterHeater),
  updateState: (waterHeater, state) => updateState(waterHeater, state),
  checkTemp: (waterHeater) => checkTemp(waterHeater),
  notifyServer: (waterHeater) => waterHeater,
}

let testerWaterHeater = {
  currentTemp: 55, // Current temperature
  lowerLimit: 55, // When under it should start
  upperLimit: 85, // When abow it turns off
  effect: 1000, // Watts
  state: 1, // 0 = off, 1 = standby, 2 = full power
}

let progressBar = new _progress.Bar();
progressBar.Start(100, 0);
update(testerWaterHeater);

function update(waterHeater) {
  updateTemp(waterHeater);
  updateProgressBar(waterHeater);
}

function updateProgressBar(waterHeater) {
  progressBar
}

function updateTemp(waterHeater) {
  let deltaTime = 1;
  switch (waterHeater.state) {
    case 0:
      waterHeater.currentTemp -= 1 * deltaTime;
      break;
    case 2:
      waterHeater.currentTemp += 1 * deltaTime;
      break;
    default:
  }

  checkTemp(waterHeater);
}

function checkTemp(waterHeater) {
  if (waterHeater.currentTemp < waterHeater.lowerLimit)
    updateState(waterHeater, 2);
  else if (waterHeater.currentTemp == waterHeater.lowerLimit)
    updateState(waterHeater, 1);
  else if (waterHeater.currentTemp > waterHeater.upperLimit)
    updateState(waterHeater, 0);
  else if (waterHeater.currentTemp == waterHeater.upperLimit)
    updateState(waterHeater, 1);
}

function updateState(waterHeater, state) {
  waterHeater.state = state;
  notifyServer(waterHeater);
}

function notifyServer(waterHeater) {
  console.log("State changed to: " + waterHeater.state);
}

module.exports = functions;