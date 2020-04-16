'use strict';
const mongoose = require('mongoose');

let Device;
let Graph;

run().catch(error => console.log(error.stack));

async function run() {
    await mongoose.connect('mongodb://localhost:27017/P2', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    generateModels();
}

async function dropDatabase() {
    // Clear the database every time. This is for the sake of example only,
    // don't do this in prod :)
    await mongoose.connection.dropDatabase();
}

async function generateModels() {
    let deviceSchema = new mongoose.Schema({
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
    Device = mongoose.model("Devices", deviceSchema);
    console.log("Device Model created");

    let graphSchema = new mongoose.Schema({
        id: String,
        values: String
    });
    Graph = mongoose.model("Graphs", graphSchema);
    console.log("Graph Model created");

    // TODO: Remove dropDatabase
    dropDatabase();
    createDevice(createDevicePrototype());
    createGraph(createGraphPrototype());
}

/*
    Interface Functions
*/

async function createDevice(device) {
    let serilizedDevice = serializeDevice(device);
    const deviceModel = new Device({
        scheduledByUser: serilizedDevice.scheduledByUser,
        isScheduled: serilizedDevice.isScheduled,
        nextState: serilizedDevice.nextState,
        scheduled: serilizedDevice.scheduled,
        scheduledInterval: serilizedDevice.scheduledInterval,

        // From Device
        deviceID: serilizedDevice.deviceID,
        isAutomatic: serilizedDevice.isAutomatic,
        currentPower: serilizedDevice.currentPower,
        currentState: serilizedDevice.currentState,
        deviceType: serilizedDevice.deviceType,
        isConnected: serilizedDevice.isConnected,
        programs: serilizedDevice.programs,
        uniqueProperties: serilizedDevice.uniqueProperties
    });
    deviceModel.save((saveError, savedUser) => {
        if (saveError)
            console.log(saveError);
    });
}

async function getDevice(id) {

}

async function deleteDevice(id) {

}

async function updateDevice(id, field, value) {

}

async function createGraph(graph) {
    let serilizedGraph = serilizeGraph(graph);
    const graphModel = new Graph({
        id: graph.id,
        values: graph.values
    });
    graphModel.save((saveError, savedUser) => {
        if (saveError)
            console.log(saveError);
    });

}

async function getGraph(id) {

}

async function appendToGraph(id, startIndex, values) {

}

async function removePartOfGraph(id, startIndex, amount) {

}

/*
    Helper Functions
*/

function serializeDevice(device) {
    device.programs = JSON.stringify(device.programs);
    device.uniqueProperties = JSON.stringify(device.uniqueProperties);
    return device;
}

function serilizeGraph(graph) {
    graph.values = JSON.stringify(graph.values);
    return graph;
}

const functions = {
    createDevice: (device) => createDevice(device),
    getDevice: (id) => getDevice(id),
    deleteDevice: (id) => deleteDevice(id),
    updateDevice: (id, field, value) => updateDevice(id, field, value),
    createGraph: (graph) => createGraph(graph),
    getGraph: (id) => getGraph(id),
    updateGraph: (id, statIndex, values) => updateGraph(id, statIndex, values),
    appendToGraph: (id, statIndex, values) => updateGraph(id, statIndex, values),
    removePartOfGraph: (id, statIndex, amount) => removePartOfGraph(id, statIndex, amount),
}
module.exports = functions;

/*
    TODO: Remove
          For testing only
*/

function createDevicePrototype() {
    let program0 = {
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
    };

    let program1 = {
        graph: [
            10,
            10,
            10,
        ]
    };

    let waterHeaterPrograms = [
        program0,
        program1
    ];

    let waterHeaterProps = [{
            temp: 60
        },
        {
            mintemp: 55
        },
        {
            maxtemp: 80
        }
    ];

    let scheduleInterval = {
        start: new Date(0),
        end: new Date(100000)
    }
    let schedule = {
        start: new Date(100),
        end: new Date(1000)
    }

    let deviceWaterHeater1 = {
        deviceID: "id",
        isAutomatic: Boolean(false),
        currentPower: 132,
        currentState: "Off",
        deviceType: "Water Heater",
        isConnected: Boolean(true),
        programs: waterHeaterPrograms,
        uniqueProperties: waterHeaterProps
    };

    return deviceWaterHeater1;
}

// Graphs
function createGraphPrototype() {
    let values = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    ];

    let graph = {
        id: "id",
        values: values
    };
    return graph;
}