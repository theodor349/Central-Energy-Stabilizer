const mongoose = require('mongoose');

run().catch(error => console.log(error.stack));

async function run() {
  await mongoose.connect('mongodb://localhost:27017/P2', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Clear the database every time. This is for the sake of example only,
  // don't do this in prod :)
  //await mongoose.connection.dropDatabase();

  generateModels();
}

async function generateModels() {
  var deviceSchema = new mongoose.Schema({
    scheduledByUser: Boolean,
    isScheduled: Boolean,
    nextState: String,
    scheduled: String,
    scheduledInterval: String,

    // From Device
    deviceID: String,
    isAutomatic: Boolean,
    currentPower: Number,
    currentState: String,
    deviceType: String,
    isConnected: Boolean,
    programs: String,
    uniqueProperties: String
  });
  var devices = mongoose.model("Devices", deviceSchema);
  console.log("Model created");

  await devices.create(SerializeDevice(createDevice()));

  var res = await devices.find({
    DeviceID: "id"
  });
  console.log(res);
}

const functions = {
  createDevice: (device) => createDevice(device),
  getDevice: (id) => getDevice(id),
  deleteDevice: (id) => deleteDevice(id),
  updateDevice: (id, field, value) => updateDevice(id, field, value),
  createGraph: (id) => createGraph,
  getGraph: (id) => getGraph(id),
  updateGraph: (id, statIndex, values) => updateGraph(id, statIndex, values),
  appendToGraph: (id, statIndex, values) => updateGraph(id, statIndex, values),
  removePartOfGraph: (id, statIndex, amount) => removePartOfGraph(id, statIndex, amount),
}
module.exports = functions;

function SerializeDevice(device) {
  device.programs = JSON.stringify(device.programs);
  device.uniqueProperties = JSON.stringify(device.uniqueProperties);
  return device;
}

function createDevice() {
  var watherHeahterPrograms = [
    program0 = {
      graph: [
        1,
        5,
        10,
        10,
        20,
        20,
        10,
        5,
        1,
      ]
    },
    program1 = {
      graph: [
        10,
        10,
        10,
      ]
    }
  ];

  var waterHeaterProps = [{
      temp: 60
    },
    {
      mintemp: 55
    },
    {
      maxtemp: 80
    }
  ];

  var scheduleInterval = {
    start: new Date(0),
    end: new Date(100000)
  }
  var schedule = {
    start: new Date(100),
    end: new Date(1000)
  }

  var deviceWaterHeater1 = {
    deviceID: "id",
    isAutomatic: Boolean(false),
    currentPower: 132,
    currentState: "Off",
    deviceType: "Water Heater",
    isConnected: Boolean(true),
    programs: watherHeahterPrograms,
    uniqueProperties: waterHeaterProps
  };

  return deviceWaterHeater1;
}