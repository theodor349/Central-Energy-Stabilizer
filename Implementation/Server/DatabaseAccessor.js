'use strict';
const mongoose = require('mongoose');

let Device = mongoose.model("Devices", new mongoose.Schema({
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
}));
let Graph = mongoose.model("Graphs", new mongoose.Schema({
    graphId: String,
    values: String
}));

/*
    SECTION: Setup Functions
*/

run('mongodb://localhost:27017/P2Test').catch(error => console.log(error.stack));
async function run(connectionString) {
    await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    test();
}

async function dropDatabase() {
    // Clear the database every time. This is for the sake of example only,
    // don't do this in prod :)
    await mongoose.connection.dropDatabase();
}

// TODO: Remove tests
function test() {
    dropDatabase();
    for (var i = 0; i < 100; i++) {
        createDevice(createDevicePrototype("id" + i));
    }

    setTimeout(function() {
        deleteDevice("id1");
    }, 1000);
    //    setTimeout(async function() {
    //        let res = await getDevice("id");
    //        console.log(res);
    //    }, 1000);
    createGraph(createGraphPrototype());
}

/*
    SECTION: Interface Functions
*/

const functions = {
    // For testing and deployment
    createDevice: (device) => createDevice(device),
    getDevice: (id) => getDevice(id),
    deleteDevice: (id) => deleteDevice(id),
    updateDevice: (id, field, value) => updateDevice(id, field, value),
    createGraph: (graph) => createGraph(graph),
    getGraph: (id) => getGraph(id),
    updateGraph: (id, statIndex, values) => updateGraph(id, statIndex, values),
    appendToGraph: (id, statIndex, values) => updateGraph(id, statIndex, values),
    removePartOfGraph: (id, statIndex, amount) => removePartOfGraph(id, statIndex, amount),
    dropDatabase: () => dropDatabase(),
}

module.exports = functions;

async function createDevice(device) {
    let serilizedDevice = serializeDevice(device);

    return new Promise((resolve, reject) => {
        let deviceModel;
        try {
            deviceModel = new Device({
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
        } catch (err) {
            reject(err);
        }

        deviceModel.save((saveError, savedUser) => {
            if (saveError) {
                reject(saveError);
            } else {
                resolve(savedUser);
            }
        });
    });
}

async function getDevice(id) {
    return new Promise((resolve, reject) => {
        try {
            Device.findOne({
                deviceID: id
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if (res !== null)
                        resolve(deserializeDevice(res))
                    else
                        resolve(null);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

async function deleteDevice(id) {
    return new Promise((resolve, reject) => {
        Device.deleteOne({
            deviceID: id
        }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

async function updateDevice(id, field, value) {

}

async function createGraph(graph) {
    if (!isGraphValid(graph)) {
        return null;
    }

    let serilizedGraph = serilizeGraph(graph);
    return new Promise((resolve, reject) => {
        try {
            const graphModel = new Graph({
                graphId: serilizedGraph.graphId,
                values: serilizedGraph.values
            });
            graphModel.save((saveError, savedUser) => {
                if (saveError)
                    reject(saveError);
                else
                    resolve(savedUser);
            });
        } catch (err) {
            reject(err);
        }
    });
}

async function getGraph(id) {

}

async function appendToGraph(id, startIndex, values) {

}

async function removePartOfGraph(id, startIndex, amount) {

}

/*
    SECTION: Helper Functions
*/

function serializeDevice(device) {
    device.programs = JSON.stringify(device.programs);
    device.uniqueProperties = JSON.stringify(device.uniqueProperties);
    return device;
}

function deserializeDevice(device) {
    device = device.toObject({
        getters: true,
        virtuals: true
    });
    device.programs = JSON.parse(device.programs);
    device.uniqueProperties = JSON.parse(device.uniqueProperties);
    return device;
}

function isGraphValid(graph) {
    return graph.values.length === 60
}

function serilizeGraph(graph) {
    graph.values = JSON.stringify(graph.values);
    return graph;
}

/*
    TODO: Remove
          For testing only
*/

function createDevicePrototype(id) {
    let program_0 = {
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

    let program_1 = {
        graph: [
            10,
            10,
            10,
        ]
    };

    let waterHeaterPrograms = [
        program_0,
        program_1
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

    let deviceWaterHeater_1 = {
        deviceID: id,
        isAutomatic: Boolean(false),
        currentPower: 132,
        currentState: "Off",
        deviceType: "Water Heater",
        isConnected: Boolean(true),
        programs: waterHeaterPrograms,
        uniqueProperties: waterHeaterProps
    };

    return deviceWaterHeater_1;
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
        graphId: "id",
        values: values
    };
    return graph;
}