const functions = {
  update: (waterHeater, _deltaTime) => update(waterHeater, _deltaTime),
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

function update(waterHeater, _deltaTime) {

}

function updateTemp(waterHeater, _deltaTime) {

}

function updateState(waterHeater, state) {

}

function notifyServer(waterHeater) {

}

module.exports = functions;