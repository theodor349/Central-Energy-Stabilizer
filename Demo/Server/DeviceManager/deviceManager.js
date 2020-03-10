const functions = {
  add: (waterHeater) => add(waterHeater),
  remove: (waterHeater) => remove(waterHeater),
  schedule: (waterHeater) => schedule(waterHeater),
  doActions: (waterHeater) => doActions(waterHeater),
}

let nextId = 0;
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

let waterHeater = undefined;



function add(waterHeater) {
  waterHeater.id = nextId;
  nextId++;
  waterHeater = waterHeater;
}

function remove(waterHeater) {
  waterHeater = undefined;
}

function update(waterHeater) {
  if (waterHeater.timeOn == undefined && waterHeater.timeOff == undefined)
    schedule(waterHeater);
  doActions(waterHeater);
}

function schedule(waterHeater) {
  let date = new Date();
  date.setMinutes(date.getMinutes() + 1);
  waterHeater.timeOn = date;

  date.setMinutes(date.getMinutes() + 2);
}

function doActions(waterHeater) {
  let date = new Date();
  if (waterHeater.timeOn != undefined) {
    if (waterHeater.timeOn >= date)
      console.log("Turn on");
  } else if (waterHeater.timeOff != undefined) {
    if (waterHeater.timeOff >= date)
      console.log("Turn off");
  }
}


module.exports = functions;