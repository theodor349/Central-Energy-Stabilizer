const assert = require('assert');
const dm = require('./../DeviceManager.js');
const db = require('./../DatabaseAccessorDevice.js');
const um = require('./../UserManager.js');
const uuid = require('uuidv4');

if (true) {
    describe('User Manager', () => {

        // On Connect
        it('onConnect: 0 devices', async () => {
            await db.dropDatabase();
            let connectedDevices = [];
            await um.onConnect("socket", connectedDevices);
            let commandQueue = um.getCommandQueue();
            assert(commandQueue.length === 0 &&
                connectedDevices.length === 0);
        })
        it('onConnect: 1 device', async () => {
            await db.dropDatabase();
            let testDevice = createAutoServerTestDevice();
            await dm.testDeviceInit(testDevice);
            let connectedDevices = [{
                deviceId: testDevice.deviceId
            }];
            await um.onConnect("socket", connectedDevices);
            let commandQueue = um.getCommandQueue();
            assert(commandQueue.length === 1 &&
                connectedDevices.length === 1);
        })

        it('onConnect: 2 devices', async () => {
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
            await um.onConnect("socket", connectedDevices);
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
        /*
        it('graphUpdate: ', async () => {

            um.graphUpdate();
            assert();
        })
        */
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
