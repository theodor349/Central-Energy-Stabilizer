const functions = {
  update: () => update(),
  updateTemp: () => updateTemp(),
  updateState: (state) => updateState(state),
  checkTemp: () => checkTemp(),
  notifyServer: () => notifyServer(),
  makeWaterHeater: (waterHeater) => makeWaterHeater(waterHeater),
  getDeviceObject: (waterHeater) => getDeviceObject(waterHeater),
  setId: (id) => setId(id),
  getId: () => getId(),
  setSocket: (socket) => setSocket(socket),
}

const state = {
  OFF: 0,
  KEEP_TEMP: 1,
  ON: 2,
}

const deltaTime = 1;

let socket = undefined;
let myWaterHeater = {
  type: "WaterHeater",
  currentTemp: 55, // Current temperature
  lowerLimit: 55, // When under it should start
  upperLimit: 85, // When abow it turns off
  maxEffect: 1000, // Watts
  state: state.KEEP_TEMP, // 0 = off, 1 = KEEP_TEMP, 2 = full power
}

const timer = setInterval(function() {
  update();
  console.log("Current Temperature: " + myWaterHeater.currentTemp + "C");
}, 1000);

function setSocket(_socket) {
  socket = _socket;
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

  //checkTemp();
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

function getDeviceObject(device) {
  if (device == undefined) {
    return myWaterHeater;
  }

  device.type = myWaterHeater.type;
  device.currentTemp = myWaterHeater.currentTemp;
  device.lowerLimit = myWaterHeater.lowerLimit;
  device.upperLimit = myWaterHeater.upperLimit;
  device.maxEffect = myWaterHeater.maxEffect;
  device.state = myWaterHeater.state;
  return device;
}

function updateState(state) {
  myWaterHeater.state = state;
}

function notifyServer() {}

function setId(id) {
  myWaterHeater.id = id;
}

function getId() {
  return waterHeater.id;
}

module.exports = functions;