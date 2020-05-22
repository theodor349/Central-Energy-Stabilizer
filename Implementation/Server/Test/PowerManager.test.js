const assert = require('assert');
const pm = require("./../PowerManager.js");
const dbG = require("./../DatabaseAccessorGraph.js");
const util = require("./../Utilities.js");
const uuid = require('uuidv4');

if (true) {
    describe('Power Manager', () => {
        it('addToDemand: device on at 3000W', async () => {
            await dbG.dropDatabase();
            await createSurplusGraph(10000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentPower = 3000;
            testDevice.currentState = "on";
            let res = await pm.addToDemand(testDevice);
            let date = new Date();
            let demandGraph = await dbG.getGraph(util.dateToId("demandGraph", date));
            assert(demandGraph.values[date.getMinutes()] === 3000 &&
                res === true);
        });
        it('addToDemand: device on at 1500W', async () => {
            await dbG.dropDatabase();
            await createSurplusGraph(10000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentPower = 1500;
            testDevice.currentState = "on";
            let res = await pm.addToDemand(testDevice);
            let date = new Date();
            let demandGraph = await dbG.getGraph(util.dateToId("demandGraph", date));
            assert(demandGraph.values[date.getMinutes()] === 1500 &&
                res === true);
        });
        it('addToDemand: device off at 0W', async () => {
            await dbG.dropDatabase();
            await createSurplusGraph(10000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentPower = 0;
            testDevice.currentState = "off";
            let res = await pm.addToDemand(testDevice);
            let date = new Date();
            let demandGraph = await dbG.getGraph(util.dateToId("demandGraph", date));
            assert(demandGraph.values[date.getMinutes()] === 0 &&
                res === false);
        });

        it('manageStats: when surplus and device is on at 3000W | baseload: 50 tick: 3600', async () => {
            await dbG.dropDatabase();
            await createSurplusGraph(10000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "on";
            testDevice.currentPower = 3000;
            pm.setBaseLoad(50);
            pm.setTicksPrHour(3600);
            let res = await pm.manageStats(testDevice);
            let statsGraph = await dbG.getGraph("powerStats");
            assert(res === true &&
                statsGraph.values[2] === 50 &&
                statsGraph.values[3] === 3000);
        });
        it('manageStats: when surplus and device is on at 3000W | baseload: 50 tick: 1800', async () => {
            await dbG.dropDatabase();
            await createSurplusGraph(10000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "on";
            testDevice.currentPower = 3000;
            pm.setBaseLoad(50);
            pm.setTicksPrHour(1800);
            let res = await pm.manageStats(testDevice);
            let statsGraph = await dbG.getGraph("powerStats");
            assert(res === true &&
                statsGraph.values[2] === 100 &&
                statsGraph.values[3] === 6000);
        });
        it('manageStats: when surplus and device is off at 0W | baseload: 50 tick: 3600', async () => {
            await dbG.dropDatabase();
            await createSurplusGraph(10000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "off";
            testDevice.currentPower = 0;
            pm.setBaseLoad(50);
            pm.setTicksPrHour(3600);
            let res = await pm.manageStats(testDevice);
            let statsGraph = await dbG.getGraph("powerStats");
            assert(res === true &&
                statsGraph.values[2] === 50 &&
                statsGraph.values[3] === 0);
        });
        it('manageStats: when not surplus and device is on at 3000W | baseload: 50 tick: 3600', async () => {
            await dbG.dropDatabase();
            await createSurplusGraph(-10000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "on";
            testDevice.currentPower = 3000;
            pm.setBaseLoad(50);
            pm.setTicksPrHour(3600);
            let res = await pm.manageStats(testDevice);
            let statsGraph = await dbG.getGraph("powerStats");
            assert(res === true &&
                statsGraph.values[0] === 50 &&
                statsGraph.values[1] === 3000);
        });
        it('manageStats: when not surplus and device is on at 3000W | baseload: 50 tick: 1800', async () => {
            await dbG.dropDatabase();
            await createSurplusGraph(-10000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "on";
            testDevice.currentPower = 3000;
            pm.setBaseLoad(50);
            pm.setTicksPrHour(1800);
            let res = await pm.manageStats(testDevice);
            let statsGraph = await dbG.getGraph("powerStats");
            assert(res === true &&
                statsGraph.values[0] === 100 &&
                statsGraph.values[1] === 6000);
        });
        it('manageStats: when not surplus and device is off at 0W | baseload: 50 tick: 3600', async () => {
            await dbG.dropDatabase();
            await createSurplusGraph(-10000);
            let testDevice = createAutoServerTestDevice();
            testDevice.currentState = "off";
            testDevice.currentPower = 0;
            pm.setBaseLoad(50);
            pm.setTicksPrHour(3600);
            let res = await pm.manageStats(testDevice);
            let statsGraph = await dbG.getGraph("powerStats");
            assert(res === true &&
                statsGraph.values[0] === 50 &&
                statsGraph.values[1] === 0);
        });
    });
}

/*
    SECTION: Helper functions
*/

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

// Creates a positive or negative surplus graph depending on input value
async function createSurplusGraph(value) {
    let date = new Date();
    let id = util.dateToId("surplusGraph", date);
    let values = [];

    for (i = 0; i < 60; i++) {
        values[i] = value;
    }

    return new Promise(async (resolve, reject) => {
        dbG.updateGraph(id, values)
            .then((val) => {
                resolve(true);
            })
            .catch((err) => {
                reject(err);
            })
    });
}
