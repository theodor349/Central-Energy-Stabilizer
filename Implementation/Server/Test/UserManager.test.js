const assert = require('assert');
const dm = require('./../DeviceManager.js');
const db = require('./../DatabaseAccessorDevice.js');
const um = require('./../UserManager.js');
const uuid = require('uuidv4');

if (true) {
    describe('User Manager', () => {

        // On Connect
        it('onConnect: 0 devices', async () => {
            db.dropDatabase();
            dm.clearAllConnections();
            let connectedDevices = dm.getActiveConnections();
            let commandQueue = um.getCommandQueue();
            um.onConnect("socket", connectedDevices);
            assert(commandQueue.length === 0 &&
                connectedDevices.length === 0);
        })
        it('onConnect: 1 device', async () => {
            db.dropDatabase();
            dm.clearAllConnections()
            let testDevice = createAutoServerTestDevice();
            await dm.testDeviceInit(testDevice);
            let connectedDevices = dm.getActiveConnections();
            um.onConnect("socket", connectedDevices);
            let commandQueue = um.getCommandQueue();
            assert(commandQueue.length === 1 &&
                connectedDevices.length === 1);
        })
        it('onConnect: 2 devices', async () => {
            db.dropDatabase();
            dm.clearAllConnections()
            let testDevice = createAutoServerTestDevice();
            let testDevice2 = createAutoServerTestDevice();
            await dm.testDeviceInit(testDevice);
            await dm.testDeviceInit(testDevice2);
            let connectedDevices = dm.getActiveConnections();
            um.onConnect("socket", connectedDevices);
            let commandQueue = um.getCommandQueue();
            assert(commandQueue.length === 2 &&
                connectedDevices.length === 2);
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
