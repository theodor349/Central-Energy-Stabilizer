const functions = {
  heatUp: () => heatUp(),

}

let waterHeater = {
  currentTemp: 55, // Current temperature
  lowerLimit: 55, // When under it should start
  upperLimit: 85, // When abow it turns off
  effect: 1000, // Watts
  state: 1, // 0 = off, 1 = standby, 2 = full power
}

function update(_deltaTime) {

}

function updateTemp(waterHeater, _deltaTime) {

}

function updateState(waterHeater) {

}

function notifyServer(waterHeater) {

}

module.exports = functions;