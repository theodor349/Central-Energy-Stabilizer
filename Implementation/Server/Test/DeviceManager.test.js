const assert = require('assert');
const dm = require('./../DeviceManager.js');
const db = require('./../DatabaseAccessorDevice.js');
const uuid = require('uuidv4');

if (true) {
    describe('Device Manager', () => {

        // On Connect
        it('onConnect: Adds command to commandQueue', async () => {
            dm.onConnect("socket");
            let commandQueue = dm.getCommandQueue();
            assert(commandQueue !== undefined &&
                commandQueue.length === 1 &&
                commandQueue[0].socket === "socket" &&
                commandQueue[0].command === 'askForId');
        })

        // Receive ID
        it('receiveId: Connection with good uuId', async () => {
            let id = uuid.uuid();
            let res = dm.receiveId(id, "socket");
            let commandQueue = dm.getCommandQueue();
            assert(res === true &&
                commandQueue !== undefined &&
                commandQueue.length === 0);
        })
        it('receiveId: Connection with wrong uuId', async () => {
            let res = dm.receiveId("PLZ return false", "socket");
            let commandQueue = dm.getCommandQueue();
            assert(res === false &&
                commandQueue !== undefined &&
                commandQueue.length === 1 &&
                commandQueue[0].socket === "socket" &&
                commandQueue[0].command === 'setId' &&
                uuid.isUuid(commandQueue[0].payload));
        })
        it('receiveId: Connection without Id', async () => {
            let id;
            let res = dm.receiveId(id, "socket");
            let commandQueue = dm.getCommandQueue();
            assert(res === false &&
                commandQueue !== undefined &&
                commandQueue.length === 1 &&
                commandQueue[0].socket === "socket" &&
                commandQueue[0].command === 'setId' &&
                uuid.isUuid(commandQueue[0].payload));
        })

        // Device init
        it('deviceInit: Add device with correct id', async () => {
            // Setup
            db.dropDatabase();
            let testDevice = createAutoTestDevice();
            let id = testDevice.deviceId;
            // Run
            let res = await dm.deviceInit(testDevice, "socket")
            // Get things to check
            let commandQueue = dm.getCommandQueue();
            testDevice = createAutoTestDevice();
            let dbDevice = await db.getDevice(id);
            assert(res === true &&
                commandQueue !== undefined &&
                commandQueue.length === 0 &&
                dbDevice.scheduledByUser === false &&
                dbDevice.isScheduled === false &&
                dbDevice.nextState === null &&
                dbDevice.schedule === null &&
                dbDevice.scheduledInterval === null &&
                dbDevice.uniqueProperties.currentTemp === testDevice.uniqueProperties.currentTemp &&
                dbDevice.programs.length === testDevice.programs.length &&
                dbDevice.deviceType === testDevice.deviceType
            );
        })
        it('deviceInit: Add device with bad id', async () => {
            db.dropDatabase();
            let testDevice = createAutoTestDevice();
            testDevice.deviceId = "PLZ return false"
            let res = await dm.deviceInit(testDevice, "socket")
            let commandQueue = dm.getCommandQueue();
            let dbDevice = await db.getDevice(testDevice.deviceId);
            assert(res === false &&
                commandQueue !== undefined &&
                commandQueue.length === 0 &&
                dbDevice === null
            );
        })

        // On disconnect
        it('onDisconnect: Removes active connection', async () => {
            dm.clearAllConnections();
            let didRecievedId = dm.receiveId(uuid.uuid(), "socket");
            let didDisconnect = dm.onDisconnect("socket");
            let activeConnections = dm.getActiveConnections();
            assert(didRecievedId === true &&
                didDisconnect === true &&
                activeConnections.length === 0);
        });

        // Delete device
        it('deleteDevice: delete existing device', async () => {
            db.dropDatabase();
            dm.clearAllConnections();
            let testDevice = createAutoTestDevice();
            await dm.deviceInit(testDevice);
            let didRemove = await dm.deleteDevice(testDevice.deviceId);
            let activeConnections = dm.getActiveConnections();
            let dbDevice = await db.getDevice(testDevice.deviceId);
            assert(activeConnections.length === 0 &&
                dbDevice === null &&
                didRemove === true);
        });
        it('deleteDevice: delete non-existing device', async () => {
            db.dropDatabase();
            let id = uuid.uuid();
            let didRemove = await dm.deleteDevice(id);
            let dbDevice = await db.getDevice(id);
            assert(dbDevice === null &&
                didRemove === false);
        });

        // Update device
        it('updateDevice: changed currentState', async () => {
            db.dropDatabase();
            let testDevice = createAutoTestDevice();
            let id = testDevice.deviceId;
            await dm.deviceInit(testDevice);
            testDevice = createAutoTestDevice();
            testDevice.currentState = "off";
            testDevice.deviceId = id;
            let fieldsUpdated = await dm.updateDevice(testDevice);
            let dbDevice = await db.getDevice(id);
            let updatedDevices = dm.getUpdatedDevices();
            assert(fieldsUpdated === 1 &&
                updatedDevices[0] === id &&
                dbDevice.currentState === "off");
        });
        it('updateDevice: changed uniqueProperties', async () => {
            db.dropDatabase();
            let testDevice = createAutoTestDevice();
            let id = testDevice.deviceId;
            await dm.deviceInit(testDevice);
            testDevice = createAutoTestDevice();
            testDevice.uniqueProperties = {
                currentTemp: 80,
                minTemp: 55,
                maxTemp: 90
            };
            testDevice.deviceId = id;
            let fieldsUpdated = await dm.updateDevice(testDevice);
            let dbDevice = await db.getDevice(id);
            let updatedDevices = dm.getUpdatedDevices();
            assert(fieldsUpdated === 1 &&
                updatedDevices[0] === id &&
                dbDevice.uniqueProperties.currentTemp === 80);
        });
        it('updateDevice: with no changes to device', async () => {
            db.dropDatabase();
            let testDevice = createAutoTestDevice();
            let id = testDevice.deviceId;
            await dm.deviceInit(testDevice);
            let fieldsUpdated = await dm.updateDevice(testDevice);
            let updatedDevices = dm.getUpdatedDevices();
            assert(fieldsUpdated === 0 &&
                updatedDevices.length === 0);
        });
        it('updateDevice: no device on DB', async () => {
            db.dropDatabase();
            let testDevice = createAutoTestDevice();
            let id = testDevice.deviceId;
            let fieldsUpdated = await dm.updateDevice(testDevice);
            let updatedDevices = dm.getUpdatedDevices();
            assert(fieldsUpdated === 0 &&
                updatedDevices.length === 0);
        });

        // Manage device
        it('manageDevice: change state from on to off', async () => {
            db.dropDatabase();
            dm.getCommandQueue();
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "on";
            testDevice.schedule = {
                start: getRelativeDate(120, '-'),
                end: getRelativeDate(60, '-')
            }
            await dm.testDeviceInit(testDevice, "socket");
            let changedState = dm.manageDevice(testDevice);
            let commands = dm.getCommandQueue();
            assert(commands.length === 1 &&
                commands[0].command === "off" &&
                changedState === true);
        });
        it('manageDevice: change state from off to on', async () => {
            db.dropDatabase();
            dm.getCommandQueue();
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "off";
            testDevice.nextState = "on";
            testDevice.schedule = {
                start: getRelativeDate(120, '-'),
                end: getRelativeDate(60, '+')
            }
            await dm.testDeviceInit(testDevice, "socket");
            let changedState = dm.manageDevice(testDevice);
            let commands = dm.getCommandQueue();
            assert(commands.length === 1 &&
                commands[0].command === "on" &&
                commands[0].payload === "on" &&
                changedState === true);
        });
        it('manageDevice: keep on state when scheduled', async () => {
            db.dropDatabase();
            dm.getCommandQueue();
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "on";
            testDevice.nextState = "on";
            testDevice.schedule = {
                start: getRelativeDate(120, '-'),
                end: getRelativeDate(60, '+')
            }
            let changedState = dm.manageDevice(testDevice);
            let commands = dm.getCommandQueue();
            assert(commands.length === 0 &&
                changedState === false);
        });
        it('manageDevice: keep off state when scheduled', async () => {
            db.dropDatabase();
            dm.getCommandQueue();
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "off";
            testDevice.nextState = "on";
            testDevice.schedule = {
                start: getRelativeDate(60, '+'),
                end: getRelativeDate(120, '+')
            }
            let changedState = dm.manageDevice(testDevice);
            let commands = dm.getCommandQueue();
            assert(commands.length === 0 &&
                changedState === false);
        });

        // State Changed
        it('stateChanged: changed from on to off', async () => {
            db.dropDatabase();
            dm.getCommandQueue();
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "on";
            await dm.testDeviceInit(testDevice, "socket");
            let res = await dm.stateChanged(testDevice.deviceId, "off");
            let dbDevice = await db.getDevice(testDevice.deviceId);
            assert(dbDevice.currentState === "off" &&
                res === true);
        });
        it('stateChanged: changed from on to on', async () => {
            db.dropDatabase();
            dm.getCommandQueue();
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "on";
            await dm.testDeviceInit(testDevice, "socket");
            let res = await dm.stateChanged(testDevice.deviceId, "on");
            let dbDevice = await db.getDevice(testDevice.deviceId);
            assert(dbDevice.currentState === "on" &&
                res === true);
        });
        it('stateChanged: no device in DB', async () => {
            db.dropDatabase();
            dm.getCommandQueue();
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "on";
            let res = await dm.stateChanged(testDevice.deviceId, "on");
            assert(res === false);
        });

        // Remove Schedule
        it('removeSchedule: remove existing schedule', async () => {
            db.dropDatabase();
            dm.getCommandQueue();
            let testDevice = createAutoServerTestDevice();
            await dm.testDeviceInit(testDevice);
            let res = await dm.removeSchedule(testDevice.deviceId);
            let dbDevice = await db.getDevice(testDevice.deviceId);
            assert(res === true &&
                dbDevice.schedule === null &&
                dbDevice.scheduledInterval === null);
        });
        it('removeSchedule: remove nonexisting schedule', async () => {
            db.dropDatabase();
            dm.getCommandQueue();
            let testDevice = createAutoServerTestDevice();
            testDevice.schedule = null;
            testDevice.scheduledInterval = null;
            await dm.testDeviceInit(testDevice);
            let res = await dm.removeSchedule(testDevice.deviceId);
            let dbDevice = await db.getDevice(testDevice.deviceId);
            assert(res === true &&
                dbDevice.schedule === null &&
                dbDevice.scheduledInterval === null);
        });
        it('removeSchedule: no device in DB', async () => {
            db.dropDatabase();
            dm.getCommandQueue();
            let testDevice = createAutoServerTestDevice();
            let res = await dm.removeSchedule(testDevice.deviceId);
            let dbDevice = await db.getDevice(testDevice.deviceId);
            assert(res === false);
        });
    })
}

/*
    SECTION: Helper Functions
*/

function getRelativeDate(mins, operator) {
    let date = new Date();
    if (operator === '+') {
        date.setHours(date.getHours() + mins / 60);
        date.setMinutes(date.getMinutes() + mins % 60);
    } else {
        date.setHours(date.getHours() - mins / 60);
        date.setMinutes(date.getMinutes() - mins % 60);
    }
    return date;
}

function createAutoTestDevice() {
    let testDevice = {
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
    return testDevice;
}

function createAutoServerTestDevice() {
    let serverTestDevice = {
        scheduledByUser: false,
        isScheduled: false,
        nextState: "",
        schedule: {
            start: new Date(),
            end: new Date()
        },
        scheduledInterval: {
            start: new Date(),
            end: new Date()
        },

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