const assert = require('assert');
const daD = require('./../DatabaseAccessorDevice.js');
const scheduler = require('./../Scheduler.js');
const dm = require('./../DeviceManager.js');
const uuid = require('uuidv4');
const daG = require('./../DatabaseAccessorGraph.js');
const util = require('./../Utilities.js');

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

if (false) {
    describe('Scheduler', () => {

        // Schedule device
        it('scheduleDevice: Schedule automatic device to "on" when surplus', async() => {
            // createTestDevice
            // scheduleDevice(testDevice)
            // getDevice from database
            // check if surplus > 0 && dbDevice.nextState === "on"
            //       or surplus < 0 && dbDevice.nextState === "off"
            await createSurplusGraph(1000);

            let testDevice = createAutoServerTestDevice();
            
            await dm.testDeviceInit(testDevice);

            let res = await scheduler.scheduleDevice(testDevice);

            let dbDevice = await daD.getDevice(testDevice.deviceId);

            assert(res === true && 
                dbDevice.nextState === "on" &&
                dbDevice.isScheduled === true);
                          
            // Check UpdatedDevices.length = 1
        })
        it('scheduleDevice: Schedule automatic device to "off" when no surplus', async() => {     
            await createSurplusGraph(-1000);

            let testDevice = createAutoServerTestDevice();
            
            await dm.testDeviceInit(testDevice);

            let res = await scheduler.scheduleDevice(testDevice);

            let dbDevice = await daD.getDevice(testDevice.deviceId);

            assert(res === true && 
                dbDevice.nextState === "off" &&
                dbDevice.isScheduled === true);
                          
            // Check UpdatedDevices.length = 1
        })
        it('scheduleDevice: When already scheduled to "off" when surplus', async() => {     
            await createSurplusGraph(1000);

            let testDevice = createAutoServerTestDevice();

            testDevice.isScheduled = true;
            testDevice.nextState = "off";
            
            await dm.testDeviceInit(testDevice);

            let res = await scheduler.scheduleDevice(testDevice);

            let dbDevice = await daD.getDevice(testDevice.deviceId);

            assert(res === true && 
                dbDevice.nextState === "on" &&
                dbDevice.isScheduled === true);
            
            // Check UpdatedDevices.length = 1
        })
        it('scheduleDevice: When already scheduled to "off" when no surplus', async() => {     
            await createSurplusGraph(-1000);

            let testDevice = createAutoServerTestDevice();

            testDevice.isScheduled = true;
            testDevice.nextState = "off";
            
            await dm.testDeviceInit(testDevice);

            let res = await scheduler.scheduleDevice(testDevice);

            let dbDevice = await daD.getDevice(testDevice.deviceId);

            assert(res === false && 
                dbDevice.nextState === "off" &&
                dbDevice.isScheduled === true);

            // Check UpdatedDevices.length = 0
        })
        /*
        it('scheduleDevice: Database is updated with the correct schedule', async() => {
            let testDevice = createAutoServerTestDevice();

            await dm.testDeviceInit(testDevice);
            
            await scheduler.scheduleDevice(testDevice.deviceId);

            let dbDevice = await daD.getDevice(testDevice.deviceId);

            let expectedSchedule = {
                start: new Date(2010, 1, 24, 15, 30),
                end: new Date(2010, 1, 24, 15, 35)
            }

            assert(JSON.stringify(expectedSchedule.start) === JSON.stringify(dbDevice.schedule.start) &&
                   JSON.stringify(expectedSchedule.end) === JSON.stringify(dbDevice.schedule.end));
        
        });
        */

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

async function createSurplusGraph (value) {
    let date = new Date();
    let id = util.dateToId("surplusGraph", date);
    let values = [];

    for (i = 0; i < 60; i++) {
        values[i] = value;
    }

    return new Promise (async (resolve, reject) => {
        daG.updateGraph(id, values)
            .then((val) => {
                resolve(true);
            })
            .catch((err) => {
                reject(err);
            })
    });
}
