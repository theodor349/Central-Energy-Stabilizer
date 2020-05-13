const assert = require('assert');
const daD = require('./../DatabaseAccessorDevice.js');
const daG = require('./../DatabaseAccessorGraph.js');
const dm = require('./../DeviceManager.js');
const scheduler = require('./../Scheduler.js');
const util = require('./../Utilities.js');
const uuid = require('uuidv4');

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
            currentTemp: 80,
            minTemp: 55,
            maxTemp: 90
        }

    };
    return serverTestDevice;
}

if (true) {
    describe('Scheduler', () => {

        // Schedule device
        it('scheduleDevice: Schedule automatic device from "off" to "on" when surplus', async () => {
            daG.dropDatabase();
            daD.dropDatabase();
            scheduler.getCommandQueue();
            scheduler.clearUpdatedDevices();

            await createSurplusGraph(1000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "off";
            await dm.testDeviceInit(testDevice);

            let res = await scheduler.scheduleDevice(testDevice);
            let dbDevice = await daD.getDevice(testDevice.deviceId);
            let updatedDevices = scheduler.getUpdatedDevices();

            assert(res === true &&
                dbDevice.nextState === "on" &&
                dbDevice.isScheduled === true &&
                updatedDevices.length === 1);

        })
        it('scheduleDevice: Schedule automatic device from "on" to "off" when no surplus', async () => {
            daG.dropDatabase();
            daD.dropDatabase();
            scheduler.getCommandQueue();
            scheduler.clearUpdatedDevices();

            await createSurplusGraph(-1000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "on";
            await dm.testDeviceInit(testDevice);

            let res = await scheduler.scheduleDevice(testDevice);

            let dbDevice = await daD.getDevice(testDevice.deviceId);
            let updatedDevices = scheduler.getUpdatedDevices();

            assert(res === true &&
                dbDevice.nextState === "off" &&
                dbDevice.isScheduled === true &&
                updatedDevices.length === 1);
        })
        it('scheduleDevice: When already scheduled to "off" when surplus', async () => {
            daG.dropDatabase();
            daD.dropDatabase();
            scheduler.getCommandQueue();
            scheduler.clearUpdatedDevices();

            await createSurplusGraph(1000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "off";
            testDevice.isScheduled = true;
            testDevice.nextState = "off";
            await dm.testDeviceInit(testDevice);

            let res = await scheduler.scheduleDevice(testDevice);
            let dbDevice = await daD.getDevice(testDevice.deviceId);
            let updatedDevices = scheduler.getUpdatedDevices();

            assert(res === true &&
                dbDevice.nextState === "on" &&
                dbDevice.isScheduled === true &&
                updatedDevices.length === 1);
        })
        it('scheduleDevice: When already scheduled to "off" when no surplus', async () => {
            daG.dropDatabase();
            daD.dropDatabase();
            scheduler.getCommandQueue();
            scheduler.clearUpdatedDevices();

            await createSurplusGraph(-1000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "off";
            testDevice.isScheduled = true;
            testDevice.nextState = "off";
            await dm.testDeviceInit(testDevice);

            let res = await scheduler.scheduleDevice(testDevice);
            let dbDevice = await daD.getDevice(testDevice.deviceId);
            let updatedDevices = scheduler.getUpdatedDevices();

            assert(res === false &&
                dbDevice.nextState === "off" &&
                dbDevice.isScheduled === true &&
                updatedDevices.length === 0);
        })
    });
}

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