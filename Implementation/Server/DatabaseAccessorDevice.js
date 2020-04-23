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

/*
    SECTION: Setup Functions
*/

run('mongodb://localhost:27017/P2Test').catch(error => console.log(error.stack));
async function run(connectionString) {
    await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    //test();
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
                    if (res !== null) {
                        resolve(deserializeDevice(res))
                    } else
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
    console.log("ID: " + id);
    return new Promise((resolve, reject) => {
        getDeviceHelper(id)
            .then((device) => {
                if (device === null)
                    resolve(false);

                let conditions = {
                    deviceID: id
                };
                let update = {
                    isConnected: false,
                    currentPower: 100
                };
                let options = {};

                Device.updateOne(conditions, update, options, (err, success) => {
                    if (err)
                        reject(err);
                    if (success.ok === 1 && success.nModified === 1) {
                        resolve(true);
                    } else
                        resolve(false);
                });
            })
            .catch((err) => {
                reject(err);
            });
        /*
        Device.findOne({
            deviceID: id
        }, (err) => {
            if (err) {
                reject(err);
            } else {
                Device.field = value;
                Device.save((saveError, savedUser) => {
                    if (saveError) {
                        reject(saveError);
                    } else {
                        resolve(savedUser);
                    }
                });
                resolve(true);
            }
       });
       */
    });
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

function getDeviceHelper(id) {
    return new Promise((resolve, reject) => {
        try {
            Device.findOne({
                deviceID: id
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    if (res !== null)
                        resolve(res);
                    else
                        resolve(null);
                }
            });
        } catch (err) {
            reject(err);
        }
    });

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