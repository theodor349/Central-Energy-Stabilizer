const assert = require('assert');
const dm = require('./../DeviceManager.js');
const db = require('./../DatabaseAccessorDevice.js');
const daG = require('./../DatabaseAccessorGraph.js');
const um = require('./../UserManager.js');
const uuid = require('uuidv4');
const util = require('./../Utilities.js');

if (false) {
    describe('User Manager: Devices', () => {

        // On Connect
        it('onConnectDevice: 0 devices', async () => {
            await db.dropDatabase();
            let connectedDevices = [];
            await um.onConnectDevice("socket", connectedDevices);
            let commandQueue = um.getCommandQueue();
            assert(commandQueue.length === 0 &&
                connectedDevices.length === 0);
        })
        it('onConnectDevice: 1 device', async () => {
            await db.dropDatabase();
            let testDevice = createAutoServerTestDevice();
            await dm.testDeviceInit(testDevice);
            let connectedDevices = [{
                deviceId: testDevice.deviceId
            }];
            await um.onConnectDevice("socket", connectedDevices);
            let commandQueue = um.getCommandQueue();
            assert(commandQueue.length === 1 &&
                connectedDevices.length === 1);
        })

        it('onConnectDevice: 2 devices', async () => {
            await db.dropDatabase();
            let testDevice = createAutoServerTestDevice();
            let testDevice2 = createAutoServerTestDevice();
            await dm.testDeviceInit(testDevice);
            await dm.testDeviceInit(testDevice2);
            let connectedDevices = [{
                    deviceId: testDevice.deviceId
                },
                {
                    deviceId: testDevice2.deviceId
                }
            ];
            await um.onConnectDevice("socket", connectedDevices);
            let commandQueue = um.getCommandQueue();
            assert(commandQueue.length === 2 &&
                connectedDevices.length === 2);
        })

        // Send Updated Devices
        it('sendUpdatedDevices: 0 updated devices', async () => {
            await db.dropDatabase();
            let testDevice = createAutoServerTestDevice();
            await dm.testDeviceInit(testDevice);
            let updatedDevices = [];
            await um.sendUpdatedDevices(updatedDevices);
            let commandQueue = um.getCommandQueue();
            assert(commandQueue.length === updatedDevices.length);
        })
        it('sendUpdatedDevices: 1 updated device', async () => {
            await db.dropDatabase();
            let testDevice = createAutoServerTestDevice();
            await dm.testDeviceInit(testDevice);
            let updatedDevices = [testDevice.deviceId];
            await um.sendUpdatedDevices(updatedDevices);
            let commandQueue = um.getCommandQueue();
            assert(commandQueue.length === updatedDevices.length);
        })
        it('sendUpdatedDevices: 2 updated device', async () => {
            await db.dropDatabase();
            let testDevice = createAutoServerTestDevice();
            let testDevice2 = createAutoServerTestDevice();
            await dm.testDeviceInit(testDevice);
            await dm.testDeviceInit(testDevice2);
            let updatedDevices = [testDevice.deviceId, testDevice2.deviceId];
            await um.sendUpdatedDevices(updatedDevices);
            let commandQueue = um.getCommandQueue();
            assert(commandQueue.length === updatedDevices.length);
        })

    })
    describe('User Manager: Graphs', () => {
        // onConnectDevice
        it('onConnectDevice: send all 24 API Surplus Graphs', async () => {
            await createAPISurplusGraph(1000);
            let date = new Date(2020, 6, 6, )
            await um.sendAPISurplusGraph("Socket", new Date());

            let commandQueue = um.getCommandQueue();
            assert(commandQueue.length === 25 &&
                commandQueue[24].payload.values === "done" &&
                commandQueue[24].payload.name === "apiSurplusGraph" &&
                commandQueue[0].payload.values.length === 60 &&
                commandQueue[23].payload.values.length === 60 &&
                commandQueue[0].payload.values[0] === 1000 &&
                commandQueue[23].payload.values[0] === 0);
        })
        it('onConnectDevice: send all 24 Surplus Graphs', async () => {
            await createSurplusGraph(1000);
            let date = new Date(2020, 6, 6, )
            await um.sendSurplusGraph("Socket", new Date());

            let commandQueue = um.getCommandQueue();
            // TODO: Test for multiple days
            assert(commandQueue.length === 25 &&
                // Surplus
                commandQueue[24].payload.values === "done" &&
                commandQueue[24].payload.name === "surplusGraph" &&
                commandQueue[0].payload.values.length === 60 &&
                commandQueue[23].payload.values.length === 60 &&
                commandQueue[0].payload.values[0] === 1000 &&
                commandQueue[23].payload.values[0] === 0);
        })

        // graphUpdate
        it('graphUpdate: send all 1 point', async () => {

            let commandQueue = um.getCommandQueue();
            assert(false);
        })
    })

    function createAutoServerTestDevice() {
        let serverTestDevice = {
            scheduledByUser: false,
            isScheduled: false,
            nextState: null,
            schedule: null,
            scheduledInterval: null,

            deviceId: uuid.uuid(),
            isAutomatic: true,
            currentPower: 123,
            currentState: "on",
            deviceType: "Water Heater",
            onDisconnect: false,
            serverMessage: null,
            graphIndex: 0,
            programs: [{
                    pointArray: [
                        45,
                        53,
                        56,
                        60,
                        69
                    ]
                },
                {
                    pointArray: [
                        47,
                        43,
                        49,
                        56,
                        60
                    ]
                }
            ],
            uniqueProperties: {
                currentTemp: 91,
                minTemp: 55,
                maxTemp: 90
            }
        };
        return serverTestDevice;
    }
}

/*
    Helper Functions
*/

// Creates a positive or negative surplus graph depending on input value
async function createSurplusGraph(value) {
    let date = new Date();
    let id = util.dateToId("surplusGraph", date);
    let values = [];

    for (i = 0; i < 60; i++) {
        values[i] = value;
    }

    return new Promise(async (resolve, reject) => {
        daG.updateGraph(id, values)
            .then((val) => {
                resolve(true);
            })
            .catch((err) => {
                reject(err);
            })
    });
}
async function createAPISurplusGraph(value) {
    let date = new Date();
    let id = util.dateToId("apiSurplusGraph", date);
    let values = [];

    for (i = 0; i < 60; i++) {
        values[i] = value;
    }

    return new Promise(async (resolve, reject) => {
        daG.updateGraph(id, values)
            .then((val) => {
                resolve(true);
            })
            .catch((err) => {
                reject(err);
            })
    });
}
async function createDemandGraph(value) {
    let date = new Date();
    let id = util.dateToId("surplusGraph", date);
    let values = [];

    for (i = 0; i < 60; i++) {
        values[i] = value;
    }

    return new Promise(async (resolve, reject) => {
        daG.updateGraph(id, values)
            .then((val) => {
                resolve(true);
            })
            .catch((err) => {
                reject(err);
            })
    });
}