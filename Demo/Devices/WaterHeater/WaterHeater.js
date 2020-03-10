const functions = {
  update: (waterHeater) => update(waterHeater),
  updateTemp: (waterHeater) => updateTemp(waterHeater),
  updateState: (waterHeater, state) => updateState(waterHeater, state),
  notifyServer: (waterHeater) => waterHeater,
}

let waterHeater = {
  currentTemp: 55, // Current temperature
  lowerLimit: 55, // When under it should start
  upperLimit: 85, // When abow it turns off
  effect: 1000, // Watts
  state: 1, // 0 = off, 1 = standby, 2 = full power
}

function update(waterHeater) {
  updateTemp(waterHeater);
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

  if (waterHeater.currentTemp < 55)
    updateState(waterHeater, 2);
}

function updateState(waterHeater, state) {
  waterHeater.state = state;
  notifyServer(waterHeater);
}

function notifyServer(waterHeater) {
  console.log("State changed to: " + waterHeater.state);
}

module.exports = functions;